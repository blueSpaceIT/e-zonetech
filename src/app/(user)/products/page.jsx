// mui
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

// components
import Filter from 'src/components/_main/products/filters';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';

export default async function Listing() {
  // const data = await getAllFilters();
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <Container fixed>
          <HeaderBreadcrumbs
            heading="Products"
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Products'
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
              {/* filters={data?.data} */}
              <Filter pathname="/products" fetchFilters={'getAllFilters'} />
            </Grid>
            <Grid item md={9} xs={12}>
              <ProductList fetchFilters={'getAllFilters'} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
