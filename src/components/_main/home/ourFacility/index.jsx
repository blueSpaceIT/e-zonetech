import React from 'react';
import { Grid, Typography, Box, Container } from '@mui/material';
import Image from 'next/image';

const facilityFeatures = [
  {
    icon: '/images/facility/payment-icon.svg',
    title: 'Versatile Payment Method',
    description: 'Pay online OR cash on delivery.'
  },
  {
    icon: '/images/facility/returns-icon.svg',
    title: '7-Day Returns',
    description: 'You can get it back in 7 days!'
  },
  {
    icon: '/images/facility/checkout-icon.svg',
    title: 'Safe Checkout',
    description: "Don't worry, your payment's totally safe with us!"
  },
  {
    icon: '/images/facility/support-icon.svg',
    title: '24/7 Support',
    description: "We're always here for you, day or night!"
  },
  {
    icon: '/images/facility/offers-icon.svg',
    title: 'Coupons & offers alerts',
    description: 'Get our alerts sent right to you!'
  }
];

const OurFacility = () => {
  return (
  <Container maxWidth="xl" sx={{ pt: { xs: 2, md: 3 }, pb: { xs: 2, md: 2 }, px: { xs: 2, md: 3, lg: 6 }, backgroundColor: '#F7F7FA' }}>
      <Grid container spacing={{ xs: 4, md: 8 }} justifyContent="center" alignItems="stretch">
        {facilityFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 2,
                minWidth: 0, // allow children to shrink and wrap correctly
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #e0e0e0',
                  borderRadius: '50%',
                  backgroundColor: '#fff'
                }}
              >
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={28}
                  height={28}
                  style={{ objectFit: 'contain' }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 150, minHeight: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: '12px !important',
                    color: '#000',
                    mb: 0.5,
                    lineHeight: 1.2,
                    // allow wrapping so long texts are fully visible when there's space
                    whiteSpace: 'normal'
                  }}
                >
                  {feature.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    fontSize: '12px',
                    lineHeight: 1.3,
                    // allow wrapping so description is fully visible
                    whiteSpace: 'normal'
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OurFacility;