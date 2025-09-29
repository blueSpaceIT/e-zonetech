import React from 'react';
// mui
import { Container } from '@mui/material';
// component
import CartMain from 'src/components/_main/cart';
// Skeletons
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
// Meta information
export const metadata = {
  title: 'Ezone Shopping Cart | Ezone - Convenient Shopping Cart for Easy Checkout',
  description:
    'View your shopping cart on Ezone for easy checkout. Add, remove, and manage items effortlessly. Enjoy a seamless shopping experience with secure transactions and personalized recommendations. Explore your cart now!',
  applicationName: 'Ezone',
  authors: 'Ezone',
  keywords:
    'shopping cart, Ezone, view cart, cart items, add to cart, remove from cart, manage cart, checkout, online shopping, secure transactions, personalized recommendations, seamless shopping, convenient shopping'
};

export default async function Cart() {
  return (
    <Container fixed>
      <HeaderBreadcrumbs
        heading="Cart"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Products',
            href: '/products'
          },
          {
            name: 'Cart'
          }
        ]}
      />
      <CartMain />
    </Container>
  );
}
