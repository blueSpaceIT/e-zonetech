'use client';
import React from 'react';
import ProductForm from 'src/components/forms/product';
import PropTypes from 'prop-types';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';
EditProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired
};

export default function EditProduct({ brands, categories, slug }) {
  const { data, isLoading } = useQuery(['coupon-codes'], () => api.getProductBySlug(slug), {
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong!');
    }
  });
  return (
    <div>
      <ProductForm brands={brands} categories={categories} currentProduct={data?.data} isLoading={isLoading} />
    </div>
  );
}
