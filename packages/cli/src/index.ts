import path from 'node:path';
import { spawn } from 'child_process';
import { ethers } from 'ethers';
import { Command } from 'commander';
import {
  CannonWrapperGenericProvider,
  ChainDefinition,
  getOutputs,
  ChainBuilderRuntime,
  ChainArtifacts,
  CannonStorage,
} from '@usecannon/builder';

import { checkCannonVersion, loadCannonfile } from './helpers';
import { parsePackageArguments, parsePackagesArguments, parseSettings } from './util/params';

import pkg from '../package.json';
import { PackageSpecification } from './types';
import { CannonRpcNode, getProvider, runRpc } from './rpc';

import './custom-steps/run';

export * from './types';
export * from './constants';
export * from './util/params';

import { interact } from './commands/interact';
import { getContractsRecursive } from './util/contracts-recursive';
import { createDefaultReadRegistry, createDryRunRegistry } from './registry';
import { resolveCliSettings } from './settings';

import { installPlugin, removePlugin } from './plugins';
import Debug from 'debug';
import { writeModuleDeployments } from './util/write-deployments';
import { getFoundryArtifact } from './foundry';
import { resolveRegistryProvider, resolveWriteProvider } from './util/provider';
import { getMainLoader } from './loader';
import { bold, green, red, yellow } from 'chalk';

const debug = Debug('cannon:cli');

// Can we avoid doing these exports here so only the necessary files are loaded when running a command?
export { ChainDefinition, DeploymentInfo } from '@usecannon/builder';
export { alter } from './commands/alter';
export { build } from './commands/build';
export { clean } from './commands/clean';
export { inspect } from './commands/inspect';
export { publish } from './commands/publish';
export { run } from './commands/run';
export { verify } from './commands/verify';
export { setup } from './commands/setup';
export { runRpc, getProvider } from './rpc';

export { createDefaultReadRegistry, createDryRunRegistry } from './registry';
export { resolveProviderAndSigners } from './util/provider';
export { resolveCliSettings } from './settings';
export { getFoundryArtifact } from './foundry';
export { loadCannonfile } from './helpers';

import { listInstalledPlugins } from './plugins';
import prompts from 'prompts';
import { pickAnvilOptions } from './util/anvil';
import commandsConfig from './commandsConfig';

const program = new Command();

program
  .name('cannon')
  .version(pkg.version)
  .description('Run a cannon package on a local node')
  .enablePositionalOptions()
  .hook('preAction', async function () {
    await checkCannonVersion(pkg.version);
  });

configureRun(program);
configureRun(program.command('run'));

function applyCommandsConfig(command: Command, config: any) {
  if (config.description) {
    command.description(config.description);
  }
  if (config.usage) {
    command.usage(config.usage);
  }
  if (config.arguments) {
    config.arguments.map((argument: any) => {
      if (argument.flags === '<packageNames...>') {
        command.argument(argument.flags, argument.description, parsePackagesArguments, argument.defaultValue);
      } else if (command.name() === 'interact' && argument.flags === '<packageName>') {
        command.argument(argument.flags, argument.description, parsePackageArguments, argument.defaultValue);
      } else {
        command.argument(argument.flags, argument.description, argument.defaultValue);
      }
    });
  }
  if (config.anvilOptions) {
    config.anvilOptions.map((option: any) => {
      option.required
        ? command.requiredOption(option.flags, option.description, option.defaultValue)
        : command.option(option.flags, option.description, option.defaultValue);
    });
  }
  if (config.options) {
    config.options.map((option: any) => {
      option.required
        ? command.requiredOption(option.flags, option.description, option.defaultValue)
        : command.option(option.flags, option.description, option.defaultValue);
    });
  }
  return command;
}

function configureRun(program: Command) {
  return applyCommandsConfig(program, commandsConfig.run).action(async function (
    packages: PackageSpecification[],
    options,
    program
  ) {
    const { run } = await import('./commands/run');

    options.port = Number.parseInt(options.port) || 8545;

    let node: CannonRpcNode;
    if (options.chainId) {
      const settings = resolveCliSettings(options);

      const { provider } = await resolveWriteProvider(settings, Number.parseInt(options.chainId));

      if (options.providerUrl) {
        const providerChainId = (await provider.getNetwork()).chainId;
        if (providerChainId != options.chainId) {
          throw new Error(
            `Supplied providerUrl's blockchain chainId ${providerChainId} does not match with chainId you provided ${options.chainId}`
          );
        }
      }

      node = await runRpc(pickAnvilOptions(options), {
        forkProvider: provider.passThroughProvider as ethers.providers.JsonRpcProvider,
      });
    } else {
      node = await runRpc(pickAnvilOptions(options));
    }

    await run(packages, {
      ...options,
      node,
      helpInformation: program.helpInformation(),
    });
  });
}

async function doBuild(cannonfile: string, settings: string[], opts: any): Promise<[CannonRpcNode | null, ChainArtifacts]> {
  // set debug verbosity
  switch (true) {
    case opts.Vvvv:
      Debug.enable('cannon:*');
      break;
    case opts.Vvv:
      Debug.enable('cannon:builder*');
      break;
    case opts.Vv:
      Debug.enable('cannon:builder,cannon:builder:definition');
      break;
    case opts.v:
      Debug.enable('cannon:builder');
      break;
  }

  debug('do build called with', cannonfile, settings, opts);
  // If the first param is not a cannonfile, it should be parsed as settings
  if (cannonfile !== '-' && !cannonfile.endsWith('.toml')) {
    settings.unshift(cannonfile);
    cannonfile = 'cannonfile.toml';
  }

  const publicSourceCode = true; // TODO: foundry doesn't really have a way to specify whether the contract sources should be public or private
  const parsedSettings = parseSettings(settings);

  const cannonfilePath = path.resolve(cannonfile);
  const projectDirectory = path.resolve(cannonfilePath);

  const cliSettings = resolveCliSettings(opts);

  let provider: CannonWrapperGenericProvider;
  let node: CannonRpcNode | null = null;

  let getSigner: ((s: string) => Promise<ethers.Signer>) | undefined = undefined;
  let getDefaultSigner: (() => Promise<ethers.Signer>) | undefined = undefined;

  let chainId: number | undefined = undefined;

  if (!opts.chainId && !opts.providerUrl) {
    // doing a local build, just create a anvil rpc
    node = await runRpc({
      ...pickAnvilOptions(opts),
      // https://www.lifewire.com/port-0-in-tcp-and-udp-818145
      port: 0,
    });

    provider = getProvider(node);
  } else {
    if (opts.providerUrl && !opts.chainId) {
      const _provider = new ethers.providers.JsonRpcProvider(opts.providerUrl);
      chainId = (await _provider.getNetwork()).chainId;
    } else {
      chainId = opts.chainId;
    }
    const p = await resolveWriteProvider(cliSettings, chainId as number);

    if (opts.dryRun) {
      node = await runRpc(
        {
          ...pickAnvilOptions(opts),
          chainId,
          // https://www.lifewire.com/port-0-in-tcp-and-udp-818145
          port: 0,
        },
        {
          forkProvider: p.provider.passThroughProvider as ethers.providers.JsonRpcProvider,
        }
      );

      provider = getProvider(node);

      // need to set default signer to make sure it is accurate to the actual signer
      getDefaultSigner = async () => {
        const addr = p.signers.length > 0 ? await p.signers[0].getAddress() : '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
        await provider.send('hardhat_impersonateAccount', [addr]);
        await provider.send('hardhat_setBalance', [addr, `0x${(1e22).toString(16)}`]);
        return provider.getSigner(addr);
      };
    } else {
      provider = p.provider;

      getSigner = async (s) => {
        for (const signer of p.signers) {
          if ((await signer.getAddress()) === s) {
            return signer;
          }
        }

        throw new Error(
          `signer not found for address ${s}. Please add the private key for this address to your command line.`
        );
      };

      getDefaultSigner = async () => p.signers[0];
    }
  }

  const { build } = await import('./commands/build');
  const { name, version, def } = await loadCannonfile(cannonfilePath);

  const { outputs } = await build({
    provider,
    def,
    packageDefinition: {
      name,
      version,
      settings: parsedSettings,
    },
    pkgInfo: {},
    getArtifact: (name) => getFoundryArtifact(name, projectDirectory),
    getSigner,
    getDefaultSigner,
    upgradeFrom: opts.upgradeFrom,
    presetArg: opts.preset,
    wipe: opts.wipe,
    persist: !opts.dryRun,
    overrideResolver: opts.dryRun ? await createDryRunRegistry(cliSettings) : undefined,
    publicSourceCode,
    providerUrl: cliSettings.providerUrl,

    gasPrice: opts.gasPrice,
    gasFee: opts.maxGasFee,
    priorityGasFee: opts.maxPriorityGasFee,
  });

  return [node, outputs];
}
applyCommandsConfig(program.command('build'), commandsConfig.build)
  .showHelpAfterError('Use --help for more information.')
  .action(async (cannonfile, settings, opts) => {
    const cannonfilePath = path.resolve(cannonfile);
    const projectDirectory = path.dirname(cannonfilePath);

    console.log(bold('Building the foundry project using forge build...'));
    if (!opts.skipCompile) {
      const forgeBuildProcess = spawn('forge', ['build'], { cwd: projectDirectory });
      await new Promise((resolve) => {
        forgeBuildProcess.on('exit', (code) => {
          if (code === 0) {
            console.log(green('forge build succeeded'));
          } else {
            console.log(red('forge build failed'));
            console.log('Continuing with cannon build...');
          }
          resolve(null);
        });
      });
    } else {
      console.log(yellow('Skipping forge build...'));
    }

    const [node] = await doBuild(cannonfile, settings, opts);

    node?.kill();
  });

applyCommandsConfig(program.command('verify'), commandsConfig.verify).action(async function (packageName, options) {
  const { verify } = await import('./commands/verify');
  await verify(packageName, options.apiKey, options.preset, options.chainId);
});

applyCommandsConfig(program.command('alter'), commandsConfig.alter).action(async function (
  packageName,
  command,
  options,
  flags
) {
  const { alter } = await import('./commands/alter');
  // note: for command below, pkgInfo is empty because forge currently supplies no package.json or anything similar
  await alter(packageName, flags.chainId, flags.preset, {}, command, options, {
    getArtifact: getFoundryArtifact,
  });
});

applyCommandsConfig(program.command('publish'), commandsConfig.publish).action(async function (packageRef, options) {
  const { publish } = await import('./commands/publish');

  const cliSettings = resolveCliSettings(options);
  const p = await resolveRegistryProvider(cliSettings);

  const overrides: ethers.Overrides = {};

  if (!options.chainId) {
    throw new Error(
      'Please provide a chainId using the format: --chain-id <number>. For example, 13370 is the chainId for a local build.'
    );
  }

  if (options.maxFeePerGas) {
    overrides.maxFeePerGas = ethers.utils.parseUnits(options.maxFeePerGas, 'gwei');
  }

  if (options.maxPriorityFeePerGas) {
    overrides.maxPriorityFeePerGas = ethers.utils.parseUnits(options.maxPriorityFeePerGas, 'gwei');
  }

  if (options.gasLimit) {
    overrides.gasLimit = options.gasLimit;
  }
  console.log(
    `Settings:\nMax Fee Per Gas: ${
      overrides.maxFeePerGas ? overrides.maxFeePerGas.toString() : 'default'
    }\nMax Priority Fee Per Gas: ${
      overrides.maxPriorityFeePerGas ? overrides.maxPriorityFeePerGas.toString() : 'default'
    }\nGas Limit: ${
      overrides.gasLimit ? overrides.gasLimit : 'default'
    }\nTo alter these settings use the parameters '--max-fee-per-gas', '--max-priority-fee-per-gas', '--gas-limit'.`
  );

  await publish({
    packageRef,
    signer: p.signers[0],
    tags: options.tags.split(','),
    chainId: options.chainId ? Number.parseInt(options.chainId) : undefined,
    presetArg: options.preset ? (options.preset as string) : undefined,
    quiet: options.quiet,
    overrides,
  });
});

applyCommandsConfig(program.command('inspect'), commandsConfig.inspect).action(async function (packageName, options) {
  const { inspect } = await import('./commands/inspect');
  resolveCliSettings(options);
  await inspect(packageName, options.chainId, options.preset, options.json, options.writeDeployments);
});

applyCommandsConfig(program.command('prune'), commandsConfig.prune).action(async function (options) {
  const { prune } = await import('./commands/prune');
  resolveCliSettings(options);

  const registry = await createDefaultReadRegistry(resolveCliSettings());

  const loader = getMainLoader(resolveCliSettings());

  const storage = new CannonStorage(registry, loader);

  console.log('Scanning for storage artifacts to prune (this may take some time)...');

  const [pruneUrls, pruneStats] = await prune(
    storage,
    options.filterPackage?.split(',') || '',
    options.filterVariant?.split(',') || '',
    options.keepAge
  );

  if (pruneUrls.length) {
    console.log(bold(`Found ${pruneUrls.length} storage artifacts to prune.`));
    console.log(`Matched with Registry: ${pruneStats.matchedFromRegistry}`);
    console.log(`Not Expired: ${pruneStats.notExpired}`);
    console.log(`Not Cannon Package: ${pruneStats.notCannonPackage}`);

    if (options.dryRun) {
      process.exit(0);
    }

    if (!options.yes) {
      const verification = await prompts({
        type: 'confirm',
        name: 'confirmation',
        message: 'Delete these artifacts?',
        initial: true,
      });

      if (!verification.confirmation) {
        console.log('Cancelled');
        process.exit(1);
      }
    }

    for (const url of pruneUrls) {
      console.log(`delete ${url}`);
      try {
        await storage.deleteBlob(url);
      } catch (err: any) {
        console.error(`Failed to delete ${url}: ${err.message}`);
      }
    }

    console.log('Done!');
  } else {
    console.log(bold('Nothing to prune.'));
  }
});

applyCommandsConfig(program.command('trace'), commandsConfig.trace).action(async function (packageName, data, options) {
  const { trace } = await import('./commands/trace');

  await trace({
    packageName,
    data,
    chainId: options.chainId,
    preset: options.preset,
    providerUrl: options.providerUrl,
    from: options.from,
    to: options.to,
    value: options.value,
    block: options.blockNumber,
    json: options.json,
  });
});

applyCommandsConfig(program.command('decode'), commandsConfig.decode).action(async function (packageRef, data, options) {
  const { decode } = await import('./commands/decode');

  await decode({
    packageRef,
    data,
    chainId: options.chainId,
    presetArg: options.preset,
    json: options.json,
  });
});

applyCommandsConfig(program.command('test'), commandsConfig.test).action(async function (cannonfile, forgeOpts, opts) {
  const [node, outputs] = await doBuild(cannonfile, [], opts);

  // basically we need to write deployments here
  await writeModuleDeployments(path.join(process.cwd(), 'deployments/test'), '', outputs);

  // after the build is done we can run the forge tests for the user
  const forgeCmd = spawn('forge', ['test', '--fork-url', 'http://localhost:8545', ...forgeOpts]);

  forgeCmd.stdout.on('data', (data: Buffer) => {
    process.stdout.write(data);
  });

  forgeCmd.stderr.on('data', (data: Buffer) => {
    process.stderr.write(data);
  });

  await new Promise((resolve) => {
    forgeCmd.on('close', (code: number) => {
      console.log(`forge exited with code ${code}`);
      node?.kill();
      resolve({});
    });
  });
});

applyCommandsConfig(program.command('interact'), commandsConfig.interact).action(async function (packageDefinition, opts) {
  const cliSettings = resolveCliSettings(opts);

  const p = await resolveWriteProvider(cliSettings, opts.chainId);

  const networkInfo = await p.provider.getNetwork();

  const resolver = await createDefaultReadRegistry(cliSettings);

  const runtime = new ChainBuilderRuntime(
    {
      provider: p.provider,
      chainId: networkInfo.chainId,
      async getSigner(addr: string) {
        // on test network any user can be conjured
        await p.provider.send('hardhat_impersonateAccount', [addr]);
        await p.provider.send('hardhat_setBalance', [addr, `0x${(1e22).toString(16)}`]);
        return p.provider.getSigner(addr);
      },
      snapshots: false,
      allowPartialDeploy: false,
      gasPrice: opts.gasPrice,
      gasFee: opts.maxGasFee,
      priorityGasFee: opts.maxPriorityFee,
    },
    resolver,
    getMainLoader(cliSettings)
  );

  const selectedPreset = packageDefinition.preset || opts.preset || 'main';

  const deployData = await runtime.readDeploy(
    `${packageDefinition.name}:${packageDefinition.version}`,
    selectedPreset,
    runtime.chainId
  );

  if (!deployData) {
    throw new Error(
      `deployment not found: ${packageDefinition.name}:${packageDefinition.version}@${selectedPreset}. please make sure it exists for the given preset and current network.`
    );
  }

  const outputs = await getOutputs(runtime, new ChainDefinition(deployData.def), deployData.state);

  if (!outputs) {
    throw new Error(
      `no cannon build found for chain ${networkInfo.chainId}/${selectedPreset}. Did you mean to run instead?`
    );
  }

  const contracts = [getContractsRecursive(outputs, p.provider)];

  p.provider.artifacts = outputs;

  await interact({
    packages: [packageDefinition],
    contracts,
    signer: p.signers[0],
    provider: p.provider,
  });
});

applyCommandsConfig(program.command('setup'), commandsConfig.setup).action(async function () {
  const { setup } = await import('./commands/setup');
  await setup();
});

applyCommandsConfig(program.command('clean'), commandsConfig.clean).action(async function ({ noConfirm }) {
  const { clean } = await import('./commands/clean');
  const executed = await clean(!noConfirm);
  if (executed) console.log('Complete!');
});

const pluginCmd = applyCommandsConfig(program.command('plugin'), commandsConfig.plugin);

applyCommandsConfig(pluginCmd.command('list'), commandsConfig.plugin.commands.list).action(async function () {
  console.log(green(bold('\n=============== Installed Plug-ins ===============')));
  const installedPlugins = await listInstalledPlugins();
  installedPlugins.forEach((plugin) => console.log(yellow(plugin)));
});

applyCommandsConfig(pluginCmd.command('add'), commandsConfig.plugin.commands.add).action(async function (name) {
  console.log(`Installing plug-in ${name}...`);
  await installPlugin(name);
  console.log('Complete!');
});

applyCommandsConfig(pluginCmd.command('remove'), commandsConfig.plugin.commands.remove).action(async function (name) {
  console.log(`Removing plugin ${name}...`);
  await removePlugin(name);
  console.log('Complete!');
});

export default program;
