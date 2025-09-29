// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
// next
import { notFound } from 'next/navigation';
// lodash
import Filter from 'src/components/_main/products/filters';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';

export async function generateStaticParams() {
  try {
    if (!process.env.BASE_URL) return [];
    const res = await fetch(process.env.BASE_URL + '/api/subcategories-slugs');
    if (!res.ok) return [];
    const { data } = await res.json();
    return (
      data?.map((cat) => ({
        subCategory: cat.slug,
        category: cat.parentCategory.slug
      })) || []
    );
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }) {
  try {
    if (!process.env.BASE_URL) return {};
    const res = await fetch(process.env.BASE_URL + '/api/subcategories/' + params.subCategory);
    if (!res.ok) return {};
    const { data: response } = await res.json();
    if (!response) return {};
    return {
      title: response.metaTitle,
      description: response.metaDescription,
      title: response.name,
      openGraph: {
        images: [response.cover?.url]
      }
    };
  } catch (err) {
    return {};
  }
}

export default async function Listing({ params }) {
  const { category, subCategory } = params;
  try {
    if (!process.env.BASE_URL) {
      // If BASE_URL is not present during build, avoid throwing and show 404
      notFound();
    }
    const res = await fetch(process.env.BASE_URL + `/api/subcategory-title/${subCategory}`);
    if (!res.ok) return notFound();
    const response = await res.json();
    if (!response) return notFound();
    const { data: subCategoryData } = response;
    return (
      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <Container fixed>
            <HeaderBreadcrumbs
              heading={subCategoryData?.name}
              links={[
                {
                  name: 'Home',
                  href: '/'
                },
                {
                  name: 'Products',
                  href: '/products'
                },
                {
                  name: subCategoryData?.parentCategory?.name,
                  href: `/products/${category}`
                },
                {
                  name: subCategoryData?.name
                }
              ]}
            />
            <Grid container spacing={3}>
              <Grid
                item
                md={3}
                xs={0}
                sx={{
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <Filter
                  fetchFilters={'getFiltersBySubCategory'}
                  subCategory={subCategoryData}
                  category={subCategoryData.parentCategory}
                  pathname={`${subCategory}`}
                />
              </Grid>
              <Grid item md={9} xs={12}>
                <ProductList subCategory={subCategoryData} fetchFilters={'getFiltersByCategory'} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    );
  } catch (err) {
    notFound();
  }
}
