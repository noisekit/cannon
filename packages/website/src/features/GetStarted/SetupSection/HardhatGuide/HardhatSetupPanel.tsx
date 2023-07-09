import { externalLinks } from '@/constants/externalLinks';
import { SetupCustomAlert } from '../SetupCustomAlert';
import { CreateCannonFile } from './CreateCannonFile';
import { DeployYourProtocol } from './DeployYourProtocol';
import { ImportProvisionPackages } from './ImportProvisionPackages';

export const HardhatSetupPanel = () => {
  return (
    <>
      <SetupCustomAlert
        label="hardhat sample project"
        href={externalLinks.HARDHAT_EXAMPLE}
      />
      <CreateCannonFile />
      <DeployYourProtocol />
      <ImportProvisionPackages />
    </>
  );
};
