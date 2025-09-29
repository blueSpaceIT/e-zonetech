import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import UsersDetails from 'src/components/_admin/users/details';

export default function page({ params }) {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="User Details"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Users',
              href: '/dashboard/users'
            },
            {
              name: 'Users details'
            }
          ]}
        />
      </Toolbar>
      <UsersDetails id={params.id} />
    </>
  );
}
