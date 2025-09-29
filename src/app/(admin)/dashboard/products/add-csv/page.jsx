import React from 'react';
import BulkUploadProductForm from 'src/components/_admin/products/bulkUploadProductForm';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export default function AddCsv() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Product List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Products',
              href: '/dashboard/products'
            },
            {
              name: 'Bulk Add Product'
            }
          ]}
        />
      </Toolbar>
      <BulkUploadProductForm />
    </div>
  );
}
