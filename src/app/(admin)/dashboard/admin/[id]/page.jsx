import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import EditUser from 'src/components/_admin/users/editUser';

export const metadata = {
  title: 'Edit Admin - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};

export default function page({ params }) {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Edit Admin"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Admin',
              href: '/dashboard/admin'
            },
            {
              name: 'Edit Admin'
            }
          ]}
        />
      </Toolbar>
      <EditUser id={params.id} />
    </>
  );
}
