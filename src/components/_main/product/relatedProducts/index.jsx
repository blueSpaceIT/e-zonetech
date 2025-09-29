'use client';
// react
import React from 'react';
// mui
import { Typography, Box, Grid, Card, Stack, Rating, Chip } from '@mui/material';
import { MdLocalShipping } from 'react-icons/md';
import { BsCheckCircle } from 'react-icons/bs';
// next
import Link from 'next/link';
// components
import BlurImage from 'src/components/blurImage';
import { fCurrency } from 'src/utils/formatNumber';
// styles
import RootStyled from './styled';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
// api
import * as api from 'src/services';

RelatedProducts.propTypes = {
  id: PropTypes.string.isRequired
};

const ProductCard = ({ product }) => {
  const discountPercentage = product?.price > product?.priceSale 
    ? Math.round(((product.price - product.priceSale) / product.price) * 100)
    : 0;

  return (
    <Card
      sx={{
  width: '100%',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderColor: '#2196f3'
        },
        transition: 'all 0.3s ease'
      }}
    >
      <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none' }}>
        <Box sx={{ position: 'relative', p: 2 }}>
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Chip
              label={`${discountPercentage}% OFF`}
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                bgcolor: '#4caf50',
                color: 'white',
                fontWeight: 600,
                fontSize: '10px',
                zIndex: 2,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          )}

          {/* Product Image */}
          <Box
            sx={{
              width: '100%',
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}
          >
            <BlurImage
              priority
              alt={product.name}
              src={product.image?.url || '/placeholder.png'}
              objectFit="contain"
              width={100}
              height={100}
            />
          </Box>

          {/* Product Details */}
          <Box sx={{ px: 1 }}>
            {/* Product Name */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                lineHeight: 1.3,
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 32,
                color: '#333'
              }}
            >
              {product.name}
            </Typography>

            {/* Price */}
            <Box sx={{ mb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#000' }}>
                  {fCurrency(product?.priceSale || product?.price)?.replace('$', '')}
                </Typography>
                {product?.price > product?.priceSale && (
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                      fontSize: '12px'
                    }}
                  >
                    {fCurrency(product?.price)?.replace('$', '')}
                  </Typography>
                )}
              </Stack>
            </Box>

            {/* Rating */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1.5 }}>
              <Rating 
                value={product.averageRating || 0} 
                precision={0.1} 
                size="small" 
                readOnly 
                sx={{ fontSize: '14px' }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
              </Typography>
            </Stack>

            {/* Free Delivery */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
              <MdLocalShipping size={12} color="#4caf50" />
              <Typography variant="caption" sx={{ color: '#4caf50', fontSize: '10px' }}>
                Free Delivery by Today 11 July
              </Typography>
            </Stack>

            {/* Availability */}
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BsCheckCircle size={12} color="#4caf50" />
              <Typography variant="caption" sx={{ color: '#4caf50', fontSize: '10px' }}>
                {product?.available > 0 ? 'Available in stock' : 'Out of stock'}
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Link>
    </Card>
  );
};

export default function RelatedProducts({ ...props }) {
  const { id } = props;
  const { data, isLoading } = useQuery(['related-products'], () => api.getRelatedProducts(id));
  
  if (!isLoading && !Boolean(data?.data?.length)) {
    return null;
  }

  return (
    <RootStyled>
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
          Similar Products
        </Typography>

        <Grid container spacing={2}>
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                  <Card sx={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
                  <Box sx={{ width: '100%', height: 120, bgcolor: '#f5f5f5', borderRadius: 1, mb: 2 }} />
                  <Box sx={{ height: 16, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }} />
                  <Box sx={{ height: 12, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1, width: '70%' }} />
                  <Box sx={{ height: 12, bgcolor: '#f5f5f5', borderRadius: 1 }} />
                </Card>
              </Grid>
            ))
          ) : (
              data?.data?.slice(0, 6).map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
            ))
          )}
        </Grid>
      </Box>
    </RootStyled>
  );
}
