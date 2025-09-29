import React from 'react';
// mui
import { Container, Grid } from '@mui/material';
// next
import dynamic from 'next/dynamic';
// skeletons
import BreadcrumbsSkeleton from 'src/components/_main/skeletons/products/breadcrumbs';
import ProductCard from 'src/components/_main/skeletons/products/productCard';
// Meta information
export const metadata = {
  title: 'Wishlist | Ezone - Save Your Favorite Items for Later',
  applicationName: 'Ezone',
  authors: 'Ezone'
};
// components
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <BreadcrumbsSkeleton />
});
const WishlistMain = dynamic(() => import('src/components/_main/profile/wishlist'), {
  loading: () => (
    <>
      <Grid container spacing={2}>
        {Array.from(new Array(6)).map((idx) => (
          <Grid item md={2} xs={6} key={idx}>
            <ProductCard />
          </Grid>
        ))}
      </Grid>
    </>
  )
});

export default function Wishlist() {
  return (
    <Container>
      <HeaderBreadcrumbs
        heading="Wishlist"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/wishlist'
          },
          {
            name: 'Wishlist'
          }
        ]}
      />
      <WishlistMain />
    </Container>
  );
}
