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
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import AdminBannerCard from 'src/components/cards/adminBanner';
import Banner from 'src/components/table/rows/banner';
import { useSearchParams } from 'next/navigation';

const TABLE_HEAD = [
  { id: 'heading', label: 'Banner', alignRight: false, sort: true },
  { id: 'color', label: 'Color', alignRight: false, sort: false },
  { id: 'buttons', label: 'Buttons', alignRight: false, sort: false },
  { id: 'order', label: 'Order', alignRight: false, sort: true },
  { id: 'status', label: 'Status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminBanners() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['admin-banners', apicall, searchParam, pageParam],
    () => api.getAdminBanners(+pageParam || 1, searchParam || ''),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
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
          endPoint="deleteBanner"
          type={'Banner deleted'}
          deleteMessage={
            'Are you really sure you want to remove this banner? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={AdminBannerCard}
        isLoading={isLoading}
        row={Banner}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}
