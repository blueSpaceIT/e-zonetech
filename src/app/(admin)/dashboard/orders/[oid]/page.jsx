'use client';
import React from 'react';
// mui
import { Container, Grid, Box } from '@mui/material';
import OrderDetails from 'src/components/_main/orders/orderDetails';
import TableCard from 'src/components/table/order';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import OrderToolbarActions from 'src/components/_admin/orders/orderToolbarActions';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

Page.propTypes = {
  params: PropTypes.shape({
    oid: PropTypes.string.isRequired
  }).isRequired
};
export default function Page({ params }) {
  const { data, isLoading } = useQuery(['order-by-admin'], () => api.getOrderByAdmin(params.oid), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });
  return (
    <Box>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          links={[
            {
              name: 'Dashboard',
              href: '/dashboard'
            },
            {
              name: 'Orders',
              href: '/dashboard/orders'
            },
            {
              name: 'Order details',
              href: ''
            }
          ]}
          action={
            <>
              <OrderToolbarActions data={data?.data} />
            </>
          }
        />
      </Toolbar>
      <Container fixed>
        <Grid container direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
          <Grid item xs={12} md={4}>
            <OrderDetails data={data?.data} isLoading={isLoading} currency={'$'} />
          </Grid>
          <Grid item xs={12} md={8}>
            <TableCard data={data?.data} isLoading={isLoading} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
