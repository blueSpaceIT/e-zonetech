'use client';
import React from 'react';

// toast
import toast from 'react-hot-toast';
// components
import DailyEaring from 'src/components/_admin/dashboard/dailyEarning';
import SignupUsers from 'src/components/_admin/dashboard/signupUsers';
import TotalProducts from 'src/components/_admin/dashboard/totalProducts';
import DailyOrders from 'src/components/_admin/dashboard/dailyOrders';
import OrderChart from 'src/components/charts/Order';
import SalesChart from 'src/components/charts/Sales';
import IncomeChart from 'src/components/charts/Income';
import BestSelling from './bestSelling';
// mui
import { Grid, Box } from '@mui/material';
// react-query
import { useQuery } from 'react-query';
// api
import * as api from 'src/services';

export default function Dashboard() {
  const { data: dashboard, isLoading } = useQuery('dashboard-analytics', api.dashboardAnalytics, {
    refetchInterval: 10000,
    onError: (error) => toast.error(error.message || 'Something went wrong!')
  });
  const data = dashboard?.data || {};
  const daily_earning = data?.dailyEarning;
  const daily_orders = data?.dailyOrders;
  const daily_users = data?.users;
  const totalProducts = data?.totalProducts;
  const sales_report = data?.salesReport;
  const income_report = data?.incomeReport;
  const orders_report = data?.ordersReport;
  const bestSellingProducts = data?.bestSellingProducts;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DailyEaring data={daily_earning} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DailyOrders data={daily_orders} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SignupUsers data={daily_users} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TotalProducts data={totalProducts} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={7} lg={7}>
          <SalesChart data={sales_report} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={5} lg={5}>
          <OrderChart data={orders_report} isLoading={isLoading} />
        </Grid>
        <Grid item xs={12} md={4} lg={4}>
          <BestSelling data={bestSellingProducts} loading={isLoading} />
        </Grid>
        <Grid item xs={12} md={8} lg={8}>
          <IncomeChart data={income_report} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
}
