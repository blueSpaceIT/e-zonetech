import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddUser from 'src/components/_admin/users/addUser';

export const metadata = {
  title: 'Add Admin - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};

export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Add Admin"
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
              name: 'Add Admin'
            }
          ]}
        />
      </Toolbar>
      <AddUser />
    </div>
  );
}
