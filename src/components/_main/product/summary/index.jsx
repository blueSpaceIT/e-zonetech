// react
'use client';
import { useState, useEffect, useMemo } from 'react';

// mui
import {
  Box,
  Stack,
  Button,
  IconButton,
  Typography,
  Tooltip,
  FormHelperText,
  Skeleton,
  Rating,
  useMediaQuery,
  Grid
} from '@mui/material';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { MdContentCopy, MdKeyboardArrowDown, MdLocalShipping, MdLocationOn, MdPayment } from 'react-icons/md';
import { BsCart3, BsCashCoin, BsShield, BsArrowRepeat, BsTruck } from 'react-icons/bs';
// next
import { useRouter } from 'next-nprogress-bar';
// formik
import { useFormik, Form, FormikProvider, useField } from 'formik';
// redux
import { useDispatch, useSelector } from 'src/lib/redux/store';
import { addCart } from 'src/lib/redux/slices/product';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'next-share';
// toast
import { toast } from 'react-hot-toast';
import { useQuery } from 'react-query';
import * as api from 'src/services';

// styles
import RootStyled from './styled';
// components
import ColorPreview from 'src/components/colorPreview';
import SizePreview from 'src/components/sizePicker';
import { fCurrency } from 'src/utils/formatNumber';

import PropTypes from 'prop-types';

ProductDetailsSumary.propTypes = {
  product: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  id: PropTypes.string.isRequired,
  totalReviews: PropTypes.number.isRequired,
  totalRating: PropTypes.number.isRequired,
  brand: PropTypes.object,
  category: PropTypes.object,
  selectedColor: PropTypes.string,
  onColorChange: PropTypes.func,
  brand: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired
};

const Incrementer = ({ ...props }) => {
  const { available } = props;
  const [field, , helpers] = useField(props);
  // eslint-disable-next-line react/prop-types

  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box className="incrementer" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton 
        size="small" 
        color="inherit" 
        disabled={value <= 1} 
        onClick={decrementQuantity}
        sx={{ 
          width: 24, 
          height: 24,
          border: '1px solid #e0e0e0',
          borderRadius: 0.5,
          '&:hover': { bgcolor: '#f5f5f5' }
        }}
      >
        <IoIosRemove size={14} />
      </IconButton>
      <Typography 
        variant="body2" 
        component="span" 
        className="text"
        sx={{ 
          minWidth: 20,
          textAlign: 'center',
          fontWeight: 500,
          fontSize: '14px'
        }}
      >
        {value}
      </Typography>
      <IconButton 
        size="small" 
        color="inherit" 
        disabled={value >= available} 
        onClick={incrementQuantity}
        sx={{ 
          width: 24, 
          height: 24,
          border: '1px solid #e0e0e0',
          borderRadius: 0.5,
          '&:hover': { bgcolor: '#f5f5f5' }
        }}
      >
        <IoIosAdd size={14} />
      </IconButton>
    </Box>
  );
};
Incrementer.propTypes = {
  available: PropTypes.number.isRequired
};
export default function ProductDetailsSumary({ ...props }) {
  const { 
    product, 
    isLoading = false, 
    totalReviews, 
    totalRating, 
    brand, 
    category,
    selectedColor,
    onColorChange
  } = props;
  const [isClient, setIsClient] = useState(false);
  // Use external color state if provided, otherwise use internal state
  const [internalColor, setInternalColor] = useState(0);
  const [size, setSize] = useState(0);
  
  // Determine which color state to use
  const color = selectedColor !== null && selectedColor !== undefined ? 
    (product?.colors?.indexOf(selectedColor) !== -1 ? product.colors.indexOf(selectedColor) : 0) : 
    internalColor;
  
  const setColor = (newColorIndex) => {
    if (onColorChange && product?.colors) {
      // Use external color state management
      onColorChange(product.colors[newColorIndex]);
    } else {
      // Use internal color state management
      setInternalColor(newColorIndex);
    }
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  const router = useRouter();

  const dispatch = useDispatch();

  const { checkout } = useSelector(({ product }) => product);

  const [isLoaded, setLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  // read selected city from localStorage and listen for changes so delivery date updates
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

  const isMaxQuantity =
    !isLoading &&
    checkout.cart.filter((item) => item._id === product?._id).map((item) => item.quantity)[0] >= product?.available;

  const onAddCart = (param) => {
    toast.success('Added to cart');
    dispatch(addCart(param));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pid: product?._id,
      cover: product?.cover,

      quantity: 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const alreadyProduct = !isLoading && checkout.cart.filter((item) => item.pid === values.pid);
        if (!Boolean(alreadyProduct.length)) {
          const colorSelected = product?.colors.find((_, index) => index === color);
          const sizeSelected = product?.sizes.find((_, index) => index === size);
          console.log('🛒 OnSubmit - Full product object:', product);
          console.log('🛒 OnSubmit - Product shipping field:', product?.shipping);
          onAddCart({
            pid: product._id,
            sku: product.sku,
            color: colorSelected,
            size: sizeSelected,
            shipping: product?.shipping || 0,
            image: product?.images[0].url,
            quantity: values.quantity,
            price: product.priceSale === 0 ? product.price : product.priceSale,
            priceSale: product.priceSale === 0 ? product.price : product.priceSale,
            subtotal: (product.priceSale || product?.price) * values.quantity
          });
          setFieldValue('quantity', 1);
        }

        setSubmitting(false);
        router.push('/cart');
      } catch (error) {
        setSubmitting(false);
      }
    }
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;
  const handleAddCart = () => {
    const colorSelected = product?.colors.find((_, index) => index === color);
    const sizeSelected = product?.sizes.find((_, index) => index === size);
    console.log('🛒 HandleAddCart - Full product object:', product);
    console.log('🛒 HandleAddCart - Product shipping field:', product?.shipping);
    onAddCart({
      pid: product._id,
      sku: product.sku,
      color: colorSelected,
      shipping: product?.shipping || 0,
      image: product?.images[0].url,
      size: sizeSelected,
      quantity: values.quantity,
      price: product.priceSale === 0 ? product.price : product.priceSale,
      priceSale: product.priceSale === 0 ? product.price : product.priceSale,
      subtotal: (product.priceSale || product?.price) * values.quantity
    });
    setFieldValue('quantity', 1);
  };

  const handleBuyNow = () => {
    const colorSelected = product?.colors.find((_, index) => index === color);
    const sizeSelected = product?.sizes.find((_, index) => index === size);
    // Add to cart then navigate to checkout
    onAddCart({
      pid: product._id,
      sku: product.sku,
      color: colorSelected,
      shipping: product?.shipping || 0,
      image: product?.images[0].url,
      size: sizeSelected,
      quantity: values.quantity,
      price: product.priceSale === 0 ? product.price : product.priceSale,
      priceSale: product.priceSale === 0 ? product.price : product.priceSale,
      subtotal: (product.priceSale || product?.price) * values.quantity
    });
    setFieldValue('quantity', 1);
    router.push('/checkout');
  };

  const deliveryDateText = useMemo(() => {
    if (!product) return null;
    const days = Number(product?.deliveryWithin);
    if (!Number.isFinite(days)) return null;

    // base date from product.deliveryWithin
    const d = new Date();

    // If a selectedCity exists in localStorage and has deliveryTime > 1, add it
    const extra = selectedCity && Number(selectedCity.deliveryTime) > 1 ? Number(selectedCity.deliveryTime) : 0;

    d.setDate(d.getDate() + days + extra);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long' });
  }, [product?.deliveryWithin, product, selectedCity]);

  useEffect(() => {
    setLoaded(true);
  }, []);
  const isMobile = useMediaQuery('(max-width:768px)');
  const { data: pfData, isLoading: pfLoading } = useQuery(['public-payment-features'], api.getPublicPaymentFeatures, { retry: false });
  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <Grid container spacing={4}>
            {/* Left Column - Product Details */}
            <Grid item xs={12} md={7}>
              {/* Product Title */}
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, lineHeight: 1.3 }}>
                {product?.name}
              </Typography>

              {/* Rating and Share */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={totalRating || 0} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {totalRating ? totalRating.toFixed(1) : '0.0'}
                  </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<MdContentCopy size={16} />}
                  onClick={() => {
                    navigator.clipboard.writeText(window?.location.href);
                    toast.success('Link copied.');
                  }}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 2
                  }}
                >
                  Share
                </Button>
              </Box>

              {/* Model and SKU */}
              {(product?.model || product?.sku) && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {product?.model && (
                      <>
                        <strong>Model:</strong> {product.model}
                        {product?.sku && <> &nbsp;&nbsp;&nbsp;</>}
                      </>
                    )}
                    {product?.sku && (
                      <>
                        <strong>SKU:</strong> {product.sku}
                      </>
                    )}
                  </Typography>
                </Box>
              )}

              {/* Product Specifications */}
              {product?.specifications && product.specifications.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Grid container spacing={2}>
                    {product.specifications.map((spec, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box sx={{ textAlign: 'center', p: 1, backgroundColor: '#F8F8F8', borderRadius: '8px' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            {spec.title}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {spec.description}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* {product?.description && (
                        <Box sx={{ mb: 4 }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
                            Summary
                          </Typography>
                          <Typography 
                            variant="body1" 
                            color="text.primary" 
                            sx={{ 
                              lineHeight: 1.2,
                              '& p': {
                                mb: 1
                              },
                              '& ul, & ol': {
                                pl: 3,
                                mb: 1
                              },
                              '& li': {
                                mb: 1
                              }
                            }}
                            dangerouslySetInnerHTML={{ __html: product.description.substring(0, 300) }}
                          />
                        </Box>
                      )} */}

              {/* Color Selection */}
              {product?.colors && product.colors.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Color: {product.colors[color] && (
                      <span style={{ fontWeight: 400, color: '#666' }}>
                        {product.colors[color]}
                      </span>
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {product.colors.map((colorOption, index) => (
                      <Box
                        key={index}
                        onClick={() => setColor(index)}
                        sx={{
                          width: 48,
                          height: 48,
                          border: index === color ? '3px solid #2196F3' : '1px solid #e0e0e0',
                          borderRadius: 1,
                          cursor: 'pointer',
                          p: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': {
                            borderColor: '#2196F3'
                          }
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: colorOption.toLowerCase(),
                            borderRadius: 0.5,
                            // For color names that aren't valid CSS colors, show first letter
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colorOption.toLowerCase() === 'white' || colorOption.toLowerCase() === 'yellow' ? '#000' : '#fff'
                          }}
                        >
                          {!['red', 'blue', 'green', 'yellow', 'black', 'white', 'gray', 'grey', 'pink', 'purple', 'orange', 'brown'].includes(colorOption.toLowerCase()) && 
                            colorOption.charAt(0).toUpperCase()
                          }
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Size Selection */}
              {product?.sizes && product.sizes.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Size: {product.sizes[size] && (
                      <span style={{ fontWeight: 400, color: '#666' }}>
                        {product.sizes[size]}
                      </span>
                    )}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {product.sizes.map((sizeOption, index) => (
                      <Button
                        key={index}
                        variant={index === size ? "contained" : "outlined"}
                        size="small"
                        onClick={() => setSize(index)}
                        sx={{ 
                          textTransform: 'none',
                          bgcolor: index === size ? '#1976d2' : 'transparent',
                          color: index === size ? 'white' : 'text.primary',
                          borderRadius: 2,
                          px: 2,
                          minWidth: 'auto'
                        }}
                      >
                        {sizeOption}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              )}
            </Grid>

            {/* Right Column - Pricing Panel */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 2,
                  p: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  position: 'sticky',
                  top: 20
                }}
              >
                {/* Price Section */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="baseline" spacing={2}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#000'
                      }}
                    >
                      {!isLoading && isLoaded && fCurrency(product?.priceSale || product?.price)?.replace('$', '')}
                    </Typography>
                    {product?.price > product?.priceSale && (
                      <>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            textDecoration: 'line-through',
                            color: 'text.secondary',
                            fontWeight: 400
                          }}
                        >
                          {!isLoading && isLoaded && fCurrency(product?.price)?.replace('$', '')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                          -{(100 - (product?.priceSale / product?.price) * 100).toFixed(0)}% off
                        </Typography>
                      </>
                    )}
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Inclusive All Tax
                  </Typography>
                </Box>

                {/* Availability Status */}
                {product?.available !== undefined && (
                  <Box sx={{ mb: 3 }}>
                    {
                      product?.showStock &&
                      <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: product.available > 0 ? '#4caf50' : '#f44336'
                        }}
                      />
                      
                        
                        <Typography variant="body2" sx={{ fontWeight: 500, color: product.available > 0 ? '#4caf50' : '#f44336' }}>
                        {product.available > 0 ? `${product.available} Available in stock` : 'Out of stock'}
                      </Typography>
                      
                      
                    </Stack>
                    }
                    
                  </Box>
                )}

                {/* Shipping Method */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                    Shipping Method
                  </Typography>
                  <Box
                    sx={{
                      border: '1px solid #4caf50',
                      borderRadius: 2,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      bgcolor: '#008E150D'
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          border: '1px solid #4caf50',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'white'
                        }}
                      >
                        <MdLocalShipping size={16} color="#4caf50" />
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Standard Delivery
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          <span style={{ color: '#008E15'}}>{deliveryDateText || 'Today'}</span>
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                      {typeof product?.shipping === 'number' ? (
                product?.shipping === 0 ? (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '10px', sm: '11px' } }}>
                    🚚 Free Delivery
                  </Typography>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '10px', sm: '11px' } }}>
                    At {product?.shipping} AED
                  </Typography>
                )
              ) : (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '11px' }}>
                  Free (For You!)
                </Typography>
              )}
                    </Typography>
                  </Box>
                </Box>

                {/* Quantity and Add to Cart */}
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  {/* Quantity Selector */}
                  <Box
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      px: 2,
                      py: 1,
                      minWidth: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Incrementer name="quantity" available={product?.available || 1} />
                  </Box>

                  
                </Stack>

                

                {/* Buy Now Button */}
                
                  <Button
                    fullWidth
                    disabled={isLoading || product?.available < 1}
                    size="large"
                    type="button"
                    color="primary"
                    variant="contained"
                    
                    onClick={handleBuyNow}
                    sx={{
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 1,
                      textTransform: 'none',
                      backgroundColor: '#0076EB',
                    }}
                  >
                    Buy Now
                  </Button>
                

                {/* Add to Cart Button */}
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Button
                    fullWidth
                    disabled={isMaxQuantity || isLoading || product?.available < 1}
                    size="large"
                    type="button"
                    color="secondary"
                    variant="outlined"
                    onClick={() => handleAddCart(product)}
                    startIcon={<BsCart3 size={18} />}
                    sx={{ 
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 1,
                      textTransform: 'none',
                    }}
                  >
                    Add To Cart
                  </Button>
                  </Box>

                {/* Deliver To */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MdLocationOn size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      Deliver To
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedCity?.name || 'Dubai'}
                    </Typography>
                  </Stack>
                </Box>

                {/* Payment Methods */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <MdPayment size={16} color="#666" />
                    <Typography variant="body2" color="text.secondary">
                      Payment Methods
                    </Typography>
                  </Stack>
                  {/* <Stack direction="row" spacing={1}>
                    <Box
                      sx={{
                        width: 40,
                        height: 24,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#1A1F71',
                        fontSize: '8px',
                        fontWeight: 600,
                        color: 'white'
                      }}
                    >
                      VISA
                    </Box>
                    <Box
                      sx={{
                        width: 40,
                        height: 24,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#EB001B',
                        fontSize: '8px',
                        fontWeight: 600,
                        color: 'white'
                      }}
                    >
                      MC
                    </Box>
                    <Box
                      sx={{
                        width: 40,
                        height: 24,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#006FCF',
                        fontSize: '7px',
                        fontWeight: 600,
                        color: 'white'
                      }}
                    >
                      AMEX
                    </Box>
                  </Stack> */}
                </Box>

                {/* Global Payment Features (from API) */}
                <div style={{ padding: '10px', border: '1px solid #0088ffff', borderRadius: '8px' }}>
                  {(() => {
                    const features = pfData?.data || [];
                    if (pfLoading || !features || features.length === 0) return null;

                    const getFeatureIcon = (featureText) => {
                      const text = (featureText || '').toLowerCase();
                      if (text.includes('cash') || text.includes('cod')) {
                        return <BsCashCoin size={14} color="#2196f3" />;
                      } else if (text.includes('return') || text.includes('exchange') || text.includes('days')) {
                        return <BsArrowRepeat size={14} color="#2196f3" />;
                      } else if (text.includes('shipping') || text.includes('cash on delivery') || text.includes('express')) {
                        return <MdLocalShipping size={14} color="#2196f3" />;
                      } else if (text.includes('secure') || text.includes('safe') || text.includes('protection')) {
                        return <BsShield size={14} color="#2196f3" />;
                      } else if (text.includes('payment') || text.includes('card') || text.includes('paypal')) {
                        return <MdPayment size={14} color="#2196f3" />;
                      } 
                      else if (text.includes('zone')) {
                        return <BsTruck size={14} color="#2196f3" />;}
                      else {
                        return <BsShield size={14} color="#2196f3" />; // Default icon
                      }
                    };

                    return (
                      <Grid container spacing={2} sx={{ mb: 0 }}>
                        {features.map((feature, index) => {
                          const featureName = feature?.name || '';
                          const featureDesc = feature?.description || '';
                          return (
                            <Grid item xs={6} key={index}>
                              <Tooltip
                                title={featureDesc ? <div style={{ maxWidth: 300 }} dangerouslySetInnerHTML={{ __html: featureDesc }} /> : ''}
                                arrow
                                placement="top"
                                followCursor={false}
                                enterDelay={200}
                                leaveDelay={200}
                              >
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ cursor: featureDesc ? 'pointer' : 'default' }}>
                                  {getFeatureIcon(featureName)}
                                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                                    {featureName}
                                  </Typography>
                                  <IconButton size="small">
                                    <MdKeyboardArrowDown />
                                  </IconButton>
                                </Stack>
                              </Tooltip>
                            </Grid>
                          );
                        })}
                      </Grid>
                    );
                  })()}
                </div>

                {/* Buy Now Button */}
                {/* <Button
                  disabled={isLoading || product?.available < 1}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="outlined"
                  color="primary"
                  sx={{ 
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderRadius: 1,
                    borderWidth: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderWidth: 2
                    }
                  }}
                >
                  Buy Now
                </Button> */}
              </Box>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 54,
            zIndex: 1400,
            px: 2,
            py: 1,
            bgcolor: 'background.paper',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}
        >
          <Button
            fullWidth
            disabled={isLoading || product?.available < 1}
            size="large"
            type="button"
            color="primary"
            variant="contained"
            onClick={handleBuyNow}
            sx={{ flex: 1, py: 1.25, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none' }}
          >
            Buy Now
          </Button>
          <Button
            fullWidth
            disabled={isMaxQuantity || isLoading || product?.available < 1}
            size="large"
            type="button"
            color="secondary"
            variant="outlined"
            onClick={() => handleAddCart(product)}
            startIcon={<BsCart3 size={18} />}
            sx={{ flex: 1, py: 1.25, fontWeight: 600, fontSize: '0.8rem', textTransform: 'none' }}
          >
            Add To Cart
          </Button>

          
        </Box>
      )}
    </RootStyled>
  );
}
