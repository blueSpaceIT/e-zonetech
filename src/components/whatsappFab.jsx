"use client";
import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { IoLogoWhatsapp } from 'react-icons/io5';

export default function WhatsappFab() {
  // use NEXT_PUBLIC_WHATSAPP_NUMBER to configure the target number (international format, no + or leading zeros)
  const href = `https://wa.me/971502424117`;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 68, md: 24 },
        right: { xs: 16, md: 24 },
        zIndex: (theme) => theme.zIndex.tooltip + 1,
        display: { xs: 'flex', md: 'none' }
      }}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <Fab
          aria-label="whatsapp"
          sx={{
            backgroundColor: '#25D366',
            '&:hover': { backgroundColor: '#20b859' },
            width: 56,
            height: 56,
            boxShadow: '0 6px 14px rgba(37,211,102,0.24)'
          }}
        >
          <IoLogoWhatsapp size={22} color="#fff" />
        </Fab>
      </Link>
    </Box>
  );
}
