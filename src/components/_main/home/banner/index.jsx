'use client';
import React from 'react';
import Link from 'next/link';
// mui
import { alpha } from '@mui/material/styles';
import { Box, Typography, Grid, Button, Container, Stack } from '@mui/material';
// blur image
import Image from 'next/image';

export default function Banner() {
  return (
    <Box
      sx={{
        mt: 4,
        overflow: 'hidden',
        position: 'relative',
        display: { md: 'block', xs: 'none' },
        '&:before': {
          content: "''",
          position: 'absolute',
          bottom: '-40px',
          left: 100,
          bgcolor: (theme) => alpha(theme.palette.success.light, 0.77),
          height: 80,
          width: 80,
          borderRadius: '50px',
          zIndex: 0
        }
      }}
    >
      <Box
        key={Math.random()}
        sx={{
          mt: 3,
          border: (theme) => '1px solid' + theme.palette.divider,
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          py: 1,
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.2),
          '&:before': {
            content: "''",
            position: 'absolute',
            top: '-40px',
            left: '40%',
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.77),
            height: 100,
            width: 100,
            borderRadius: '50px',
            zIndex: 0
          }
        }}
      >
        <Container fixed>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={6} md={6}>
              <Stack spacing={2}>
                <Typography variant="h2" fontWeight={900}>
                  UK Premier Store for Wrist Watches
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome to our world of horological excellence, where timepieces become timeless statements of
                  elegance. Our collection showcases an unparalleled selection of premium watches, curated from renowned
                  luxury brands around the globe.
                </Typography>
                <Box>
                  <Button component={Link} href="/products" variant="contained" color="success" size="large">
                    View more
                  </Button>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={6} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 0,
                  '&:after': {
                    content: "''",
                    position: 'absolute',
                    top: 0,
                    transform: 'translateY(10%)',
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'block',
                    p: { md: '50%', xs: '50%' }
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    transform: 'translateY(2%)',
                    '&:after': {
                      content: "''",
                      display: 'block',
                      pb: { md: '80%', xs: '80%' }
                    }
                  }}
                >
                  <Image
                    src="/images/banner-3.png"
                    alt="centered-banner"
                    layout="fill"
                    objectFit="contain"
                    placeholder="blur"
                    blurDataURL="/images/banner-3.png"
                    // sizes="300px"
                    static
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
