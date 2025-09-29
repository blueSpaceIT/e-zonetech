'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Stack, IconButton, Skeleton } from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Link from 'next/link';

export default function DeliveryCityCard({ row, isLoading = false, handleClickOpen }) {
  if (isLoading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </CardContent>
      </Card>
    );
  }

  const name = row?.name || '-';
  const deliveryTime = typeof row?.deliveryTime !== 'undefined' ? row.deliveryTime : '-';
  const status = row?.status || '-';

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <div>
            <Typography variant="subtitle1">{name}</Typography>
            <Typography variant="body2">Delivery time: {deliveryTime} day(s)</Typography>
            <Typography variant="caption">Status: {status}</Typography>
          </div>
          <div>
            <Link href={`/dashboard/delivery-cities/edit/${row?._id || ''}`}>
              <IconButton size="small" color="primary">
                <EditTwoToneIcon fontSize="small" />
              </IconButton>
            </Link>
            <IconButton size="small" color="error" onClick={handleClickOpen(row?._id)}>
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}

DeliveryCityCard.propTypes = {
  isLoading: PropTypes.bool,
  row: PropTypes.object,
  handleClickOpen: PropTypes.func.isRequired
};
