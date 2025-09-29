export const dynamic = "force-dynamic";
import React from 'react';
import { Suspense } from 'react';
// mui
import { Box, Container, Card, Grid, Typography, Button } from '@mui/material';
//  Next
import { notFound } from 'next/navigation';
// components
import RelatedProductsCarousel from 'src/components/_main/product/relatedProducts';
import ProductDetailTabs from 'src/components/_main/product/tabs';
import ProductAdditionalInfo from 'src/components/_main/product/additionalInfo';
import ProductDetailsCarousel from 'src/components/carousels/details';
import ProductDetailsSumary from 'src/components/_main/product/summary';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import CustomerReviews from 'src/components/_main/product/customerReviews';

// Client component for state management
import ProductDetailClient from 'src/components/_main/product/productDetailClient';
export async function generateStaticParams() {
  const { data } = await fetch(process.env.BASE_URL + '/api/products-slugs').then((res) => res.json());
  return data?.map((product) => ({
    slug: product.slug
  }));
}

export async function generateMetadata({ params }) {
  const { data: response } = await fetch(process.env.BASE_URL + '/api/products/' + params.slug).then((res) =>
    res.json()
  );

  return {
    title: response.metaTitle,
    description: response.metaDescription,
    keywords: response.tags,
    title: response.name,
    openGraph: {
      images: response.images.map((v) => v.url)
    }
  };
}

export default async function ProductDetail({ params: { slug } }) {
  const response = await fetch(process.env.BASE_URL + '/api/products/' + slug).then((res) => res.json());
  if (!response) {
    notFound();
  }
  const { data, totalRating, totalReviews, brand, category } = response;

  console.log('Product Data:', data);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {
          (() => {
            const links = [{ name: 'Home', href: '/' }];

            // prefer categoryDetails from API, fallback to category
            const cat = response?.categoryDetails || response?.category || category;
            if (cat?.name) {
              links.push({ name: cat.name, href: cat.slug ? `/products/${cat.slug}` : '/products' });
            }

            // prefer subCategoryDetails from API
            const sub = response?.subCategoryDetails;
            if (sub && (typeof sub === 'string' || sub?.name)) {
              const subName = typeof sub === 'string' ? sub : sub.name;
              const catSlug = cat?.slug || '';
              const subSlug = typeof sub === 'string' ? '' : sub.slug || '';
              links.push({ name: subName, href: subSlug ? `/products/${catSlug}/${subSlug}` : '/products' });
            }

            // finally product
            links.push({ name: data?.name || 'Product', href: slug ? `/product/${slug}` : `/product/${data?._id || ''}` });

            return <HeaderBreadcrumbs sx={{ mt: 3 }} admin links={links} />;
          })()
        }
        
        {/* Main Product Section */}
        <ProductDetailClient
          data={data}
          slug={slug}
          brand={brand}
          category={category}
          totalRating={totalRating}
          totalReviews={totalReviews}
        />

        {/* Product Description Section */}
        {data?.description && (
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              p: 4,
              mb: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
              Product Description
            </Typography>
            <Typography 
              variant="body1" 
              color="text.primary" 
              sx={{ 
                lineHeight: 1.8,
                '& p': {
                  mb: 2
                },
                '& ul, & ol': {
                  pl: 3,
                  mb: 2
                },
                '& li': {
                  mb: 1
                }
              }}
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </Box>
        )}

        {/* Specifications Section */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 2,
            p: 4,
            mb: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
            Specifications
          </Typography>

          {/* General Section */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 2, 
                py: 1,
                px: 2,
                bgcolor: '#e3f2fd',
                color: '#1976d2',
                fontWeight: 600,
                borderRadius: 1
              }}
            >
              General
            </Typography>

            <Grid container spacing={0}>
              {/* Row 1 */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderRight: { md: '1px solid #e0e0e0' }, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Brand
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {brand?.name || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              {/* <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderRight: { md: '1px solid #e0e0e0' }, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Model
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {data?.model || 'N/A'}
                  </Typography>
                </Box>
              </Grid> */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    SKU
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {data?.sku || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderRight: { md: '1px solid #e0e0e0' }, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Category
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {category?.name || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderRight: { md: '1px solid #e0e0e0' }, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Available Colors
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {data?.colors && data.colors.length > 0 ? data.colors.join(', ') : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderBottom: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Available Sizes
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {data?.sizes && data.sizes.length > 0 ? data.sizes.join(', ') : 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              {/* Row 3 */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderRight: { md: '1px solid #e0e0e0' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Stock Status
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1, color: data?.available > 0 ? '#4caf50' : '#f44336' }}>
                    {data?.available > 0 ? `In Stock (${data.available} available)` : 'Out of Stock'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60, borderRight: { md: '1px solid #e0e0e0' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Price Range
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {data?.priceSale && data.priceSale !== data?.price 
                      ? `AED ${data.priceSale} - AED ${data.price}`
                      : `AED ${data?.price || 'N/A'}`
                    }
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 60 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                    Date Added
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, flexGrow: 1 }}>
                    {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* View More Button */}
          <Box sx={{ textAlign: 'left' }}>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                textTransform: 'none',
                borderRadius: 1,
                px: 3
              }}
            >
              View More
            </Button>
          </Box>
        </Box>

        {/* Similar Products Section */}
        <Suspense fallback={<></>}>
          <RelatedProductsCarousel id={data._id} category={category?.slug} />
        </Suspense>

        {/* Customer Reviews Section */}
        <Suspense fallback={<Box sx={{ bgcolor: 'white', borderRadius: 2, p: 4, mb: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}><Typography>Loading reviews...</Typography></Box>}>
          <CustomerReviews productId={data._id} totalRating={totalRating} totalReviews={totalReviews} />
        </Suspense>

        {/* Product Details Tabs */}
        {/* <Suspense fallback={<></>}>
          <ProductDetailTabs
            product={{ description: data.description, _id: data._id }}
            totalRating={totalRating}
            totalReviews={totalReviews}
          />
        </Suspense> */}

        {/* Additional Info */}
        {/* <ProductAdditionalInfo /> */}

        {/* Related Products */}
        {/* <Suspense fallback={<></>}>
          <RelatedProductsCarousel id={data._id} category={category?.slug} />
        </Suspense> */}
      </Container>
    </Box>
  );
}
