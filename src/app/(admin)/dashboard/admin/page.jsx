import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AdminsList from 'src/components/_admin/admins/adminList';

export const metadata = {
  title: 'Admins - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};

export default function page() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Admin Users"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Admin'
            }
          ]}
        />
      </Toolbar>
      <AdminsList />
    </>
  );
}
