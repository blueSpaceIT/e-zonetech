// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// components
import Filter from 'src/components/_main/products/filters';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';
export async function generateStaticParams() {
  const { data } = await fetch(process.env.BASE_URL + '/api/categories-slugs').then((res) => res.json());
  return data?.map((cat) => ({
    category: cat.slug
  }));
}

export async function generateMetadata({ params }) {
  const { data: response } = await fetch(process.env.BASE_URL + '/api/categories/' + params.category).then((res) =>
    res.json()
  );
  // const images = category.images.map((img) => img.url);
  return {
    title: response.metaTitle,
    description: response.metaDescription,
    title: response.name,
    openGraph: {
      images: [response.cover.url]
    }
  };
}

export default async function Listing({ params }) {
  const { category } = params;
  const response = await fetch(process.env.BASE_URL + '/api/category-title/' + category).then((res) => res.json());
  if (!response) {
    notFound();
  }
  const { data: categoryData } = response;
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container fixed>
          <HeaderBreadcrumbs
            heading={categoryData?.name}
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
                name: categoryData?.name
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
              <Filter fetchFilters={'getFiltersByCategory'} category={categoryData} pathname={`${category}`} />
            </Grid>
            <Grid item md={9} xs={12}>
              <ProductList category={categoryData} fetchFilters={'getFiltersByCategory'} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
