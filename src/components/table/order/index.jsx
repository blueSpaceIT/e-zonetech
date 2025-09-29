'use client';
import React from 'react';
//  mui
import { Typography, Skeleton, Divider, Table, TableBody, TableRow, TableCell } from '@mui/material';
// components
import OrderDetailsTable from '../orderDetail';
import { fCurrency } from 'src/utils/formatNumber';
// styled
import RootStyled from './styled';

import PropTypes from 'prop-types';

TableCard.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.array.isRequired,
    totalItems: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function TableCard({ ...props }) {
  const { data, isLoading } = props;
  const items = data?.items;
  // show tax only if provided by order data (invoices or backend). Do not compute frontend 5% fallback here.
  const taxAmount = data?.tax ?? 0;
  return (
    <RootStyled>
      {isLoading ? (
        <Skeleton variant="text" width={100} className="skeleton-h5" />
      ) : (
        <Typography variant="h5" p={2}>
          {data?.totalItems} {data?.totalItems > 1 ? 'Items' : 'Item'}
        </Typography>
      )}
      <OrderDetailsTable currency={'$'} data={items} isLoading={isLoading} />
      <Divider />
      <Table>
        <TableBody>
          <TableRow className="body-row">
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Subtotal</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{fCurrency(data?.subTotal)}</strong>
              )}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Shipping Fee</strong>
              )}
            </TableCell>

            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{fCurrency(data?.shipping)}</strong>
              )}
            </TableCell>
          </TableRow>
          {/* Tax row removed from order table - invoices show tax */}
          
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>Discount</strong>
              )}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>-{fCurrency(data?.discount)}</strong>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={4}></TableCell>
            <TableCell align="right">
              {isLoading ? <Skeleton variant="text" className="skeleton-text" width={100} /> : <strong>Total</strong>}
            </TableCell>
            <TableCell align="right">
              {isLoading ? (
                <Skeleton variant="text" className="skeleton-text" width={100} />
              ) : (
                <strong>{fCurrency(data?.total)}</strong>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </RootStyled>
  );
}
