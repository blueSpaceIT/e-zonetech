import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddCouponCode from 'src/components/_admin/couponCodes/addCouponCode';
export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Coupon Code List"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Coupon code',
              href: '/dashboard/coupon-code'
            },
            {
              name: 'Add coupon code'
            }
          ]}
        />
      </Toolbar>
      <AddCouponCode />
    </div>
  );
}
