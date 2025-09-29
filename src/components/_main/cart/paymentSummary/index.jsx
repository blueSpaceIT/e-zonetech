'use client';
import React from 'react';
// mui
import { CardContent, Typography, Stack, Divider, Skeleton } from '@mui/material';
import { fCurrency } from 'src/utils/formatNumber';

//  styling
import RootStyled from './styled';
// redux
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

PaymentSummary.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default function PaymentSummary({ loading }) {
  const { product } = useSelector((state) => state);
  const { total, shipping, subtotal } = product.checkout;
  // totals exclude the extra 5% tax (invoices still show tax)
  const subValue = Number(subtotal) || 0;
  const shipValue = shipping ? Number(shipping) : 0;
  const taxValue = 0;
  const computedTotal = subValue + shipValue;
  return (
    <RootStyled>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>
        <Stack spacing={0} mt={1} mb={2}>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">
              {loading ? <Skeleton variant="text" width={80} /> : fCurrency(subtotal)}
            </Typography>
          </Stack>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">
              {loading ? <Skeleton variant="text" width={80} /> : !shipping ? 'Free' : fCurrency(parseInt(shipping))}
            </Typography>
          </Stack>
          {/* Tax row removed - tax is shown only on invoices */}
        </Stack>
        <Divider />
        <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">
            {loading ? <Skeleton variant="text" width={80} /> : fCurrency(computedTotal)}
          </Typography>
        </Stack>
      </CardContent>
    </RootStyled>
  );
}
