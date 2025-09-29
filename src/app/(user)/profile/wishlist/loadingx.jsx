import { Grid } from '@mui/material';
import React from 'react';
import ProductCard from 'src/components/_main/skeletons/products/productCard';

export default function Loading() {
  return (
    <>
      <Grid container spacing={2}>
        {Array.from(new Array(4)).map((idx) => (
          <Grid item md={3} xs={6} key={idx}>
            <ProductCard />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
