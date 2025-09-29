import React from 'react';
// mui
import { Container } from '@mui/material';
// next
import dynamic from 'next/dynamic';
// Meta information
export const metadata = {
  title: 'Invoice | Ezone - Your Order Details and Payment Confirmation',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
// skeleton
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
import InvoiceSkeleton from 'src/components/_main/skeletons/profile/invoice';

const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});
const InvoiceHistory = dynamic(() => import('src/components/_main/profile/invoiceHistory'), {
  loading: () => <InvoiceSkeleton />
});

export default async function OrderPage() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Orders"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/orders'
          },
          {
            name: 'Orders'
          }
        ]}
      />
      <InvoiceHistory />
    </Container>
  );
}
