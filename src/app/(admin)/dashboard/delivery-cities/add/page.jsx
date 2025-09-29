import React from 'react';
// Toolbar
import Toolbar from 'src/components/_admin/toolbar';
// Breadcrumbs
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// components
import DeliveryCityForm from 'src/components/forms/deliveryCity';

export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Add Delivery City"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Delivery Cities',
              href: '/dashboard/delivery-cities'
            },
            {
              name: 'Add delivery city'
            }
          ]}
        />
      </Toolbar>
      <DeliveryCityForm />
    </div>
  );
}
