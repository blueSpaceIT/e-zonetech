'use client';
import React from 'react';
import Tabs from './tabs';
import PropTypes from 'prop-types';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';

TabsIndex.propTypes = {
  product: PropTypes.object.isRequired,
  totalRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired
};

export default async function TabsIndex({ product, totalRating, totalReviews }) {
  const { data, isLoading } = useQuery(['brands'], () => api.getProductReviews(product._id));

  return (
    <Tabs
      isLoading={isLoading}
      reviews={data?.reviews}
      reviewsSummery={data?.reviewsSummery}
      product={product}
      totalRating={totalRating}
      totalReviews={totalReviews}
    />
  );
}
