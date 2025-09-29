import React from 'react';
// Components
import CategoryList from 'src/components/_admin/categories/categoryList';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// Meta information
export const metadata = {
  title: 'Categories - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
export default function Categories() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Categories List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Categories'
            }
          ]}
          action={{
            href: `/dashboard/categories/add`,
            title: 'Add Category'
          }}
        />
      </Toolbar>
      <CategoryList />
    </>
  );
}
