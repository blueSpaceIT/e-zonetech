'use client';
// react
import React, { useRef, useState, useEffect } from 'react';
// mui
import { Typography, Grid, Box, Stack, Paper, IconButton } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// component
import CategoryCard from 'src/components/cards/category';

export default function Categories() {
  const { data, isLoading } = useQuery(['get-home-categories-all'], () => api.homeCategroies());
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollWidth > el.clientWidth + el.scrollLeft + 1);
    };
    update();
    el.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [data, isLoading]);

  const scrollByAmount = (amount) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handlePrev = () => scrollByAmount(-120);
  const handleNext = () => scrollByAmount(120);

  return (
    <Paper elevation={0} sx={{
      maxWidth: '1480px',
      mx: 'auto',
      px: { xs: 0, md: 0 }
    }}>
      <Stack
        direction={'column'}
        sx={{
          gap: { xs: 2, md: 3 },
          mt: { xs: 3, md: 5 }
        }}
      >
        <Box sx={{
          display: 'flex',
          gap: { xs: 2, md: 3 },
          alignItems: 'center',
        }}>
          <Typography 
            variant="h3" 
            color="text.primary" 
            textAlign="left"
            sx={{
              fontSize: { xs: '20px', md: '24px' }
            }}
          >
            SHOP BY CATEGORIES
          </Typography>
          <Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                size="small"
                aria-label="previous categories"
                onClick={handlePrev}
                disabled={!canScrollLeft}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '10px',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                {/* Left arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconButton>

              <IconButton
                size="small"
                aria-label="next categories"
                onClick={handleNext}
                disabled={!canScrollRight}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '10px',
                  boxShadow: 1,
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                {/* Right arrow */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconButton>
            </Stack>
          </Box>
        </Box>
        <Box>
          {/* Mobile: Horizontal Scroll */}
          <Box sx={{ display: "block" }}>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 2,
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none'
              }}
              ref={scrollRef}
            >
              {(isLoading ? Array.from(new Array(6)) : data?.data).map((inner) => (
                <Box key={Math.random()} sx={{ minWidth: 80, flexShrink: 0 }}>
                  <CategoryCard category={inner} isLoading={isLoading} />
                </Box>
              ))}
            </Box>
          </Box>

          {!isLoading && !Boolean(data?.data.length) && (
            <Typography variant="h3" color="error.main" textAlign="center">
              Categories not found
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
