'use client';
import React from 'react';
// mui
import { Toolbar, Typography, Stack, useTheme } from '@mui/material';
import { LiaShippingFastSolid } from 'react-icons/lia';

export default function UserTopbar() {
  const theme = useTheme();
  return (
    <Toolbar
      sx={{
        minHeight: `48px !important`,
        background: theme.palette.mode === 'dark' ? 'background.paper' : '#000',
        color: 'common.white',
        justifyContent: 'center',
        display: { xs: 'none', md: 'flex' }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
        <LiaShippingFastSolid size={24} />
        <Typography variant="subtitle1" textAlign="center">
          Free shipping and Returns on orders of $50+
        </Typography>
      </Stack>
    </Toolbar>
  );
}
