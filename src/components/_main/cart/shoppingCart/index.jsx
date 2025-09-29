'use client';
import React from 'react';
// proptypes
import PropTypes from 'prop-types';
// mui
import { Card, Button, CardHeader, Typography, Box, Skeleton, Stack, Divider } from '@mui/material';
// next
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
// lodash
import { sum } from 'lodash';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// icons
import { IoArrowBackOutline } from 'react-icons/io5';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { deleteCart, increaseQuantity, decreaseQuantity, getCart } from 'src/lib/redux/slices/product';
// gtm
import { gtmEvent } from 'src/utils/gtm';
// component
import CheckoutCard from 'src/components/cards/checkout';
import CheckoutProductList from 'src/components/lists/checkoutProduct';
// Styled
import RootStyled from './styled';

ShoppingCart.propTypes = {
  loading: PropTypes.bool.isRequired
};

const EmptyCart = dynamic(() => import('src/components/illustrations/emptyCart'), {
  loading: () => (
    <Stack>
      <Skeleton variant="rectangular" width="100%" height={300} />
    </Stack>
  )
});
// ----------------------------------------------------------------------

export default function ShoppingCart({ loading }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { checkout } = useSelector(({ product }) => product);
  const { cart } = checkout;

  const [count, setCount] = React.useState(0);

  const isEmptyCart = cart.length === 0;
  const handleDeleteCart = (productId) => {
    const product = cart.find(item => item.pid === productId || item._id === productId);
    dispatch(deleteCart(productId));
    setCount((prev) => prev + 1);
    
    // Track remove from cart event
    if (product) {
      gtmEvent('remove_from_cart', {
        currency: 'USD',
        value: product.priceSale * product.quantity,
        items: [{
          item_id: product.pid || product._id,
          item_name: product.name,
          price: product.priceSale,
          quantity: product.quantity,
          item_brand: product.brand?.name || '',
          item_category: product.category || ''
        }]
      });
    }
  };

  const handleIncreaseQuantity = (productId) => {
    const product = cart.find(item => item.pid === productId || item._id === productId);
    dispatch(increaseQuantity(productId));
    setCount((prev) => prev + 1);
    
    // Track add to cart event for quantity increase
    if (product) {
      gtmEvent('add_to_cart', {
        currency: 'USD',
        value: product.priceSale,
        items: [{
          item_id: product.pid || product._id,
          item_name: product.name,
          price: product.priceSale,
          quantity: 1,
          item_brand: product.brand?.name || '',
          item_category: product.category || ''
        }]
      });
    }
  };

  const handleDecreaseQuantity = (productId) => {
    const product = cart.find(item => item.pid === productId || item._id === productId);
    dispatch(decreaseQuantity(productId));
    setCount((prev) => prev + 1);
    
    // Track remove from cart event for quantity decrease
    if (product) {
      gtmEvent('remove_from_cart', {
        currency: 'USD',
        value: product.priceSale,
        items: [{
          item_id: product.pid || product._id,
          item_name: product.name,
          price: product.priceSale,
          quantity: 1,
          item_brand: product.brand?.name || '',
          item_category: product.category || ''
        }]
      });
    }
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { products: [] },
    onSubmit: () => {}
  });
  const { handleSubmit } = formik;
  const totalItems = sum(cart?.map((item) => item.quantity));

  // TEMPORARY: Commented out to test if this is causing shipping calculation issues
  // React.useEffect(() => {
  //   console.log('🛒 ShoppingCart useEffect - count changed to:', count);
  //   console.log('🛒 ShoppingCart useEffect - current cart state:', cart);
  //   console.log('🛒 ShoppingCart useEffect - calling getCart with cart data');
  //   dispatch(getCart(cart));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [count]);

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card className="card-main">
            <CardHeader
              className="card-header"
              title={
                loading ? (
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} width={120} />
                ) : (
                  <Typography variant="h4">
                    Shopping Cart
                    <Typography component="span" color="text.secondary">
                      &nbsp;({totalItems} {totalItems > 1 ? 'items' : 'item'})
                    </Typography>
                  </Typography>
                )
              }
            />

            {!isEmptyCart ? (
              <>
                <CheckoutCard
                  formik={formik}
                  onDelete={handleDeleteCart}
                  onIncreaseQuantity={handleIncreaseQuantity}
                  onDecreaseQuantity={handleDecreaseQuantity}
                  cart={cart}
                />
                <Box className="product-list">
                  <CheckoutProductList
                    formik={formik}
                    onDelete={handleDeleteCart}
                    onIncreaseQuantity={handleIncreaseQuantity}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    isLoading={loading}
                    cart={cart}
                  />
                </Box>
              </>
            ) : (
              <EmptyCart />
            )}
            <Divider />
            <Box mt={2}>
              <Button color="inherit" onClick={() => router.push('/')} startIcon={<IoArrowBackOutline />}>
                Continue Shopping
              </Button>
            </Box>
          </Card>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
