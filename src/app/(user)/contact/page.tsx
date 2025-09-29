import React from 'react';
import { Container, Box, Typography, Link, Grid, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ContactUsPage = () => {
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
      <Box sx={{ py: { xs: 3, md: 6 } }}>
        <Typography variant="h5" gutterBottom>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Will I receive the same product that I see in the picture?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Yes, we guarantee that you will receive the same product as shown in the picture. Our product images
              accurately represent the items you will receive. If there are any significant differences, please contact
              our customer support for assistance.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What forms of payment do you accept?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We accept major credit cards, such as Visa, Mastercard, American Express, and Discover. We also offer cash
              on delivery.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How long does shipping take?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Shipping times vary depending on your location and the shipping method selected. Typically, orders are
              processed within 1-2 business days, and delivery can take an additional 3-7 business days within the
              United Arab Emirates.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What is your return policy?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We offer a 15-day return policy for most items. If you're not satisfied with your purchase, you can return
              it within 15 days of delivery for a refund or exchange. Please review our Return Policy page for more
              detailed information and any specific conditions.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How can I track my order?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Once your order is shipped, we will provide you with a tracking number via email. You can use this
              tracking number to monitor the progress of your shipment through our website or the shipping carrier's
              online tracking system.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Can I change or cancel my order after it has been placed?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              If you need to modify or cancel your order, please contact our customer support as soon as possible. We'll
              do our best to accommodate your request, but once an order has been shipped, it cannot be changed or
              canceled.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How can I contact customer support?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can reach our customer support team by visiting our Contact Us page on our website. We provide
              multiple contact options, including email, phone, and live chat. Our support team is available during
              business hours and strives to respond to all inquiries within 24 hours.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default ContactUsPage;
