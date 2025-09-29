"use client";

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { useQuery } from 'react-query';
import { Dialog } from '@mui/material';

import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import PaymentFeatureCard from 'src/components/cards/paymentFeatureCard';
import PaymentFeatureRow from 'src/components/table/rows/paymentFeature';
import { useSearchParams } from 'next/navigation';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Created', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];

export default function PaymentFeatures() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['payment-features', apicall, searchParam, pageParam],
    () => api.getPaymentFeatures(),
    {
      onError: (err) => toast.error(err?.response?.data?.message || 'Something went wrong!')
    }
  );

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
          endPoint="deletePaymentFeature"
          type={'Payment feature deleted'}
          deleteMessage={'Are you sure you want to delete this payment feature?'}
        />
      </Dialog>

      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Payment features"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Payment features'
            }
          ]}
          action={{
            href: `/dashboard/payment-features/add`,
            title: 'Add Payment feature'
          }}
        />
      </Toolbar>
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={PaymentFeatureCard}
        isLoading={isLoading}
        row={PaymentFeatureRow}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}