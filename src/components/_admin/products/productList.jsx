'use client';
import React, { useState, useEffect } from 'react';

// toast
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
// mui
import { Dialog, Box, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import ProductCard from 'src/components/cards/adminProduct';
import Product from 'src/components/table/rows/product';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';

const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false, sort: true },
  { id: 'sku', label: 'SKU', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: 'inventoryType', label: 'Status', alignRight: false, sort: false },
  { id: 'rating', label: 'Rating', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },

  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminProducts({ brands, categories }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [searchInput, setSearchInput] = useState(searchParam || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam || '');
  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  // debounced search effect (500ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading } = useQuery(
    ['admin-products', apicall, debouncedSearch, pageParam],
    () => api.getAdminProducts(+pageParam || 1, debouncedSearch || ''),
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
          endPoint="deleteProduct"
          type={'Product deleted'}
          deleteMessage={
            'Are you really sure you want to remove this product? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            )
          }}
          fullWidth
        />
      </Box>

      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={ProductCard}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        brands={brands}
        categories={categories}
      />
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired
};
