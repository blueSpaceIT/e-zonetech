import React from 'react';
// Components
import SubCategoryList from 'src/components/_admin/subcategories/categoryList';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// Meta information
export const metadata = {
  title: 'Sub Categories - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};

export default function Categories() {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Sub Categories List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Sub Categories'
            }
          ]}
          action={{
            href: `/dashboard/sub-categories/add`,
            title: 'Add Sub Category'
          }}
        />
      </Toolbar>
      <SubCategoryList />
    </>
  );
}
