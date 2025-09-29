'use client';
// react
import React from 'react';
// mui
import { Typography, Box } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/products';
import Link from 'next/link';

export default function DailyOffers() {
  const { data, isLoading } = useQuery(['get-daily-offer-products'], () => api.getDailyOfferProducts());
  return (
    <Box sx={{
      maxWidth: '1480px',
      mx: 'auto',
      px: { xs: 0, md: 0 }
    }}>
      <Typography 
        variant="h3" 
        color="text.primary" 
        textAlign="left" 
        mt={{ xs: 0, md: 0 }}
        mb={{ xs: 2, md: 4 }}
        sx={{ 
          textTransform: 'uppercase',
          fontSize: { xs: '20px', md: '24px' },
          px: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        DAILY OFFERS <span style={{ fontSize: '14px', fontWeight: '200' }}><Link style={{color: '#000'}} href={`/products`}>See more</Link></span>
      </Typography>

      {!isLoading && !Boolean(data?.data.length) ? (
        <Typography variant="h3" color="error.main" textAlign="center">
          Products not found
        </Typography>
      ) : (
        <ProductsCarousel data={data?.data} isLoading={isLoading} />
      )}
    </Box>
  );
}
