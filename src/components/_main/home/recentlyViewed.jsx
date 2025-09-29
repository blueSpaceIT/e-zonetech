'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const CARD_SIZE = 88;

export default function RecentlyViewed() {
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recentlyViewed');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      // normalize and dedupe (keep newest first), preserve slug/title if present
      const byId = new Map();
      for (let i = parsed.length - 1; i >= 0; i--) {
        const p = parsed[i] || {};
        const id = p._id || p.id || p.productId || null;
        const image = p.image || p.url || (p.images && p.images[0] && p.images[0].url) || p.img || null;
        const slug = p.slug || null;
        const title = p.title || p.name || null;
        if (!id) continue;
        if (!byId.has(id)) {
          byId.set(id, { id, image, slug, title });
        }
      }

      const list = Array.from(byId.values()).slice(0, 100); // limit to 10
      setItems(list);
    } catch (err) {
      // ignore
      console.error('Failed to read recentlyViewed from localStorage', err);
    }
  }, []);

  if (!items || items.length === 0) return null;

  const scroll = (dir = 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const amount = dir === 'right' ? CARD_SIZE * 2 : -CARD_SIZE * 2;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <Box sx={{
        bgcolor: '#F7F7FA',
        py: 2,
        mb: -6,
    }}>
    <Box sx={{ my: 1, maxWidth: '1480px',
        mx: 'auto', }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6">Recently Viewed Items</Typography>
        {/* optional see more could go here */}
      </Stack>

      <Box sx={{ position: 'relative' }}>
        <IconButton
          size="small"
          onClick={() => scroll('left')}
          sx={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'background.paper', boxShadow: 1 }}
          aria-label="scroll-left"
        >
          <ChevronLeftIcon />
        </IconButton>

        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            px: 4,
            py: 1,
            '&::-webkit-scrollbar': { display: 'none' }
          }}
        >
          {items.map((it) => (
            <Box key={it.id} sx={{ minWidth: CARD_SIZE }}>
              <NextLink href={it.slug ? `/product/${it.slug}` : `/product/${it.id}`} passHref legacyBehavior>
                <a style={{ textDecoration: 'none' }}>
                  <Box
                    sx={{
                      height: CARD_SIZE,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 1,
                      p: 1
                    }}
                  >
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.title || 'recent'} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Box sx={{ width: 24, height: 24, bgcolor: 'grey.200', borderRadius: 0.5 }} />
                    )}
                  </Box>
                </a>
              </NextLink>
            </Box>
          ))}
        </Box>

        <IconButton
          size="small"
          onClick={() => scroll('right')}
          sx={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', zIndex: 2, bgcolor: 'background.paper', boxShadow: 1 }}
          aria-label="scroll-right"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
    </Box>
  );
}
