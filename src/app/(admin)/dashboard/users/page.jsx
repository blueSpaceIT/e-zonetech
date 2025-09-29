import React from 'react';
// Components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import UsersList from 'src/components/_admin/users/userList';

// Meta information
export const metadata = {
  title: 'User - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
export default function page() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Users List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Users'
            }
          ]}
        />
      </Toolbar>
      <UsersList />
    </>
  );
}
