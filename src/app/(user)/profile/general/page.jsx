import React from 'react';
// mui
import { Container } from '@mui/material';
// next
import dynamic from 'next/dynamic';
import Breadcrumbs from 'src/components/skeletons/breadcrumbs';
// Meta information
export const metadata = {
  title: 'Ezone - Your Gateway to Seamless Shopping and Secure Transactions',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
import GeneralSkeleton from 'src/components/_main/skeletons/profile/general';

const AccountGeneral = dynamic(() => import('src/components/_main/profile/edit/accountGeneral'), {
  loading: () => <GeneralSkeleton />
});
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <Breadcrumbs />
});
export default function General() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="General"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/general'
          },
          {
            name: 'General'
          }
        ]}
      />
      <AccountGeneral />
    </Container>
  );
}
