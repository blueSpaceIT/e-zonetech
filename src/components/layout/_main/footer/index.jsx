'use client';
// react
import React from 'react';

// mui
import { alpha } from '@mui/material/styles';
import { Typography, Container, Stack, Box, IconButton, Grid, Link } from '@mui/material';
// next
import NextLink from 'next/link';
import Image from 'next/image';
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import MainLogo from 'src/components/mainLogo';

// icons
import { IoLogoInstagram } from 'react-icons/io5';
import { FaFacebook, FaLinkedin, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';

const SOCIAL_MEDIA_LINK = [
  {
    name: 'facebook',
    linkPath: 'https://www.facebook.com/ezonetech',
    icon: <FaFacebook />
  },
  {
    name: 'twitter',
    linkPath: 'https://x.com/EZoneTechLLC',
    icon: <FaTwitter />
  },
  {
    name: 'instagram',
    linkPath: 'https://www.instagram.com/ezonetechonline/',
    icon: <IoLogoInstagram />
  },
  {
    name: 'youtube',
    linkPath: 'https://www.youtube.com/@ezonetechnologies',
    icon: <FaYoutube />
  },
  {
    name: 'tiktok',
    linkPath: 'https://www.tiktok.com/@ezonestore247',
    icon: <FaTiktok />
  }
];

const FOOTER_LINKS = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Shipping & Returns', href: '/shipping-returns' },
    { label: 'Warranty Policy', href: '/warranty-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms and Conditions', href: '/terms-and-conditions' },
    { label: 'Contact Us', href: '/contact' }
  ],
  sellWithUs: [
    { label: 'Hard To Find Parts', href: '/hard-to-find' },
    { label: 'Gift Wrapping Service', href: '/gift-wrapping' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Advertise with us', href: '/advertise' },
    { label: 'Partner with us', href: '/partner' }
  ],
  resources: [
    { label: 'About Us', href: '/about' },
    { label: 'Become a Seller', href: '/become-seller' },
    { label: 'Register as Seller', href: '/register-seller' },
    { label: 'Pricing & Fees', href: '/pricing' },
    { label: 'Buyer Protection', href: '/buyer-protection' },
    { label: 'Warranty & Return', href: '/warranty' }
  ],
  customerService: [
    { label: 'Payment Options', href: '/payment-options' },
    { label: 'Warranty & Return', href: '/warranty-return' },
    { label: 'Shipping & Delivery', href: '/shipping' },
    { label: 'Delivery Information', href: '/delivery-info' }
  ]
};

export default function Footer() {
  // Fetch categories for the Popular Categories section and show the last 6
  const { data: categoriesData } = useQuery(
    ['footer-categories'],
    () => api.getUserCategories(),
    { staleTime: 1000 * 60 * 5 }
  );

  const categories = categoriesData?.data || [];
  const lastSix = categories.length ? categories.slice(-6) : [];
  const linksToRender = lastSix.length
    ? lastSix.map((c) => ({ label: c.name, href: `/products/${c.slug}` }))
    : FOOTER_LINKS.quickLinks;
  return (
    <Box
      sx={{
        bgcolor: '#f8f9fa',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        py: {xs: 10, md: 6},
        display: {
          md: 'block',
          xs: 'block'
        },
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <MainLogo />
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mb: 3, lineHeight: 1.6 }}
            >
              E Zone Technologies LLC is a leading IT trading company based in Dubai, United Arab Emirates. Since its establishment in 2013, the company has been dedicated to providing cutting-edge technology solutions and services to businesses and individuals across the region.
            </Typography>
            
            {/* Download App */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Download our App
            </Typography>
            <Stack direction="row" spacing={1}>
              <Box
                component="img"
                src="/images/app-store-badge.svg"
                alt="Download on App Store"
                sx={{ 
                  height: 40,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              />
              <Box
                component="img"
                src="/images/google-play-badge.svg"
                alt="Get it on Google Play"
                sx={{ 
                  height: 40,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              />
            </Stack>
          </Grid>

          {/* Our Address */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Our Address
            </Typography>
            <Stack spacing={1}>
              <Typography variant="h4" color="text.secondary">
                DUBAI
                </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Shop No: 2, Belghuzooz Al Raffa Building,
                Bur Dubai, Dubai, UAE.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tel:  +9714 345 1530
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mobile:  +97150 24 24 117
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email:  sales@e-zonetech.com
                </Typography>
            </Stack>
          </Grid>

          {/* Popular Categories */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Popular Categories
            </Typography>
            <Stack spacing={1}>
              {linksToRender.map((link, index) => (
                <Link
                  key={index}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {FOOTER_LINKS.quickLinks.map((link, index) => (
                <Link
                  key={index}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Resources */}
          {/* <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Resources
            </Typography>
            <Stack spacing={1}>
              {FOOTER_LINKS.resources.map((link, index) => (
                <Link
                  key={index}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid> */}

          {/* Customer Service */}
          {/* <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Customer Service
            </Typography>
            <Stack spacing={1}>
              {FOOTER_LINKS.customerService.map((link, index) => (
                <Link
                  key={index}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontSize: '14px',
                    '&:hover': {
                      color: 'primary.main'
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Stack>
          </Grid> */}
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          {/* Copyright */}
          <Typography variant="body2" color="text.secondary">
            E Zone Technologies L.L.C  2025 All rights reserved.
          </Typography>

          {/* Payment Methods */}
          <Box sx={{ display: {xs: 'none', md: 'flex'}, alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              Payment Method
            </Typography>
            <Image
              src="/images/payment_methods.png"
              alt="Payment Methods"
              width={320}
              height={24}
            />
          </Box>

          {/* Social Media */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              Social Media
            </Typography> */}
            <Stack direction="row" spacing={1}>
              {SOCIAL_MEDIA_LINK.map((item, index) => (
                <IconButton
                  key={index}
                  component={NextLink}
                  href={item.linkPath}
                  target="_blank"
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    bgcolor: '#fff',
                    border: '1px solid #e0e0e0',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: '#f5f5f5'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
