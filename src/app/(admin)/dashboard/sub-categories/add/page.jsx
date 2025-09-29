import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddSubCategory from 'src/components/_admin/subcategories/addCategory';
import * as api from 'src/services';

export default async function page() {
  const data1 = await api.getAllCategories();
  if (!data1) {
    notFound();
  }
  const { data: categories } = data1;
  return (
    <div>
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
              name: 'Sub Categories',
              href: '/dashboard/sub-categories'
            },
            {
              name: 'Add Sub Category'
            }
          ]}
        />
      </Toolbar>
      <AddSubCategory categories={categories} />
    </div>
  );
}
