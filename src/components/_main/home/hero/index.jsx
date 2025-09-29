'use client';
import React from 'react';
import { useQuery } from 'react-query';
// components
import SingleSlideCarousel from 'src/components/carousels/singleSlide';
// api
import * as api from 'src/services';
import { Box } from '@mui/material';

export default function Hero() {
  const { data: bannersData, isLoading, error } = useQuery(
    'banners',
    api.getBanners,
    {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    }
  );

  // Transform API data to match carousel expected format
  const transformedData = React.useMemo(() => {
    if (!bannersData?.success || !bannersData?.data || !Array.isArray(bannersData.data)) {
      return [];
    }
    
    const activeBanners = bannersData.data
      .filter(banner => banner.status === 'active') // Only show active banners
      .sort((a, b) => a.order - b.order); // Sort by order
    
    // If no active banners, return empty array (no placeholder)
    if (activeBanners.length === 0) {
      return [];
    }
    
    return activeBanners.map(banner => ({
      cover: banner.cover?.url || '', // Extract URL from cover object with fallback
      heading: banner.heading || null,
      description: banner.description || null,
      color: banner.color || null,
      btnPrimary: banner.btnPrimary || null,
      btnSecondary: banner.btnSecondary || null
    }));
  }, [bannersData]);

  // Use transformed data if available, otherwise empty array (no placeholder)
  const carouselData = error || isLoading || transformedData.length === 0 ? [] : transformedData;

  return (
    <Box sx={{ width: '100%', mx: 0, px: { xs: 0, md: 0 }, mt: { xs: 3, md: 0 } }}>
      <SingleSlideCarousel data={carouselData} />
    </Box>
  );
}
