'use client';
import React from 'react';
import PropTypes from 'prop-types';
// mui
import { TableRow, TableCell, Typography, Stack, IconButton, Skeleton } from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import Link from 'next/link';

export default function DeliveryCity({ row, isLoading = false, handleClickOpen }) {
  // guard for missing row during loading
  if (isLoading) {
    return (
      <TableRow hover tabIndex={-1} role="checkbox">
        <TableCell>
          <Skeleton variant="text" width={120} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={120} />
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        </TableCell>
      </TableRow>
    );
  }

  const name = row?.name || '-';
  const deliveryTime = typeof row?.deliveryTime !== 'undefined' ? row.deliveryTime : '-';
  const status = row?.status || '-';
  const createdAt = row?.createdAt ? new Date(row.createdAt).toLocaleString() : '-';

  return (
    <TableRow hover tabIndex={-1} role="checkbox">
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <div>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{deliveryTime}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{status}</Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{createdAt}</Typography>
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end" spacing={1}>
          <Link href={`/dashboard/delivery-cities/edit/${row?._id || ''}`}>
            <IconButton size="small" color="primary">
              <EditTwoToneIcon fontSize="small" />
            </IconButton>
          </Link>
          <IconButton size="small" color="error" onClick={handleClickOpen(row?._id)}>
            <DeleteTwoToneIcon fontSize="small" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

DeliveryCity.propTypes = {
  isLoading: PropTypes.bool,
  row: PropTypes.object,
  handleClickOpen: PropTypes.func.isRequired
};
