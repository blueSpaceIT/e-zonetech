import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import Toolbar from 'src/components/_admin/toolbar';
import MultiActionButtonBreadcrumbs from 'src/components/multiActionButtonBreadcrumbs';
// Meta information
export const metadata = {
  title: 'Products - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
export default async function AdminProducts() {
  return (
    <>
      <Toolbar>
        <MultiActionButtonBreadcrumbs
          admin
          heading="Categories List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Products'
            }
          ]}
          actions={[{
            href: `/dashboard/products/add-csv`,
            title: 'Bulk Add Products'
          },
          {
            href: `/dashboard/products/add`,
            title: 'Add Product'
          }]}
        />
      </Toolbar>
      <ProductList />
    </>
  );
}
