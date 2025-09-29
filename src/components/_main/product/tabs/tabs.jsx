'use client';
import { useState } from 'react';
// mui
import { styled } from '@mui/material/styles';
import { Box, Tab, Card, Divider, Typography, Table, TableBody, TableRow, TableCell, Grid } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
// components
import ProductDetailsReview from '../reviews';
import PropTypes from 'prop-types';

const RootStyles = styled('div')(() => ({
  overflow: 'hidden',
  position: 'relative',
  padding: '40px 0'
}));

// Sample specifications data - in real app, this would come from product data
const sampleSpecs = {
  'General': {
    'Brand': 'Apple',
    'Model': 'iPad mini',
    'Operating System': 'iPadOS',
    'Year': '2021'
  },
  'Display': {
    'Screen Size': '8.3 inches',
    'Resolution': '2266 x 1488',
    'Display Technology': 'Liquid Retina',
    'Brightness': '500 nits'
  },
  'Performance': {
    'Processor': 'A15 Bionic chip',
    'Storage': '64GB / 256GB',
    'RAM': '4GB',
    'Graphics': 'Integrated'
  },
  'Camera': {
    'Rear Camera': '12MP Wide',
    'Front Camera': '12MP Ultra Wide',
    'Video Recording': '4K',
    'Features': 'Center Stage, True Tone flash'
  }
};

ProductDetailsTabs.propTypes = {
  product: PropTypes.object.isRequired,
  reviews: PropTypes.array.isRequired,
  totalRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired,
  reviewsSummery: PropTypes.object.isRequired
};

export default function ProductDetailsTabs({ ...props }) {
  const { product, reviews, totalRating, totalReviews, reviewsSummery } = props;
  const [value, setValue] = useState('1');
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <RootStyles>
      <Card 
        sx={{ 
          mb: 3, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}
      >
        <TabContext value={value}>
          <Box sx={{ px: 3, bgcolor: 'background.neutral' }}>
            <TabList onChange={handleChangeTab}>
              <Tab disableRipple value="1" label={'Product Description'} />
              <Tab disableRipple value="2" label={'Specifications'} />
              <Tab disableRipple value="3" label={'Reviews'} sx={{ '& .MuiTab-wrapper': { whiteSpace: 'nowrap' } }} />
            </TabList>
          </Box>
          <Divider />
          
          {/* Product Description */}
          <TabPanel value="1" sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {product?.description}
            </Typography>
          </TabPanel>

          {/* Specifications */}
          <TabPanel value="2" sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Specifications
            </Typography>
            
            <Grid container spacing={3}>
              {Object.entries(sampleSpecs).map(([category, specs]) => (
                <Grid item xs={12} md={6} key={category}>
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        fontWeight: 600,
                        color: 'primary.main',
                        borderBottom: '2px solid',
                        borderColor: 'primary.main',
                        pb: 1,
                        display: 'inline-block'
                      }}
                    >
                      {category}
                    </Typography>
                    <Table size="small">
                      <TableBody>
                        {Object.entries(specs).map(([key, value]) => (
                          <TableRow key={key} sx={{ '&:last-child td': { border: 0 } }}>
                            <TableCell 
                              sx={{ 
                                fontWeight: 500,
                                bgcolor: '#f8f9fa',
                                width: '40%',
                                border: '1px solid #e0e0e0'
                              }}
                            >
                              {key}
                            </TableCell>
                            <TableCell sx={{ border: '1px solid #e0e0e0' }}>
                              {value}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Reviews */}
          <TabPanel value="3">
            <ProductDetailsReview
              reviewsSummery={reviewsSummery}
              totalRating={totalRating}
              totalReviews={totalReviews}
              reviews={reviews}
              pid={product?._id}
            />
          </TabPanel>
        </TabContext>
      </Card>
    </RootStyles>
  );
}
