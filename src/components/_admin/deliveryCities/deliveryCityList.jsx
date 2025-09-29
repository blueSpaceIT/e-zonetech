'use client';
import React, { useState } from 'react';
// toast
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import DeliveryCityCard from 'src/components/cards/deliveryCityCard';
import DeliveryCityRow from 'src/components/table/rows/deliveryCity';
// next
import { useSearchParams } from 'next/navigation';

const TABLE_HEAD = [
  { id: 'name', label: 'City', alignRight: false, sort: true },
  { id: 'deliveryTime', label: 'Delivery Time (days)', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function DeliveryCityList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery([
    'delivery-cities',
    apicall,
    searchParam,
    pageParam
  ], () => api.getDeliveryCities(+pageParam || 1, searchParam || ''), {
    onError: (err) => toast.error(err?.response?.data?.message || 'Something went wrong!')
  });

  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteDeliveryCity"
          type={'Delivery city deleted'}
          deleteMessage={'Are you sure you want to delete this delivery city? This action cannot be undone.'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={DeliveryCityCard}
        isLoading={isLoading}
        row={DeliveryCityRow}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}
