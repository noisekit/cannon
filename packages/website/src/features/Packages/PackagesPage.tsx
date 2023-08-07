'use client';

import { FC, useEffect, useState } from 'react';
import { GET_PACKAGE } from '@/graphql/queries';
import {
  GetPackageQuery,
  GetPackageQueryVariables,
  GetPackagesQuery,
} from '@/types/graphql/graphql';
import { useQuery } from '@apollo/client';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
  Container,
} from '@chakra-ui/react';
import PackageNetworks from '@/components/PackageNetworks';
import { CommandPreview } from '@/components/CommandPreview';
import PublishInfo from '@/features/Search/PackageCard/PublishInfo';
import { Cannonfile } from '@/features/Packages/Cannonfile';
import { Versions } from '@/features/Packages/Versions';
import { Interact } from '@/features/Packages/Interact';

type Package = GetPackagesQuery['packages'][0];

export const PackagesPage: FC<{ name: string }> = ({ name }) => {
  const { data } = useQuery<GetPackageQuery, GetPackageQueryVariables>(
    GET_PACKAGE,
    {
      variables: { name },
    }
  );

  const [pkg, setPackage] = useState<Package | null>(null);

  useEffect(() => {
    if (data?.packages[0]) setPackage(data?.packages[0]);
  }, [data]);

  return (
    <Container maxW="container.lg">
      {pkg ? (
        <>
          <Grid
            templateColumns="repeat(12, 1fr)"
            gap={6}
            py={8}
            alignItems="center"
          >
            <GridItem colSpan={[12, 12, 7]}>
              <Heading as="h4" size="md" mb="1">
                {pkg?.name}
              </Heading>
              <Box mb="2">
                <PublishInfo p={pkg} />
              </Box>
              <PackageNetworks download p={pkg!} />
            </GridItem>
            <GridItem colSpan={[12, 12, 5]}>
              <Heading
                as="h4"
                size="sm"
                textTransform="uppercase"
                fontWeight="normal"
                letterSpacing="1px"
                mb="2"
              >
                Quick Start
              </Heading>
              <CommandPreview command={`npx @usecannon/cli ${pkg.name}`} />
            </GridItem>
          </Grid>

          <Box borderBottom="1px solid rgba(255,255,255,0.25)" pb="2">
            <Tabs colorScheme="cyan">
              <TabList>
                <Tab>Cannonfile</Tab>
                <Tab>Interact</Tab>
                <Tab>Versions</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <Cannonfile pkg={pkg} />
                </TabPanel>
                <TabPanel p={0}>
                  <Interact pkg={pkg} />
                </TabPanel>
                <TabPanel p={0}>
                  <Versions pkg={pkg} />
                </TabPanel>
              </TabPanels>
            </Tabs>
            {/*<Link*/}
            {/*  p="3"*/}
            {/*  // as="nuxt-link"*/}
            {/*  href={`/packages/${p?.name}/`}*/}
            {/*  // exact TODO*/}
            {/*  exact-active-class="active-link"*/}
            {/*  // class="tab-link" TODO*/}
            {/*>*/}
            {/*  Cannonfile*/}
            {/*</Link>*/}
            {/*<Link*/}
            {/*  p="3"*/}
            {/*  // as="nuxt-link"*/}
            {/*  href={`/packages/${p?.name}/interact`}*/}
            {/*  active-class="active-link"*/}
            {/*  // class="tab-link" TODO*/}
            {/*>*/}
            {/*  Interact*/}
            {/*</Link>*/}
            {/*<Link*/}
            {/*  p="3"*/}
            {/*  // as="nuxt-link"*/}
            {/*  href={`/packages/${p?.name}/versions`}*/}
            {/*  active-class="active-link"*/}
            {/*  // class="tab-link" TODO*/}
            {/*>*/}
            {/*  Versions*/}
            {/*</Link>*/}
          </Box>
          {/*<NuxtChild :p="p" />*/}
        </>
      ) : (
        <Text textAlign="center">
          <Spinner my="12" />
        </Text>
      )}
    </Container>
  );
};

export default PackagesPage;
