import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const WarrantyPolicyPage = () => {
  return (
    <Container fixed>
      <Box sx={{ py: { xs: 3, md: 6 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Warranty Policy
        </Typography>

        <Typography paragraph>
          We really hope that you’re happy with your purchase! Should you have a problem with your purchase, we offer a
          Standard Warranty that covers most items for up to 1 year to 3 years (mentioned in product description). In
          most cases, the warranty is provided by the official manufacturer and its service centre. This ensures that
          the product is managed by trained professionals and with utmost care.
        </Typography>

        <Typography paragraph>
          For any products with an issue, the customer can go approach the respective brand service centre in the middle
          east or return the item at the E Zone Office. Also, we can arrange for a pick up that will be charged at a
          nominal rate.
        </Typography>
      </Box>
    </Container>
  );
};

export default WarrantyPolicyPage;
