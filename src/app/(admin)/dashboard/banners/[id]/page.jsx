'use client';
import React from 'react';

// components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditBanner from 'src/components/_admin/banners/editBanner';

export default function EditBannerPage({ params }) {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Edit Banner"
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
              name: 'Edit Banner'
            }
          ]}
        />
      </Toolbar>
      <EditBanner id={params.id} />
    </>
  );
}
