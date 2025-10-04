'use client';
// react
import React, { useMemo } from 'react';
// mui
import { Box, Grid, Stack, Typography } from '@mui/material';
// api
import { useQuery } from 'react-query';
import * as api from 'src/services';
// components
import Link from 'next/link';
import OurFacility from 'src/components/_main/home/ourFacility';
import ProductCard from 'src/components/cards/product';
import ProductsCarousel from 'src/components/carousels/products';

const CategorySection = ({ category, slidesToShowProp = undefined, largeCard = false }) => {
  const { data: productsData, isLoading } = useQuery(
    ['category-products', category.slug],
    () => api.getProducts(`?category=${category.slug}&limit=12`),
    {
      enabled: !!category.slug
    }
  );

  const products = productsData?.data || [];

  return (
    <Box>
      <Typography
        variant="h3"
        color="text.primary"
        textAlign="left"
        mb={{ xs: 2, md: 3 }}
        sx={{
          textTransform: 'uppercase',
          fontSize: { xs: '20px', md: '24px' },
          px: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        {category.name}{' '}
        <span style={{ fontSize: '14px', fontWeight: '200' }}>
          <Link style={{ color: '#000' }} href={`/products/${category.slug}`}>
            See more
          </Link>
        </span>
      </Typography>

      {!isLoading && !Boolean(products.length) ? (
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No products found in this category
        </Typography>
      ) : slidesToShowProp === 2 && largeCard ? (
        // Render two large ProductCards side-by-side to avoid carousel clipping
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {products.slice(0, 2).map((p) => (
            <Box key={p?._id || Math.random()} sx={{ '& .MuiCard-root': { height: '100%' } }}>
              <ProductCard product={p} loading={isLoading} />
            </Box>
          ))}
        </Box>
      ) : (
        <ProductsCarousel
          data={products}
          isLoading={isLoading}
          slidesToShowProp={slidesToShowProp}
          largeCard={largeCard}
        />
      )}
    </Box>
  );
};

const ProductShowCase = () => {
  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery(['get-categories'], () =>
    api.getUserCategories()
  );

  // Fetch public mid banners
  const { data: midData } = useQuery(['public-mid-banners'], () => api.getPublicMidBanners());
  // Fetch public side banners
  const { data: sideData } = useQuery(['public-side-banners'], () => api.getPublicSideBanners());
  // Fetch banner four (8-item grid)
  const { data: bannerFourData } = useQuery(['public-banner-four'], () => api.getPublicBannerFour());

  // Get all categories
  const categories = categoriesData?.data || [];

  const firstMidBanner = midData?.data && midData.data.length ? midData.data[0] : null;

  // Insert mid banner after 2 rows (deterministic)
  const insertAfter = useMemo(() => 2, []);

  // Place side banner on the 6th row (index 5). If fewer than 6 categories, fallback to the last index.
  const sideBannerIndex = useMemo(() => {
    if (!categories.length) return -1;
    return Math.min(5, categories.length - 1);
  }, [categories.length]);

  const firstSideBanner = sideData?.data && sideData.data.length ? sideData.data[0] : null;
  const bannerFour = bannerFourData?.data || [];
  const bannerFourSlice = bannerFour.slice(0, 8);

  // Insert banner-four after 15 rows (or bottom if fewer categories)
  const insertAfterFour = useMemo(() => 15, []);

  // Fetch banner five (4-item section)
  const { data: bannerFiveData } = useQuery(['public-banner-five'], () => api.getPublicBannerFive());
  const bannerFive = bannerFiveData?.data || [];
  const bannerFiveSlice = bannerFive.slice(0, 4);

  // Insert banner-five after 20 rows (or bottom if fewer categories)
  const insertAfterFive = useMemo(() => 20, []);

  // Fetch banner six (2-item section)
  const { data: bannerSixData } = useQuery(['public-banner-six'], () => api.getPublicBannerSix());
  const bannerSix = bannerSixData?.data || [];
  const bannerSixSlice = bannerSix.slice(0, 2);

  // Insert banner-six after 21 rows (or bottom if fewer categories)
  const insertAfterSix = useMemo(() => 21, []);

  // Fetch banner seven (4-item section, square grid like banner five)
  const { data: bannerSevenData } = useQuery(['public-banner-seven'], () => api.getPublicBannerSeven());
  const bannerSeven = bannerSevenData?.data || [];
  const bannerSevenSlice = bannerSeven.slice(0, 4);

  // Insert banner-seven after 22 rows (or bottom if fewer categories)
  const insertAfterSeven = useMemo(() => 22, []);

  if (categoriesLoading) {
    return (
      <Box sx={{ maxWidth: '1480px', mx: 'auto', py: 4 }}>
        <Typography variant="h6" textAlign="center">
          Loading categories...
        </Typography>
      </Box>
    );
  }

  if (!categories.length) {
    return (
      <Box sx={{ maxWidth: '1480px', mx: 'auto', py: 4 }}>
        <Typography variant="h6" color="text.secondary" textAlign="center">
          No categories found
        </Typography>
      </Box>
    );
  }

  // Helper to render the Banner Four 4-column grid (up to 8 items)
  const renderBannerFourGrid = () => (
    <Box sx={{ width: '100%', px: { xs: 0, md: 0 } }}>
      <Typography
        variant="h3"
        color="text.primary"
        textAlign="left"
        mb={{ xs: 2, md: 3 }}
        sx={{
          textTransform: 'capitalize',
          fontSize: { xs: '20px', md: '24px' },
          px: 0
        }}
      >
        Gaming
      </Typography>
      <Grid container spacing={2}>
        {bannerFourSlice.map((b) => (
          <Grid item key={b._id || b.image} xs={6} sm={6} md={3}>
            <Box
              component="a"
              href={b.url || '#'}
              sx={{
                display: 'block',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                '&:hover .overlay': { opacity: 1 }
              }}
            >
              {/* square container: padding-bottom 100% maintains 1:1 aspect ratio */}
              <Box sx={{ width: '100%', pb: '100%', position: 'relative' }}>
                <img
                  src={b.image}
                  alt={b.url || 'banner four'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    opacity: 0,
                    transition: 'opacity 200ms ease'
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Helper to render the Banner Five 4-column grid (exactly up to 4 items)

  const renderBannerFiveGrid = () => (
    <Box sx={{ width: '100%', px: { xs: 0, md: 0 }, mb: 0 }}>
      <Typography
        variant="h3"
        color="text.primary"
        textAlign="left"
        mb={{ xs: 2, md: 3 }}
        sx={{
          textTransform: 'none',
          fontSize: { xs: '20px', md: '24px' },
          px: 0
        }}
      >
        EXPLORE OTHER CATEGORIES
      </Typography>
      <Grid container spacing={2}>
        {bannerFiveSlice.map((b) => (
          <Grid item key={b._id || b.image} xs={6} sm={6} md={3} lg={6}>
            <Box
              component="a"
              href={b.url || '#'}
              sx={{
                display: 'block',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                '&:hover .overlay': { opacity: 1 }
              }}
            >
              {/* Banner aspect ratio on lg, square on smaller */}
              <Box sx={{ width: '100%', pb: { lg: '56.25%', xs: '100%' }, position: 'relative' }}>
                <img
                  src={b.image}
                  alt={b.url || 'banner five'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    opacity: 0,
                    transition: 'opacity 200ms ease'
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Helper to render the Banner Seven 4-column square grid (up to 4 items)
  const renderBannerSevenGrid = () => (
    <Box sx={{ width: '100%', px: { xs: 0, md: 0 } }}>
      <Typography
        variant="h3"
        color="text.primary"
        textAlign="left"
        mb={{ xs: 2, md: 3 }}
        sx={{
          textTransform: 'capitalize',
          fontSize: { xs: '20px', md: '24px' },
          px: 0
        }}
      >
        Electronics
      </Typography>
      <Grid container spacing={2}>
        {bannerSevenSlice.map((b) => (
          <Grid item key={b._id || b.image} xs={6} sm={6} md={3}>
            <Box
              component="a"
              href={b.url || '#'}
              sx={{
                display: 'block',
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                '&:hover .overlay': { opacity: 1 }
              }}
            >
              <Box sx={{ width: '100%', pb: '100%', position: 'relative' }}>
                <img
                  src={b.image}
                  alt={b.url || 'banner seven'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <Box
                  className="overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    opacity: 0,
                    transition: 'opacity 200ms ease'
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Helper to render the Banner Six 2-column rectangular grid (up to 2 items)
  const renderBannerSixGrid = () => (
    <Box sx={{ width: '100%', px: { xs: 0, md: 0 } }}>
      <Grid container spacing={2}>
        {bannerSixSlice.map((b) => (
          <Grid item key={b._id || b.image} xs={12} sm={6} md={6}>
            <Box component="a" href={b.url || '#'} sx={{ display: 'block', borderRadius: 2, overflow: 'hidden' }}>
              {/* rectangular full-width image; height tuned for visual balance */}
              <Box
                component="img"
                src={b.image}
                alt={b.url || 'banner six'}
                sx={{
                  width: '100%',
                  height: { xs: 'auto', md: 240 },
                  objectFit: 'contain',
                  display: 'block',
                  borderRadius: '8px',
                  backgroundColor: 'transparent'
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: '1480px', mx: 'auto', py: { xs: 2, md: 4 }, px: { xs: 0, md: '50px', xl: 0 } }}>
      <Stack spacing={{ xs: 4, md: 6 }}>
        {categories.map((category, idx) => (
          <React.Fragment key={category._id || category.slug}>
            {/* If this is the chosen index for side banner, render a two-column layout */}
            {firstSideBanner && idx === sideBannerIndex ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch', flexDirection: { xs: 'column', md: 'row' } }}>
                <Box sx={{ flexBasis: { xs: '100%', md: '50%' } }}>
                  <CategorySection category={category} slidesToShowProp={2} largeCard={true} />
                </Box>
                <Box
                  sx={{ flexBasis: { xs: '100%', md: '50%' }, flexShrink: 0, display: 'flex', alignItems: 'stretch' }}
                >
                  <Box
                    component="a"
                    href={firstSideBanner.url || '#'}
                    sx={{
                      display: 'block',
                      borderRadius: 2,
                      overflow: 'hidden',
                      width: '100%',
                      height: { xs: '100%', md: '84%' },
                      marginTop: { xs: '8px', md: '58px' }
                    }}
                  >
                    <img
                      src={firstSideBanner.image}
                      alt="side banner"
                      style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <>
                <CategorySection category={category} />
                {firstMidBanner && idx + 1 === insertAfter && (
                  <Box sx={{ width: '100%', px: { xs: 0, md: 0 } }}>
                    <Box
                      component="a"
                      href={firstMidBanner.url || '#'}
                      sx={{ display: 'block', borderRadius: 2, overflow: 'hidden' }}
                    >
                      <img
                        src={firstMidBanner.image}
                        alt="mid banner"
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                      />
                    </Box>
                  </Box>
                )}

                {/* Insert Banner Four here after chosen row */}
                {bannerFourSlice.length > 0 && idx + 1 === insertAfterFour && renderBannerFourGrid()}

                {/* Insert Banner Five here after chosen row */}
                {bannerFiveSlice.length > 0 && idx + 1 === insertAfterFive && renderBannerFiveGrid()}

                {/* Insert Banner Six here after chosen row */}
                {bannerSixSlice.length > 0 && idx + 1 === insertAfterSix && renderBannerSixGrid()}

                {/* Insert Banner Seven here after chosen row */}
                {bannerSevenSlice.length > 0 &&
                  idx + 1 === insertAfterSeven &&
                  renderBannerSevenGrid &&
                  renderBannerSevenGrid()}
              </>
            )}

            {/* Render OurFacility unconditionally after the second category row */}
            {idx === 2 && (
              <Box sx={{ py: { xs: 1, md: 1 } }}>
                <OurFacility />
              </Box>
            )}
          </React.Fragment>
        ))}

        {/* Fallback: if banner-four wasn't rendered because categories are fewer, render after last row */}
        {bannerFourSlice.length > 0 && insertAfterFour > categories.length && renderBannerFourGrid()}

        {/* Fallback: if banner-five wasn't rendered because categories are fewer, render after last row and after banner four */}
        {bannerFiveSlice.length > 0 && insertAfterFive > categories.length && renderBannerFiveGrid()}

        {/* Fallback: if banner-six wasn't rendered because categories are fewer, render after last row and after other banners */}
        {bannerSixSlice.length > 0 && insertAfterSix > categories.length && renderBannerSixGrid()}

        {/* Fallback: if banner-seven wasn't rendered because categories are fewer, render after last row and after other banners */}
        {bannerSevenSlice.length > 0 &&
          insertAfterSeven > categories.length &&
          renderBannerSevenGrid &&
          renderBannerSevenGrid()}
      </Stack>
    </Box>
  );
};

export default ProductShowCase;
