import React from 'react';
// mui
import { Container } from '@mui/material';
import Breadcrumbs from '../breadcrumbs';
import MainCartSkeleton from './mainCart';

export default function CartSkeleton() {
  return (
    <Container fixed>
      <Breadcrumbs />
      <MainCartSkeleton />
    </Container>
  );
}
