'use client';
import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
// mui
import { Box, Card, Typography, Stack, IconButton, useTheme, useMediaQuery, Tooltip, Skeleton } from '@mui/material';
// redux
import { useDispatch } from 'src/lib/redux/store';
import { setWishlist } from 'src/lib/redux/slices/wishlist';
import { useSelector } from 'react-redux';
// next
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// components
import Label from 'src/components/label';
import { fCurrency } from 'src/utils/formatNumber';
import BlurImage from 'src/components/blurImage';
// icons
import { IoMdHeartEmpty } from 'react-icons/io';
// api
import * as api from 'src/services';
// toast
import { toast } from 'react-hot-toast';
// icons

import { GoEye } from 'react-icons/go';

import { IoIosHeart } from 'react-icons/io';
import dynamic from 'next/dynamic';
import { FaCheckCircle, FaRegStar } from 'react-icons/fa';
import ColorPreviewGroup from 'src/components/colorPreviewGroup';
const ProductDetailsDialog = dynamic(() => import('../dialog/productDetails'));
export default function ShopProductCard({ ...props }) {
  const { product, loading } = props;

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  // type error
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const isTablet = useMediaQuery('(max-width:900px)');
  const [isLoading, setLoading] = useState(false);

  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err.response.data.message);
      toast.error(t(message ? t('common:' + JSON.parse(message)) : t('common:something-wrong')));
    }
  });

  const { name, slug, image, _id, averageRating } = !loading && product;
  const [selectedCity, setSelectedCity] = useState(null);

  // read initial selected city and listen for changes (storage and custom event)
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' && localStorage.getItem('selectedCity');
      if (saved) setSelectedCity(JSON.parse(saved));
    } catch (e) {
      setSelectedCity(null);
    }

    const onStorage = (e) => {
      if (e.key === 'selectedCity') {
        try {
          setSelectedCity(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          setSelectedCity(null);
        }
      }
    };

    const onCustom = (ev) => {
      try {
        setSelectedCity(ev.detail || null);
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('selectedCityChanged', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('selectedCityChanged', onCustom);
    };
  }, []);

  const deliveryDateText = useMemo(() => {
    if (loading || !product) return null;
    const days = Number(product?.deliveryWithin);
    if (!Number.isFinite(days)) return null;
    const extra = selectedCity && Number(selectedCity.deliveryTime) > 1 ? Number(selectedCity.deliveryTime) : 0;
    const d = new Date();
    d.setDate(d.getDate() + days + extra);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }, [loading, product?.deliveryWithin, product, selectedCity]);
  
  // Debug image data
  console.log('Product data:', product);
  console.log('Image data:', image);
  
  const linkTo = `/product/${slug ? slug : ''}`;

  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate(_id);
    }
  };

  return (
    <Card
      sx={{
        display: 'block',
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid #00000010 !important',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        },
        height: { xs: '320px', md: '348px'},
      }}
    >
      <Box
        sx={{
          position: 'relative'
        }}
      >
        {/* Discount Badge */}
        {!loading && product?.priceSale && product?.price > product?.priceSale && (
          <Label
            variant="filled"
            color={'success'}
            sx={{
              top: 8,
              left: 8,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              fontSize: 10,
              fontWeight: 600,
              borderRadius: '4px',
              backgroundColor: '#4caf50',
              color: 'white'
            }}
          >
            {`${(100 - (product?.priceSale / product?.price) * 100).toFixed()}% OFF`}
          </Label>
        )}

        {/* Out of Stock Badge */}
        {!loading && product?.available < 1 && (
          <Label
            variant="filled"
            color={'error'}
            sx={{
              top: 8,
              right: 8,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              fontSize: 10,
              fontWeight: 600,
              borderRadius: '4px'
            }}
          >
            Out of Stock
          </Label>
        )}

        <Box
          {...(product?.available > 0 && {
            component: Link,
            href: linkTo
          })}
          sx={{
            bgcolor: loading ? 'transparent' : 'white',
            position: 'relative',
            cursor: 'pointer',
            '&:after': {
              content: `""`,
              display: 'block',
              paddingBottom: '75%'
            },
            width: '100%',
            height: 'auto'
          }}
        >
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              sx={{
                height: '100%',
                position: 'absolute',
                borderRadius: 1
              }}
            />
          ) : (
            <Box 
              component={Link} 
              href={linkTo}
              sx={{
                top: 8,
                left: 8,
                right: 8,
                bottom: 8,
                display: 'block'
              }}
            >
              <BlurImage
                alt={name || 'Product image'}
                src={image?.url || '/placeholder-image.jpg'}
                fill
                draggable="false"
                style={{ 
                  objectFit: 'contain'
                }}
                placeholder="blur"
                blurDataURL={image?.blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Stack
        sx={{ p: 2 }}
        spacing={1}
      >
        {/* Product Name */}
        <Typography
          sx={{
            cursor: 'pointer',
            color: '#2D2D2D !important',
            textDecoration: 'none',
            textTransform: 'capitalize',
            fontWeight: 500,
            fontSize: { xs: '13px', sm: '14px' },
            lineHeight: 1.4,
            mb: 1,
            minHeight: '2.8em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
          {...(product?.available > 0 && {
            component: Link,
            href: linkTo
          })}
          variant={'body1'}
        >
          {loading ? <Skeleton variant="text" width="100%" height={20} /> : name}
        </Typography>

          <Stack
            direction="row"
            alignItems={'stretch'}
            justifyContent={'space-between'}
            sx={{
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: { xs: 1, sm: 0 }
            }}
          >
        {/* Price */}
  <Box sx={{ mb: {xs: 0, md: 1}, flex: '1 1 auto', minWidth: 0, display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <Skeleton variant="text" width={80} height={24} />
          ) : (
            <Stack direction="column" alignItems="start" spacing={{xs: 0, md: 1}}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '15px', sm: '16px' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {fCurrency(product?.priceSale || product?.price)}
              </Typography>
              {product?.priceSale && product?.price > product?.priceSale && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                    fontSize: { xs: '12px', sm: '14px' }
                  }}
                >
                  {fCurrency(product?.price)}
                </Typography>
              )}
            </Stack>
          )}
        </Box>

        {/* Rating */}
  <Box sx={{ mb: { xs: 0, md: 1 }, ml: { xs: 0, sm: 1 }, flex: '0 0 auto', minWidth: 'auto', display: 'flex', alignItems: 'center' }}>
          {loading ? (
            <Skeleton variant="text" width={60} height={16} />
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              sx={{
                height: '30px',
                borderRadius: '40px',
                border: '1px solid #e0e0e0',
                px: 1,
                py: 0,
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap'
              }}
            >
              <FaRegStar size={12} color="#007EFC" />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
                {averageRating || 0}
              </Typography>
            </Stack>
          )}
        </Box>

        </Stack>

        {/* Status and Delivery Info */}
        <Stack spacing={0.5}>
          {loading ? (
            <>
              <Skeleton variant="text" width={100} height={14} />
              <Skeleton variant="text" width={120} height={14} />
            </>
          ) : (
            <>
              {typeof product?.shipping === 'number' ? (
                product?.shipping === 0 ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '10px', sm: '11px' } }}>
                    🚚 Free Delivery by <span style={{ color: '#008E15'}}>{deliveryDateText || 'Today'}</span>
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '10px', sm: '11px' } }}>
                    🚚 Delivery at {product?.shipping} AED by <span style={{ color: '#008E15'}}>{deliveryDateText || 'Today'}</span>
                  </Typography>
                )
              ) : (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  🚚 Delivery information
                </Typography>
              )}
              <Typography variant="caption" sx={{ color: '#000000', fontSize: { xs: '10px', sm: '11px' }, fontWeight: 500, display: 'flex', alignItems: 'center', gap : 0.5 }}>
                <FaCheckCircle size={12} color="#4caf50" /> 
                {/* {product?.available > 0 ? 'Available in stock' : 'Out of stock'}  */}
                Free Store Pickup
              </Typography>
            </>
          )}
        </Stack>

        {/* Action Buttons Row */}
        {/* <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          {loading ? (
            <>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="circular" width={32} height={32} />
            </>
          ) : (
            <>
              <IconButton
                aria-label="view product"
                disabled={loading || product?.available < 1}
                onClick={() => setOpen(true)}
                size="small"
                sx={{ 
                  backgroundColor: '#f5f5f5',
                  '&:hover': { backgroundColor: theme.palette.primary.light }
                }}
              >
                <GoEye size={16} />
              </IconButton>

              {wishlist?.filter((v) => v._id === _id).length > 0 ? (
                <IconButton
                  disabled={isLoading}
                  onClick={onClickWishList}
                  aria-label="remove from wishlist"
                  color="primary"
                  size="small"
                >
                  <IoIosHeart size={16} />
                </IconButton>
              ) : (
                <IconButton
                  disabled={isLoading}
                  onClick={onClickWishList}
                  aria-label="add to wishlist"
                  size="small"
                  sx={{ 
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: theme.palette.primary.light }
                  }}
                >
                  <IoMdHeartEmpty size={16} />
                </IconButton>
              )}
            </>
          )}
        </Stack> */}
      </Stack>
      {open && <ProductDetailsDialog slug={product.slug} open={open} onClose={() => setOpen(false)} />}
    </Card>
  );
}
ShopProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string,
    sku: PropTypes.string,
    status: PropTypes.string,
    image: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    available: PropTypes.number,
    colors: PropTypes.array,
    averageRating: PropTypes.number
  }),
  loading: PropTypes.bool.isRequired
};
