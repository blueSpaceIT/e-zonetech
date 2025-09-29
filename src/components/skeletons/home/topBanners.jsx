'use client';
import { Box, Grid, Skeleton } from '@mui/material';
import React from 'react';

export default function TopBanners() {
  return (
    <Box my={6}>
      <Grid container spacing={3}>
        {Array.from(new Array(3)).map((index) => (
          <Grid item lg={4} md={6} xs={12} key={index}>
            <Skeleton variant="rectangular" width="100%" height={222} sx={{ borderRadius: 1 }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
