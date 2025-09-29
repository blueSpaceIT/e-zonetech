'use client';
import React from 'react';
// mui
import { Card, Box, Typography, IconButton, Divider, Tooltip } from '@mui/material';
// Next
import { useRouter } from 'next-nprogress-bar';
// icons
import { MdClear } from 'react-icons/md';
// PropTypes;
import PropTypes from 'prop-types';
// react query
import { useQuery } from 'react-query';
// components
import BrandsFilter from './brands';
import GenderFilter from './gender';
import ColorsFilter from './colors';
import SizesFilter from './sizes';
import PriceRange from './price';
import Brands from 'src/components/_main/skeletons/products/filters/brands';
import Gender from 'src/components/_main/skeletons/products/filters/gander';
import Color from 'src/components/_main/skeletons/products/filters/colors';
import Sizes from 'src/components/_main/skeletons/products/filters/sizes';
import * as api from 'src/services';
Filter.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchFilters: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  category: PropTypes.object,
  subCategory: PropTypes.object
};

export default function Filter({ ...props }) {
  const { isMobile, onClose, pathname, fetchFilters, category, subCategory } = props;

  const router = useRouter();
  const { data, isLoading } = useQuery(['get-filters' + category || '' + 'subCategory'], () =>
    api[fetchFilters](category?.slug || '', subCategory?.slug || '')
  );
  const filters = data?.data;

  console.log('filters', filters);
  return (
    <Card
      sx={{
        width: !isMobile ? '100%' : '300px',
        ...(!isMobile
          ? { position: 'sticky', top: '81px', my: 2 }
          : { border: 'none !important', borderRadius: '0px !important' })
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Typography variant="h5" color="text.primary">
          Filter
        </Typography>
        <Tooltip title="Remove filters">
          <IconButton
            aria-label="remove-all"
            onClick={() => router.push(pathname)}
            sx={{ display: { md: 'flex', xs: 'none' } }}
          >
            <MdClear />
          </IconButton>
        </Tooltip>
        {isMobile && (
          <IconButton onClick={() => onClose()}>
            <MdClear />
          </IconButton>
        )}
      </Box>
      <Box
        sx={{
          ...(isMobile && { height: 'calc(100vh - 100px)', overflowY: 'auto' })
        }}
      >
        {isLoading ? (
          <Brands />
        ) : (
          Boolean(filters?.brands?.length) && (
            <Box p={2}>
              <BrandsFilter brands={filters?.brands} path={pathname} />
            </Box>
          )
        )}
        {/* {isLoading ? (
          <Gender />
        ) : (
          Boolean(filters?.genders?.length) && (
            <>
              <Divider />
              <Box p={2}>
                <GenderFilter genders={filters?.genders} path={pathname} />
              </Box>
            </>
          )
        )} */}
        {/* {isLoading ? (
          <Color />
        ) : (
          Boolean(filters?.colors?.length) && (
            <>
              <Divider />
              <Box p={2}>
                <ColorsFilter colors={filters?.colors} path={pathname} />
              </Box>
            </>
          )
        )} */}
        {/* {isLoading ? (
          <Sizes />
        ) : (
          Boolean(filters?.sizes?.length) && (
            <>
              <Divider />
              <Box p={2}>
                <SizesFilter sizes={filters?.sizes} path={pathname} />
              </Box>
            </>
          )
        )} */}
        <Divider />
        {Boolean(filters?.prices?.length) && (
          <Box p={2}>
            <PriceRange prices={filters?.prices} path={pathname} />
          </Box>
        )}
      </Box>
    </Card>
  );
}
