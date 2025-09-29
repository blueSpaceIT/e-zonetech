import React from 'react';
// Components
import DeliveryCityList from 'src/components/_admin/deliveryCities/deliveryCityList';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

export const metadata = {
  title: 'Delivery Cities - Admin',
  applicationName: 'Admin',
  authors: 'Admin'
};

const DeliveryCitiesPage = () => {
  return (
    <>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Delivery Cities"
          links={[{ name: 'Dashboard', href: '/' }, { name: 'Delivery Cities' }]}
          action={{ href: `/dashboard/delivery-cities/add`, title: 'Add delivery city' }}
        />
      </Toolbar>
      <DeliveryCityList />
    </>
  );
};

export default DeliveryCitiesPage;