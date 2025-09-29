import React from 'react';
// Toolbar
import Toolbar from 'src/components/_admin/toolbar';
// Breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
import AddBrand from 'src/components/_admin/brands/addBrand';
export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Brands List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Brands',
              href: '/dashboard/brands'
            },
            {
              name: 'Add brand'
            }
          ]}
        />
      </Toolbar>
      <AddBrand />
    </div>
  );
}
