'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// next
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
// mui
import { alpha } from '@mui/material/styles';
import { Toolbar, Skeleton, Stack, AppBar, useMediaQuery, Box, Typography, Link, IconButton } from '@mui/material';
import { Chat, ChatOutlined, KeyboardArrowDown } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import CheckIcon from '@mui/icons-material/Check';
// redux
import { useSelector } from 'react-redux';
// local
import LanguageSelect from 'src/components/select/languageSelect';

// config
import config from 'src/components/layout/_main/config.json';
import MainLogo from 'src/components/mainLogo';
import * as api from 'src/services';
// usequery
import { useQuery } from 'react-query';
const MobileBar = dynamic(() => import('src/components/layout/_main/mobileBar'));

// dynamic import components
const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const WishlistPopover = dynamic(() => import('src/components/popover/wislist'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const CartWidget = dynamic(() => import('src/components/cartWidget'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});

const Search = dynamic(() => import('./searchBar'), {
  ssr: false,
  loading: () => <Skeleton variant="rectangular" width="100%" height={48} />
});
const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={50} height={50} />
});
const AdminDialog = dynamic(() => import('src/components/dialog/admin'));
const Skeletons = () => {
  return (
    <Stack direction="row" gap={2}>
      <Skeleton variant="rounded" width={38.3} height={22} />
      <Skeleton variant="rounded" width={89} height={22} />
      <Skeleton variant="rounded" width={56} height={22} />
      <Skeleton variant="rounded" width={27.4} height={22} />
      <Skeleton variant="rounded" width={48.6} height={22} />
      <Skeleton variant="rounded" width={26.8} height={22} />
    </Stack>
  );
};
const MenuDesktop = dynamic(() => import('./menuDesktop'), {
  ssr: false,
  loading: () => <Skeletons />
});

// ----------------------------------------------------------------------

// Topbar Component
const TopBar = () => {
  const topbarServices = [
    { 
      label: 'Deliver to Dubai', 
      href: '#',
      icon: null // No icon for this one, just emoji
    },
    { 
      label: 'Cash on Delivery', 
      href: '#',
      icon: '/images/cash-on-delivery-icon.svg'
    },
    { 
      label: 'Express Delivery', 
      href: '#',
      icon: '/images/express-delivery-icon.svg'
    },
    { 
      label: 'Free Returns', 
      href: '/free-return',
      icon: '/images/free-returns-icon.svg'
    },
    { 
      label: 'Our Location', 
      href: '/our-location',
      icon: '/images/location-icon.svg'
    }
  ];

  // selected city state (persisted in localStorage)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [selectedCity, setSelectedCity] = React.useState(() => {
    try {
      const saved = typeof window !== 'undefined' && localStorage.getItem('selectedCity');
      return saved ? JSON.parse(saved) : { id: null, name: 'Dubai', deliveryTime: 1 };
    } catch (e) {
      return { id: null, name: 'Dubai', deliveryTime: 1 };
    }
  });

  // fetch cities from public API
  const { data: citiesResp, isLoading: citiesLoading } = useQuery(['delivery-cities-public'], () => api.getDeliveryCitiesPublic ? api.getDeliveryCitiesPublic() : api.getDeliveryCities(), {
    retry: 1
  });

  const cities = citiesResp?.data || [];

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (city) => {
    const payload = { id: city._id, name: city.name, deliveryTime: city.deliveryTime };
    setSelectedCity(payload);
    try {
      localStorage.setItem('selectedCity', JSON.stringify(payload));
      // notify other listeners in same window (storage event doesn't fire in same window)
      try {
        window.dispatchEvent(new CustomEvent('selectedCityChanged', { detail: payload }));
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore
    }
    handleClose();
  };

  return (
    <Box
      sx={{
        bgcolor: '#010101',
        color: 'white',
        py: 0.75,
        fontSize: '12px',
        display: { xs: 'none', md: 'block' }
      }}
    >
      <Box
        sx={{
          maxWidth: '1480px',
          mx: 'auto',
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Left side - Service links */}
        <Stack direction="row" spacing={2.5} alignItems="center">
          {/* Deliver to - interactive dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              onClick={handleOpen}
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            >
              <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                Deliver to {selectedCity?.name || 'Dubai'}
              </Typography>
              <KeyboardArrowDown sx={{ color: 'white', fontSize: 16 }} />
            </Box>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { p: 2, minWidth: 320 } }}>
              {citiesLoading ? (
                <Typography sx={{ p: 2 }}>Loading...</Typography>
              ) : cities.length === 0 ? (
                <Typography sx={{ p: 2 }}>No cities found</Typography>
              ) : (
                <Grid container spacing={1}>
                  {(() => {
                    const half = Math.ceil(cities.length / 2);
                    const col1 = cities.slice(0, half);
                    const col2 = cities.slice(half);
                    return (
                      <>
                        <Grid item xs={6}>
                          {col1.map((c) => (
                            <MenuItem key={c._id} onClick={() => handleSelect(c)} sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box>{c.name}</Box>
                              {selectedCity?.id === c._id && (
                                <Box sx={{ ml: 'auto', color: 'primary.main' }}>
                                  <CheckIcon fontSize="small" />
                                </Box>
                              )}
                            </MenuItem>
                          ))}
                        </Grid>
                        <Grid item xs={6}>
                          {col2.map((c) => (
                            <MenuItem key={c._id} onClick={() => handleSelect(c)} sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box>{c.name}</Box>
                              {selectedCity?.id === c._id && (
                                <Box sx={{ ml: 'auto', color: 'primary.main' }}>
                                  <CheckIcon fontSize="small" />
                                </Box>
                              )}
                            </MenuItem>
                          ))}
                        </Grid>
                      </>
                    );
                  })()}
                </Grid>
              )}
            </Menu>
          </Box>

          {/* Other static topbar services */}
          {topbarServices.slice(1).map((service, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {service.icon && (
                <Image
                  src={service.icon}
                  alt=""
                  width={10}
                  height={10}
                  style={{ filter: 'brightness(0) invert(1)' }} // Make SVG white
                />
              )}
              <Link
                href={service.href}
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '10px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  '&:hover': {
                    color: '#ccc'
                  }
                }}
              >
                {service.label}
              </Link>
            </Box>
          ))}
        </Stack>

        {/* Right side - Currency and Language selectors */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 0.5 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'white', 
                fontSize: '12px',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              AED
            </Typography>
            <Image
              src="/images/dropdown-arrow-icon.svg"
              alt=""
              width={10}
              height={5}
              style={{ 
                filter: 'brightness(0) invert(1)',
                transform: 'rotate(180deg)'
              }}
            />
          </Box>
          {/* Language selector (auto-translate) */}
          <Box>
            {/* lazy client component loaded via default import */}
            {/* existing project convention uses dynamic imports for some components, but this small client component can be imported directly */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <LanguageSelect />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default function Navbar({ isAuth }) {
  const { menu } = config;
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { checkout } = useSelector(({ product }) => product);
  const isMobile = useMediaQuery('(max-width:768px)');

  const { data, isLoading } = useQuery(['get-categories-all'], () => api.getAllCategories());

  return (
    <>
      {/* Desktop Top Bar - hidden on mobile */}
      {!isMobile && <TopBar />}
      
      {/* Main Navigation Bar */}
      <Box
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
        }}
      >
        <AppBar
          sx={{
            maxWidth: isMobile ? '100%' : '1480px',
            mx: 'auto',
            boxShadow: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            borderRadius: 0,
            pr: '0px !important',
            bgcolor: (theme) => alpha(theme.palette.background.default, 1),
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            '& .toolbar': {
              justifyContent: 'space-between',
              backdropFilter: 'blur(6px)',
              borderRadius: 0,
              WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
              bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
              px: isMobile ? 2 : 3,
              py: isMobile ? 1 : 1.5
            }
          }}
        >
          <Toolbar disableGutters className="toolbar">
            {/* Logo */}
            <Stack width={isMobile ? 90 : 140} sx={{ mr: isMobile ? 4 : 0, ml: isMobile ? '-12px' : '-18px' }}>
              <MainLogo />
            </Stack>

            {/* Centered Search Bar */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: isMobile ? 'center' : 'left', px: isMobile ? 0 : 4 }}>
              <Box 
                sx={{ 
                  width: '100%',
                  maxWidth: isMobile ? '100%' : 900,
                  position: 'relative'
                }}
              >
                <Search />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Stack gap={isMobile ? 1 : 2} direction="row" alignItems={'center'}>
              {/* Mobile: Only show Wishlist */}
              {isMobile ? (
                <WishlistPopover isAuth={isAuth} />
              ) : (
                /* Desktop: Show all buttons */
                <>
                  {/* Chat Now Button */}
                  <Link
                    href="https://wa.me/971502424117"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'text.primary',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ChatOutlined />
                      Chat Now
                    </div>
                  </Link>

                  <WishlistPopover isAuth={isAuth} />
                  
                  {/* Sign In/User */}
                  <UserSelect />

                  <CartWidget checkout={checkout} />
                  
                  {/* <SettingMode /> */}
                </>
              )}
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Categories Navigation Bar - Desktop only */}
      {!isMobile && (
        <Box
          sx={{
            bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            py: 0
          }}
        >
          <Box
            sx={{
              maxWidth: '1480px',
              mx: 'auto',
              px: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {isLoading ? <Skeletons /> : <MenuDesktop isHome={isHome} navConfig={menu} categories={data?.data} />}
          </Box>
        </Box>
      )}

      {isMobile && <MobileBar />}
      {data?.adminPopup && <AdminDialog isOpen={data?.adminPopup} />}
    </>
  );
}
Navbar.propTypes = {
  isAuth: PropTypes.bool.isRequired
};
