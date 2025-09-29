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
import CategoryCard from 'src/components/cards/adminCategory';
import Category from 'src/components/table/rows/category';
// next
import { useSearchParams } from 'next/navigation';

const TABLE_HEAD = [
  { id: 'name', label: 'Category', alignRight: false, sort: true },
  { id: 'order', label: 'Order', alignRight: false, sort: true },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
// ----------------------------------------------------------------------
export default function CategoryList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isLoading } = useQuery(
    ['categories', apicall, searchParam, pageParam],
    () => api.getCategories(+pageParam || 1, searchParam || ''),
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
          endPoint="deleteCategory"
          type={'Category deleted'}
          deleteMessage={'Deleting this category will permanently remove it. Are you sure you want to proceed?'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={CategoryCard}
        isLoading={isLoading}
        row={Category}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}
