import { Alert } from '@/components/Alert';
import { CustomSpinner } from '@/components/CustomSpinner';
import { parseHintedMulticall } from '@/helpers/cannon';
import { SafeDefinition } from '@/helpers/store';
import {
  useCannonPackageContracts,
  useLoadCannonDefinition,
} from '@/hooks/cannon';
import { useGitDiff } from '@/hooks/git';
import { useGetPreviousGitInfoQuery } from '@/hooks/safe';
import { SafeTransaction } from '@/types/SafeTransaction';
import {
  Alert as ChakraAlert,
  AlertDescription,
  AlertTitle,
  Box,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { uniq } from 'lodash';
import { Diff, parseDiff } from 'react-diff-view';
import { GitHub } from 'react-feather';
import { DisplayedTransaction } from './DisplayedTransaction';

const parseDiffFileNames = (diffString: string): string[] => {
  const regExp = /[-|+]{3}\s[ab]\/\.(.*?)\n/g;
  let match;
  const fileNames: string[] = [];
  while ((match = regExp.exec(diffString)) !== null) {
    fileNames.push(match[1]);
  }
  return fileNames;
};

export function TransactionDisplay(props: {
  safeTxn: SafeTransaction;
  safe: SafeDefinition;
  queuedWithGitOps?: boolean;
  showQueueSource?: boolean;
  isTransactionExecuted?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hintData = parseHintedMulticall(props.safeTxn?.data);

  const cannonInfo = useCannonPackageContracts(
    hintData?.cannonPackage
      ? '@' + hintData.cannonPackage.replace('://', ':')
      : ''
  );

  // git stuff
  const denom = hintData?.gitRepoUrl?.lastIndexOf(':');
  const gitUrl = hintData?.gitRepoUrl?.slice(0, denom);
  const gitFile = hintData?.gitRepoUrl?.slice((denom ?? 0) + 1);

  const prevDeployHashQuery = useGetPreviousGitInfoQuery(
    props.safe,
    hintData?.gitRepoUrl ?? ''
  );

  // Determine whether we should use the hint data or the previous git info query
  let prevDeployGitHash: string = hintData?.prevGitRepoHash ?? '';
  if (
    props.queuedWithGitOps &&
    !props.isTransactionExecuted &&
    prevDeployHashQuery.data?.length &&
    prevDeployHashQuery.data[0].result &&
    ((prevDeployHashQuery.data[0].result as any).length as number) > 2
  ) {
    prevDeployGitHash = (prevDeployHashQuery.data[0].result as any).slice(
      2
    ) as any;
  }

  const cannonDefInfo = useLoadCannonDefinition(
    gitUrl ?? '',
    hintData?.gitRepoHash ?? '',
    gitFile ?? ''
  );

  const { patches } = useGitDiff(
    gitUrl ?? '',
    prevDeployGitHash,
    hintData?.gitRepoHash ?? '',
    cannonDefInfo.filesList ? Array.from(cannonDefInfo.filesList) : []
  );

  const diffFiles = uniq(patches.map(parseDiffFileNames).flat());

  if (hintData?.cannonPackage && !cannonInfo.contracts) {
    return (
      <Box
        py="20"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <CustomSpinner mx="auto" mb="2" />
        <Text fontSize="sm" color="gray.400">
          Parsing transaction data...
        </Text>
      </Box>
    );
  }

  if (!hintData) {
    return <Alert status="info">Could not parse the transaction.</Alert>;
  }

  return (
    <Box maxW="100%" overflowX="auto">
      {props.showQueueSource &&
        (props.queuedWithGitOps ? (
          <>
            <ChakraAlert
              bg="gray.800"
              border="1px solid"
              borderColor="gray.700"
              mb={6}
            >
              <Box display={['none', 'block']}>
                <GitHub size="28" strokeWidth={1} />
              </Box>
              <Box ml={[0, 3]}>
                <AlertTitle lineHeight={1} fontSize="sm" mb={1.5}>
                  GitOps Deployment
                </AlertTitle>
                <AlertDescription
                  display="block"
                  lineHeight={1.4}
                  fontSize="sm"
                >
                  {cannonDefInfo.isFetching ? (
                    <>
                      <Spinner size="xs" mr={0.5} /> Loading...
                    </>
                  ) : (
                    <>
                      These transactions were generated by{' '}
                      {diffFiles?.length ? (
                        <Link onClick={onOpen}>
                          modifying {diffFiles?.length} cannonfiles
                        </Link>
                      ) : (
                        'modifying cannonfiles'
                      )}{' '}
                      in{' '}
                      <Link isExternal href={gitUrl}>
                        this repository
                      </Link>
                      .
                    </>
                  )}
                </AlertDescription>
              </Box>
            </ChakraAlert>

            <Modal size="full" isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent background="gray.900">
                <ModalCloseButton />
                <ModalBody>
                  <Flex>
                    <Box w="50%" px={2} py={1} fontWeight="semibold">
                      {prevDeployGitHash}
                    </Box>
                    <Box w="50%" px={2} py={1} fontWeight="semibold">
                      {hintData?.gitRepoHash}
                    </Box>
                  </Flex>
                  {patches.map((p, i) => {
                    const { oldRevision, newRevision, type, hunks } =
                      parseDiff(p)[0];
                    const [fromFileName, toFileName] = parseDiffFileNames(p);

                    return (
                      <Box
                        bg="gray.900"
                        borderRadius="sm"
                        overflow="hidden"
                        fontSize="xs"
                        mb={2}
                        key={i}
                      >
                        <Flex
                          bg="blackAlpha.300"
                          direction="row"
                          py="1"
                          fontWeight="semibold"
                        >
                          <Box w="50%" px={2} py={1}>
                            {fromFileName}
                          </Box>
                          <Box w="50%" px={2} py={1}>
                            {toFileName}
                          </Box>
                        </Flex>
                        <Diff
                          key={oldRevision + '-' + newRevision}
                          viewType="split"
                          diffType={type}
                          hunks={hunks}
                        />
                      </Box>
                    );
                  })}
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <ChakraAlert
            bg="gray.800"
            border="1px solid"
            borderColor="gray.700"
            mb={6}
          >
            <Box display={['none', 'block']}>
              <Image
                opacity={0.66}
                alt="Cannon Logomark"
                height="28px"
                src="/images/cannon-logomark.svg"
              />
            </Box>
            <Box ml={[0, 3]}>
              <AlertTitle lineHeight={1} fontSize="sm" mb={1.5}>
                Queued from Package
              </AlertTitle>
              <AlertDescription display="block" lineHeight={1.4} fontSize="sm">
                These transactions were queued using the{' '}
                <Link
                  isExternal
                  href={`/packages/${cannonInfo.resolvedName}/${cannonInfo.resolvedVersion}/${props.safe.chainId}-${cannonInfo.resolvedPreset}`}
                >
                  {cannonInfo.resolvedName}
                </Link>{' '}
                package.
              </AlertDescription>
            </Box>
          </ChakraAlert>
        ))}

      <Box maxW="100%" overflowX="scroll">
        {hintData.txns.map((txn, i) => (
          <Box key={`tx-${i}`} mb={8}>
            <DisplayedTransaction
              contracts={cannonInfo.contracts as any}
              txn={txn}
              chainId={props.safe.chainId}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
