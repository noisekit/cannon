import _ from 'lodash';
import path from 'path';
import { task, types } from 'hardhat/config';
import { TASK_COMPILE } from 'hardhat/builtin-tasks/task-names';

import loadCannonfile from '../internal/load-cannonfile';
import { CannonRegistry, ChainBuilder, downloadPackagesRecursive, Events, getChartDir, getSavedChartsDir } from '@usecannon/builder';
import { SUBTASK_RPC, SUBTASK_WRITE_DEPLOYMENTS, TASK_BUILD } from '../task-names';
import { HttpNetworkConfig } from 'hardhat/types';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { existsSync } from 'fs';

task(TASK_BUILD, 'Assemble a defined chain and save it to to a state which can be used later')
  .addFlag('noCompile', 'Do not execute hardhat compile before build')
  .addOptionalParam('file', 'TOML definition of the chain to assemble', 'cannonfile.toml')
  .addOptionalParam(
    'dryRun',
    'When deploying to a live network, instead deploy and start a local hardhat node. Specify the target network here',
    undefined,
    types.string
  )
  .addOptionalParam(
    'port',
    'If declared, keep running with hardhat network exposed to the specified local port',
    undefined,
    types.int
  )
  .addFlag('wipe', 'Start from scratch, dont use any cached artifacts')
  .addOptionalParam('preset', 'Specify the preset label the given settings should be applied', 'main')
  .addOptionalVariadicPositionalParam('options', 'Key values of chain which should be built')
  .setAction(async ({ noCompile, file, options, dryRun, port, preset, wipe }, hre) => {
    if (!noCompile) {
      await hre.run(TASK_COMPILE);
    }

    const filepath = path.resolve(hre.config.paths.root, file);

    // options can be passed through commandline, or environment
    const mappedOptions: { [key: string]: string } = _.fromPairs((options || []).map((kv: string) => kv.split('=')));
    const def = loadCannonfile(hre, filepath);
    const { name, version } = def;

    let builder: ChainBuilder;
    if (dryRun) {
      // local build with forked network
      if (hre.network.name != 'hardhat') throw new Error('Hardhat selected network must be `hardhat` in order to dryRun.');

      const network = hre.config.networks[dryRun] as HttpNetworkConfig;

      if (!network) throw new Error('Selected dryRun network not found in hardhat configuration');

      if (!network.chainId) throw new Error('Selected network must have chainId set in hardhat configuration');

      const provider = await hre.run(SUBTASK_RPC, { port: port || 8545 });

      builder = new ChainBuilder({
        name,
        version,
        def,
        preset,

        readMode: wipe ? 'none' : 'metadata',
        writeMode: 'none',

        chainId: 31337,
        provider,
        baseDir: hre.config.paths.root,
        savedChartsDir: hre.config.paths.cannon,
        async getSigner(addr: string) {
          return hre.ethers.getSigner(addr);
        },

        async getDefaultSigner() {
          return (await hre.ethers.getSigners())[0];
        },

        async getArtifact(name: string) {
          return hre.artifacts.readArtifact(name);
        },
      });
    } else if (hre.network.name === 'hardhat') {
      // clean hardhat network build
      const provider = await hre.run(SUBTASK_RPC, { port: port || 8545 });

      builder = new ChainBuilder({
        name,
        version,
        def,
        preset,

        readMode: wipe ? 'none' : 'all',
        writeMode: 'all',

        provider,
        chainId: 31337,
        baseDir: hre.config.paths.root,
        savedChartsDir: hre.config.paths.cannon,
        async getSigner(addr: string) {
          return provider.getSigner(addr);
        },

        async getArtifact(name: string) {
          return hre.artifacts.readArtifact(name);
        },
      });
    } else {
      // deploy to live network
      builder = new ChainBuilder({
        name,
        version,
        def,
        preset,

        readMode: wipe ? 'none' : 'metadata',
        writeMode: 'metadata',

        provider: hre.ethers.provider as unknown as ethers.providers.JsonRpcProvider,
        chainId: hre.network.config.chainId || (await hre.ethers.provider.getNetwork()).chainId,
        baseDir: hre.config.paths.root,
        savedChartsDir: hre.config.paths.cannon,
        async getSigner(addr: string) {
          return hre.ethers.getSigner(addr);
        },

        async getDefaultSigner() {
          return (await hre.ethers.getSigners())[0];
        },

        async getArtifact(name: string) {
          return hre.artifacts.readArtifact(name);
        },
      });
    }

    console.log('chart dirs', builder.chartsDir, builder.chartDir);

    const registry = new CannonRegistry({
      ipfsOptions: hre.config.cannon.ipfsConnection,
      signerOrProvider: hre.config.cannon.registryEndpoint
        ? new JsonRpcProvider(hre.config.cannon.registryEndpoint)
        : hre.ethers.provider,
      address: hre.config.cannon.registryAddress,
    });

    const dependencies = await builder.getDependencies(mappedOptions);

    for (const dependency of dependencies) {
      console.log(`Loading dependency tree ${dependency.source} (${dependency.chainId}-${dependency.preset})`);
      await downloadPackagesRecursive(dependency.source, dependency.chainId, dependency.preset, registry, builder.chartsDir);
    }

    builder.on(Events.PreStepExecute, (t, n) => console.log(`\nexec: ${t}.${n}`));
    builder.on(Events.DeployContract, (c) => console.log(`deployed contract ${c.address}`));
    builder.on(Events.DeployTxn, (t) => console.log(`ran txn ${t.hash}`));

    const outputs = await builder.build(mappedOptions);

    console.log('outputs', outputs);

    await hre.run(SUBTASK_WRITE_DEPLOYMENTS, {
      outputs,
    });

    if (port) {
      console.log('RPC Server open on port', port);

      // dont exit
      await new Promise(() => {});
    }

    return {};
  });
