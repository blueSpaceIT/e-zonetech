'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
// mui
import { Card, CardContent, Typography, Stack, Divider, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hook
import { fCurrency } from 'src/utils/formatNumber';
// redux
import { useSelector } from 'react-redux';
// toast
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';

import PropTypes from 'prop-types';

PaymentInfo.propTypes = {
  setCouponCode: PropTypes.func.isRequired,
  setTotal: PropTypes.func.isRequired
};

function isExpired(expirationDate) {
  const currentDateTime = new Date();
  return currentDateTime >= new Date(expirationDate);
}

export default function PaymentInfo({ setCouponCode, setTotal }) {
  const { product } = useSelector((state) => state);
  const { total, shipping, subtotal } = product.checkout;
  // no frontend-added tax; invoices continue to show tax if needed
  const [code, setCode] = useState('');

  const [discountPrice, setDiscountPrice] = useState(null);
  const [appliedDiscount, setDiscount] = useState(null);

  const { mutate, isLoading } = useMutation(api.applyCouponCode, {
    onSuccess: ({ data }) => {
      const expired = isExpired(data.expire);
      if (expired) {
        toast.error('Coupon code is expired!');
        return;
      }

        if (data.type === 'percent') {
        const percentLess = data.discount;
        setCouponCode(code);
        // Calculate the discount amount (no tax applied)
  const discount = (percentLess / 100) * subtotal;
  const discountedSubtotal = subtotal - discount;
  const totalWithoutTax = discountedSubtotal + (shipping || 0);
  setDiscount(discount);

  setDiscountPrice(totalWithoutTax);
  setTotal(totalWithoutTax);
        toast.success('Coupon code applied. You have saved ' + fCurrency(discount));
      } else {
  const discountedSubtotal = subtotal - data.discount;
  const totalWithoutTax = discountedSubtotal + (shipping || 0);
  setDiscount(data.discount);
  setTotal(totalWithoutTax);
  setCouponCode(code);
  toast.success('Coupon code applied. You have saved ' + fCurrency(data.discount));
  setDiscountPrice(totalWithoutTax);
      }
    },
    onError: () => {
      toast.error('Coupon code is not valid');
    }
  });

  const onApplyCoupon = () => {
    if (code.length > 3) {
      mutate(code);
    } else {
      toast.error('Enter valid coupon code.');
    }
  };
  // compute tax and total for display (respect appliedDiscount when present)
  const discountAmt = appliedDiscount || 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmt);
  const taxValue = 0; // tax not applied here
  const computedTotal = taxableSubtotal + (shipping || 0);
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>

        <Stack spacing={0} mt={1} mb={2} gap={1}>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">{fCurrency(subtotal)}</Typography>
          </Stack>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Discount:
            </Typography>
            <Typography variant="subtitle2">-{fCurrency(appliedDiscount || 0)}</Typography>
          </Stack>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">{!shipping ? 'Free' : fCurrency(shipping)}</Typography>
          </Stack>
          {/* Tax row removed - tax is shown only on invoices */}

          <Stack direction={'row'} gap={1}>
            <TextField
              id="coupon-field"
              fullWidth
              placeholder="Enter coupon code"
              size="small"
              value={code}
              disabled={Boolean(discountPrice)}
              onChange={(e) => setCode(e.target.value)}
            />
            <LoadingButton
              loading={isLoading}
              onClick={onApplyCoupon}
              variant="contained"
              color="primary"
              disabled={Boolean(discountPrice) || code.length < 4}
            >
              {discountPrice ? 'Applied' : 'Apply'}
            </LoadingButton>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
            <Typography variant="subtitle1">{fCurrency(discountPrice || total || computedTotal)}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
