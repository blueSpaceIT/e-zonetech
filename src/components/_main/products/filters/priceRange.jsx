import React from 'react';
// mui
import { Typography, Stack, Skeleton } from '@mui/material';
// next
import dynamic from 'next/dynamic';
// PropTypes;
import PropTypes from 'prop-types';

PriceRange.propTypes = {
  prices: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired
};

const Slider = dynamic(() => import('src/components/slider'), {
  loading: () => (
    <Stack>
      <Typography variant="body1" sx={{ mb: 1.2, width: 124 }}>
        <Skeleton variant="text" />
      </Typography>

      <Stack direction="row" gap={1} sx={{ my: '18.1px' }}>
        <Skeleton variant="rectangular" sx={{ borderRadius: '4px', minWidth: 24 }} width={294} height={27} />
      </Stack>
    </Stack>
  )
});
export default function PriceRange({ prices, path }) {
  return <Slider prices={prices} path={path} />;
}
