import { Suspense } from 'react';

// mui
import { Box, Container } from '@mui/material';

// components
import BestSeller from 'src/components/_main/home/bestSeller';
import Brands from 'src/components/_main/home/brands';
import Categories from 'src/components/_main/home/categories';
import DailyOffers from 'src/components/_main/home/dailyOffers';
import Hero from 'src/components/_main/home/hero';
import ProductShowCase from 'src/components/_main/home/productShowCase';
import RecentlyViewed from 'src/components/_main/home/recentlyViewed';

export default async function IndexPage() {
  return (
    <Box sx={{ px: { xs: '12px', md: '24px', xl: 0 } }}>
      <Hero />
      {/* <TopBanners /> */}
      {/* <Container fixed> */}
        <Categories />
        {/* <Suspense>
          <TopCollections />
        </Suspense> */}
      {/* </Container> */}
      <Suspense>
          <BestSeller />
        </Suspense>
      <Suspense>
          <DailyOffers />
        </Suspense>
      {/* <Banner /> */}
      
      <Suspense>
          <ProductShowCase />
        </Suspense>
        <Suspense>
          <Brands />
        </Suspense>
        {/* Recently viewed products */}
        <Suspense>
          <RecentlyViewed />
        </Suspense>
      <Container fixed>
        {/* <WhyUs /> */}
      </Container>
    </Box>
  );
}
