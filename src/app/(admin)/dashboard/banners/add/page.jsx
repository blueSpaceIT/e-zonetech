import React from 'react';

// components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddBanner from 'src/components/_admin/banners/addBanner';

// Meta information
export const metadata = {
  title: 'Add Banner - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};

export default function AddBannerPage() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Add Banner"
          links={[
            {
              name: 'Dashboard',
              href: '/dashboard'
            },
            {
              name: 'Banners',
              href: '/dashboard/banners'
            },
            {
              name: 'Add Banner'
            }
          ]}
        />
      </Toolbar>
      <AddBanner />
    </>
  );
}
