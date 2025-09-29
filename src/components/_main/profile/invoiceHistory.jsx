'use client';
// react
import React from 'react';
import { useQuery } from 'react-query';
// mui
import { Box } from '@mui/material';
// next
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
// api
import * as api from 'src/services';
// components
const Table = dynamic(() => import('src/components/table/table'));
const OrderRow = dynamic(() => import('src/components/table/rows/orderRow'));
const OrderCard = dynamic(() => import('src/components/cards/order'));

export default function InvoiceHistory() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { data, isLoading } = useQuery(['user-invoice', pageParam], () =>
    api.getUserInvoice(`?page=${pageParam || 1}`)
  );

  const tableData = {
    data: isLoading ? null : data?.data,

    count: data?.data.count
  };

  const TABLE_HEAD = [
    { id: 'name', label: 'Product', alignRight: false },
    { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
    { id: 'total', label: 'Total', alignRight: false, sort: true },
    { id: 'items', label: 'Items', alignRight: false },
    { id: 'inventoryType', label: 'Status', alignRight: false, sort: true },
    { id: 'action', label: 'Action', alignRight: true, sort: true }
  ];

  return (
    <Box mt={3}>
      {isLoading ? null : (
        <Table headData={TABLE_HEAD} data={tableData} isLoading={false} row={OrderRow} mobileRow={OrderCard} />
      )}
    </Box>
  );
}
