'use client';
import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
// mui
import { Box, Grid } from '@mui/material';
// components
import ProductDetailsCarousel from 'src/components/carousels/details';
import ProductDetailsSumary from 'src/components/_main/product/summary';

ProductDetailClient.propTypes = {
  data: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  brand: PropTypes.object,
  category: PropTypes.object,
  totalRating: PropTypes.number,
  totalReviews: PropTypes.number
};

export default function ProductDetailClient({ 
  data, 
  slug, 
  brand, 
  category, 
  totalRating, 
  totalReviews 
}) {
  const [selectedColor, setSelectedColor] = useState(null);

  // record this product as recently viewed
  useRecordRecentlyViewed(data);

  // Calculate images to display based on selected color
  const displayImages = useMemo(() => {
    if (!selectedColor || !data?.variantImages || !data.variantImages[selectedColor]) {
      // Show general images when no color is selected or variant images don't exist
      return data?.images || [];
    }
    
    // Show variant images for selected color
    return data.variantImages[selectedColor] || [];
  }, [selectedColor, data?.images, data?.variantImages]);

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        p: 3,
        mt: 3,
        mb: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProductDetailsCarousel 
            slug={slug} 
            product={{ ...data, images: displayImages }} 
            data={data} 
            selectedColor={selectedColor}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <ProductDetailsSumary
            id={data?._id}
            product={data}
            brand={brand}
            category={category}
            totalRating={totalRating}
            totalReviews={totalReviews}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// add to recentlyViewed in localStorage (keep newest-last, dedupe)
function addRecentlyViewed(product) {
  try {
    const raw = localStorage.getItem('recentlyViewed');
    const arr = raw ? JSON.parse(raw) : [];

    arr.push(product);

    // dedupe by id keeping the last occurrence
    const dedupedMap = new Map();
    for (const p of arr) {
      const id = p._id || p.id || p.productId;
      if (!id) continue;
      dedupedMap.set(id, p);
    }

    const deduped = Array.from(dedupedMap.values()).slice(-100); // keep max 100
    localStorage.setItem('recentlyViewed', JSON.stringify(deduped));
  } catch (err) {
    // ignore
    console.error('addRecentlyViewed failed', err);
  }
}

// write on mount when product data is available
export function useRecordRecentlyViewed(product) {
  useEffect(() => {
    if (!product) return;
  const image = product.image || (product.images && product.images[0] && product.images[0].url) || product.url || null;
  const slug = product.slug || product?.product?.slug || null;
  const title = product.name || product.title || product.productName || null;
  addRecentlyViewed({ _id: product._id || product.id, image, slug, title });
  }, [product]);
}
