"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import Image from 'next/image';

const LanguageSelect = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const stored = typeof window !== 'undefined' ? localStorage.getItem('site_lang') : null;
  const [lang, setLang] = useState(stored || 'en');

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en-US';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    if (lang === 'ar') loadGoogleTranslate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const setGoogleCookie = (value) => {
    try {
      document.cookie = 'googtrans=' + value + '; path=/';
      document.cookie = 'googtrans=' + value + '; path=/; domain=' + window.location.hostname + ';';
    } catch (e) {
      // ignore
    }
  };

  const loadGoogleTranslate = () => {
    if (typeof window === 'undefined') return;
    if (window.google && window.google.translate) return;

    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    window.googleTranslateElementInit = function () {
      try {
        if (!window.google || !window.google.translate) return;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'ar',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google_translate_element'
        );
      } catch (e) {}
    };

    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  };

  const applyLanguage = (selected) => {
    setLang(selected);
    try { localStorage.setItem('site_lang', selected); } catch (e) {}

    if (selected === 'ar') {
      setGoogleCookie('/en/ar');
      loadGoogleTranslate();
      document.documentElement.lang = 'ar';
      document.documentElement.dir = 'rtl';
    } else {
      setGoogleCookie('/en/en');
      document.documentElement.lang = 'en-US';
      document.documentElement.dir = 'ltr';
      try { window.location.reload(); } catch (e) {}
    }

    handleClose();
  };

  return (
    <>
      <Box onClick={handleOpen} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 0.5 }}>
        <Typography variant="caption" sx={{ color: 'white', fontSize: '12px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
          {lang === 'ar' ? 'العربية' : 'English'}
        </Typography>
        <Image src="/images/dropdown-arrow-icon.svg" alt="" width={10} height={5} style={{ filter: 'brightness(0) invert(1)', transform: 'rotate(180deg)' }} />
      </Box>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => applyLanguage('en')}>English</MenuItem>
        <MenuItem onClick={() => applyLanguage('ar')}>العربية</MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelect;
