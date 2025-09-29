'use client';
// react
import { useQuery } from 'react-query';
import React from 'react';
// mui
import { useMediaQuery } from '@mui/material';
// next
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
import PropTypes from 'prop-types';
import ProductList from './productList';
import SortBar from './sortbar';

ProductListing.propTypes = {
  category: PropTypes.object,
  fetchFilters: PropTypes.string.isRequired,
  subCategory: PropTypes.object
};
// components
const Pagination = dynamic(() => import('src/components/pagination'));

const sortData = [
  { title: 'Top Rated', key: 'top', value: -1 },
  { title: 'Asceding', key: 'name', value: 1 },
  { title: 'Desceding', key: 'name', value: -1 },
  { title: 'Price low to high', key: 'price', value: 1 },
  { title: 'Price high to low', key: 'price', value: -1 },
  { title: 'Oldest', key: 'date', value: 1 },
  { title: 'Newest', key: 'date', value: -1 }
];
const getSearchParams = (searchParams, category, subCategory) => {
  if (category) {
    return searchParams.toString().length
      ? '?' + searchParams.toString() + `&category=${category.slug}`
      : `?category=${category.slug}`;
  }
  if (subCategory) {
    return searchParams.toString().length
      ? '?' + searchParams.toString() + `&subCategory=${subCategory.slug}`
      : `?subCategory=${subCategory.slug}`;
  } else {
    return searchParams.toString().length ? '?' + searchParams.toString() : '';
  }
};
export default function ProductListing({ category, subCategory, fetchFilters }) {
  const searchParams = useSearchParams();
  const { data, isLoading } = useQuery(
    ['products' + category || subCategory ? '-with-category' : '', searchParams.toString(), category, subCategory],
    () => api.getProducts(getSearchParams(searchParams, category, subCategory))
  );

  const isMobile = useMediaQuery('(max-width:900px)');
  return (
    <>
      <SortBar
        sortData={sortData}
        productData={data}
        category={subCategory?.parentCategory || category}
        subCategory={subCategory}
        fetchFilters={fetchFilters}
        isLoading={isLoading}
      />
      <ProductList data={data} isLoading={isLoading} isMobile={isMobile} />
      <Pagination data={data} />
    </>
  );
}
