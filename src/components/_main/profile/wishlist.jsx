'use client';
import React from 'react';
// mui
import { Card, Grid } from '@mui/material';
// next js

// redux
import { useSelector } from 'react-redux';
// components
import NoDataFound from 'src/components/illustrations/noDataFound';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import ProductCard from 'src/components/cards/product';

export default function Wishlist() {
  const { wishlist } = useSelector(({ wishlist }) => wishlist);

  const { data, isLoading } = useQuery(['get-wishlist-products', wishlist], () => api.getWishlist(wishlist), {
    onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
  });

  return (
    <>
      <Grid container justifyContent="center" spacing={2} mt={2}>
        {!isLoading && !Boolean(data?.data.length) && (
          <Grid item md={12}>
            <Card>
              <NoDataFound />
            </Card>
          </Grid>
        )}

        {(isLoading ? Array.from(new Array(6)) : data?.data)?.map((item, index) => (
          <Grid item xs={6} sm={6} md={2} lg={2} key={index}>
            <ProductCard product={item} loading={isLoading} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
