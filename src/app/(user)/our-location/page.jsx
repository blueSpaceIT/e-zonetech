import React from 'react';
import { Container, Box, Typography, Link, Grid } from '@mui/material';

const OurLocationPage = () => {
  return (
    <Container fixed>
      <Box sx={{ py: { xs: 3, md: 6 } }}>
        <Grid container spacing={4} alignItems="flex-start">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              ADDRESS
            </Typography>

            <Typography variant="h6" component="h2" gutterBottom>
              DUBAI OFFICE
            </Typography>

            <Typography paragraph>
              Shop No: 2, Belghuzooz Al Raffa Building,
              <br />
              Bur Dubai, Dubai, UAE.
            </Typography>

            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
              PHONE
            </Typography>

            <Typography paragraph>
              Tel: <Link href="tel:+97143451530">+971 4 345 1530</Link>
              <br />
              Mobile: <Link href="tel:+971502424117">+971 50 242 4117</Link>
            </Typography>

            <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
              EMAIL ADDRESS
            </Typography>

            <Typography paragraph>
              Mail: <Link href="mailto:info@e-zonetech.com">info@e-zonetech.com</Link>
              <br />
              Sales: <Link href="mailto:sales@e-zonetech.com">sales@e-zonetech.com</Link>
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ width: '100%', height: { xs: 300, md: 450 }, borderRadius: 1, overflow: 'hidden' }}>
              <iframe
                title="E Zone Technologies Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d451.0390514495459!2d55.28582367053492!3d25.260074021498227!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5b71fc8f534d%3A0xe0580f57113b22d4!2sE%20ZONE%20TECHNOLOGIES%20LLC!5e0!3m2!1sen!2sbd!4v1755234168426!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      
    </Container>
  );
};

export default OurLocationPage;
