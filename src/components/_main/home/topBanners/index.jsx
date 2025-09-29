'use client';
import React from 'react';
import Link from 'next/link';
// mui
import { Box, Card, Grid, Stack, Typography, Button, Container } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, alpha } from '@mui/material/styles';
// next
import Image from 'next/image';

export default function Index() {
  const theme = useTheme();
  const isDeskTop = useMediaQuery(theme.breakpoints.up('xl'));
  const isDeskTopBtn = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <Box my={6}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} xs={12}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.dark, 0.4)
                    : alpha(theme.palette.primary.light, 0.4),

                borderRadius: 1,
                boxShadow: 'none',
                height: '100%',
                '&:after': {
                  content: "''",
                  position: 'absolute',
                  top: '-10px',
                  right: 0,
                  backgroundColor: theme.palette.primary.main,
                  height: { xs: 250, md: 250, xl: 340 },
                  width: { xs: 160, md: 220, xl: 340 },
                  borderTopLeftRadius: '50%',
                  borderBottomLeftRadius: '50%',
                  zIndex: '-1'
                }
              }}
            >
              <Stack spacing={isDeskTop ? 2 : 1.5} sx={{ p: { sm: '24px', xs: '12px' } }}>
                <Typography
                  variant={isDeskTop ? 'h3' : 'h4'}
                  color="text.primary"
                  lineHeight={1}
                  sx={{
                    fontSize: {
                      xl: 32,
                      lg: 24,
                      md: 24,
                      sm: 20,
                      xs: 12
                    }
                  }}
                >
                  Men Latest Fashion
                </Typography>
                <Typography
                  variant={isDeskTop ? 'subtitle1' : 'subtitle2'}
                  color="text.secondary"
                  lineHeight={1}
                  noWrap
                  sx={{
                    fontSize: {
                      lg: 18,
                      md: 16,
                      xs: 12
                    }
                  }}
                >
                  <Box
                    component="span"
                    fontWeight={700}
                    mr={0.5}
                    fontSize={16}
                    sx={{
                      color: 'primary.main',
                      fontSize: {
                        lg: 18,
                        md: 16,
                        xs: 12
                      }
                    }}
                  >
                    25%
                  </Box>
                  Off on first order
                </Typography>
                <Typography
                  variant={isDeskTop ? 'body1' : 'body2'}
                  color="text.secondary"
                  mb={2}
                  display={{ md: 'block', xs: 'none' }}
                  width={{ xl: 270 }}
                >
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href="/products?gender=women"
                    variant="contained"
                    color={'primary'}
                    size={isDeskTopBtn ? 'medium' : 'small'}
                  >
                    Shop Now
                  </Button>
                </Box>
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: 235, xl: 340 },
                  height: { xs: 151, md: 220, xl: 320 },
                  zIndex: 1
                }}
              >
                <Image
                  fill
                  objectFit="contain"
                  draggable="false"
                  src="/images/top-banners/men.png"
                  alt="women"
                  sizes="20vw"
                />
              </Box>
            </Card>
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.secondary.dark, 0.4)
                    : alpha(theme.palette.secondary.light, 0.4),
                borderRadius: 1,
                boxShadow: 'none',
                height: '100%',
                '&:after': {
                  content: "''",
                  position: 'absolute',
                  top: '-10px',
                  right: 0,
                  backgroundColor: theme.palette.secondary.main,
                  height: { xs: 250, md: 250, xl: 340 },
                  width: { xs: 160, md: 220, xl: 340 },
                  borderTopLeftRadius: '50%',
                  borderBottomLeftRadius: '50%',
                  zIndex: '-1'
                }
              }}
            >
              <Stack spacing={isDeskTop ? 2 : 1.5} sx={{ p: { sm: '24px', xs: '12px' } }}>
                <Typography
                  variant={isDeskTop ? 'h3' : 'h4'}
                  color="text.primary"
                  lineHeight={1}
                  noWrap
                  sx={{
                    fontSize: {
                      xl: 32,
                      lg: 24,
                      md: 24,
                      sm: 20,
                      xs: 12
                    }
                  }}
                >
                  Women Latest Fashion
                </Typography>
                <Typography
                  variant={isDeskTop ? 'subtitle1' : 'subtitle2'}
                  color="text.secondary"
                  lineHeight={1}
                  sx={{
                    fontSize: {
                      lg: 18,
                      md: 16,
                      xs: 12
                    }
                  }}
                >
                  <Box
                    component="span"
                    fontWeight={700}
                    mr={0.5}
                    fontSize={16}
                    sx={{
                      color: 'secondary.main',
                      fontSize: {
                        lg: 18,
                        md: 16,
                        xs: 12
                      }
                    }}
                  >
                    25%
                  </Box>
                  Off on first order
                </Typography>
                <Typography
                  variant={isDeskTop ? 'body1' : 'body2'}
                  color="text.secondary"
                  mb={2}
                  display={{ md: 'block', xs: 'none' }}
                >
                  Lorem Ipsum is simply dummy text of the <br />
                  printing and typesetting industry
                </Typography>
                <Box>
                  <Button
                    component={Link}
                    href="/products?gender=men"
                    variant="contained"
                    color={'secondary'}
                    size={isDeskTopBtn ? 'medium' : 'small'}
                  >
                    Shop Now
                  </Button>
                </Box>
              </Stack>
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: 150, md: 215, xl: 300 },
                  height: { xs: 150, md: 220, xl: 320 },
                  zIndex: 1
                }}
              >
                <Image
                  fill
                  objectFit="cover"
                  src="/images/top-banners/banner-2.png"
                  alt="women"
                  sizes="20vw"
                  draggable="false"
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
