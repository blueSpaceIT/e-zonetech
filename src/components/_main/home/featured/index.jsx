// react
import React from 'react';
// mui
import { Typography, Box } from '@mui/material';
// components
import ProductsCarousel from 'src/components/carousels/products';
import PropTypes from 'prop-types';

Featured.propTypes = {
  data: PropTypes.any
};
export default async function Featured({ data: products }) {
  const data = await products.then((res) => res.json());
  return (
    <Box>
      <Typography variant="h2" color="text.primary" textAlign="center" mt={8}>
        Featured Products
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" mb={5}>
        Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
      </Typography>
      <ProductsCarousel data={data?.data} />
    </Box>
  );
}
