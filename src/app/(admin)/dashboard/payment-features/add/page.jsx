import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PaymentFeatureForm from 'src/components/forms/paymentFeature';

export default function Page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Add Payment Feature"
          links={[
            { name: 'Dashboard', href: '/' },
            { name: 'Payment features', href: '/dashboard/payment-features' },
            { name: 'Add Payment Feature' }
          ]}
        />
      </Toolbar>
      <PaymentFeatureForm />
    </div>
  );
}
