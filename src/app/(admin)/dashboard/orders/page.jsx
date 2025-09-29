import React from 'react';
// Components
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import OrdersList from 'src/components/_admin/orders/ordersList';
// Meta information
export const metadata = {
  title: 'Order - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Orders List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Orders'
            }
          ]}
        />
      </Toolbar>
      <OrdersList />
    </div>
  );
}
