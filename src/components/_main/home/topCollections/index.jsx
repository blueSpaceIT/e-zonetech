'use client';
import React from 'react';
import NextLink from 'next/link';
// mui
import { Grid, Button, Typography, Box } from '@mui/material';
// icons
import { IoIosArrowForward } from 'react-icons/io';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductCard from 'src/components/cards/product';
export default function TopCollections() {
  const { data, isLoading } = useQuery(['get-best-products'], () => api.getTopRatedProducts());

  return (
    <Box>
      <Typography variant="h2" color="text.primary" textAlign="center" mt={{ xs: 5, md: 8 }}>
        Top Collections
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
        Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {(isLoading ? Array.from(new Array(8)) : data?.data).map((item, index) => (
          <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
            <ProductCard product={item} loading={isLoading} />
          </Grid>
        ))}
      </Grid>

      {Boolean(data?.data?.length > 7) && (
        <Button
          variant="contained"
          size="large"
          color="primary"
          endIcon={<IoIosArrowForward />}
          component={NextLink}
          href={`/products?top=-1`}
          sx={{
            mt: 3,
            mx: 'auto',
            display: 'flex',
            maxWidth: 130,
            minWidth: 130
          }}
        >
          View All
        </Button>
      )}
      {!isLoading && !Boolean(data?.data.length) && (
        <Typography variant="h3" color="error.main" textAlign="center">
          Products not found
        </Typography>
      )}
    </Box>
  );
}
