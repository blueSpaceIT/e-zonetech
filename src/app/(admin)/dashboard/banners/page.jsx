import React from 'react';

// components
import BannerList from 'src/components/_admin/banners/bannerList';
import MidBannerList from 'src/components/_admin/banners/midBannerList';
import SideBannerList from 'src/components/_admin/banners/sideBannerList';
import BannerFourList from 'src/components/_admin/banners/bannerFourList';
import BannerFiveList from 'src/components/_admin/banners/bannerFiveList';
import BannerSixList from 'src/components/_admin/banners/bannerSixList';
import BannerSevenList from 'src/components/_admin/banners/bannerSevenList';
import Toolbar from 'src/components/_admin/toolbar';
import MultiActionButtonBreadcrumbs from 'src/components/multiActionButtonBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Banners - Ezone',
  applicationName: 'Ezone',
  authors: 'Ezone'
};

const BannersPage = () => {
  return (
    <>
      <Toolbar>
        <MultiActionButtonBreadcrumbs
          admin
          heading="Banners List"
          links={[
            {
              name: 'Dashboard',
              href: '/dashboard'
            },
            {
              name: 'Banners'
            }
          ]}
          actions={[
            {
              href: `/dashboard/banners/add`,
              title: 'Add Banner'
            }
          ]}
        />
      </Toolbar>
      <BannerList />
  <MidBannerList />
  <SideBannerList />
  <BannerFourList />
  <BannerFiveList />
  <BannerSixList />
  <BannerSevenList />
    </>
  );
};

export default BannersPage;
