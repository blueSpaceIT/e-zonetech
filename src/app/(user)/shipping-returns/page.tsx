import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const ShippingReturnsPage = () => {
  return (
    <Container fixed>
      <Box sx={{ py: { xs: 3, md: 6 } }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SHIPPING
        </Typography>

        <Typography paragraph>
          We will endeavor to process and ship your orders latest by the same, else next working day of receiving your
          order. If the order is within UAE it can take between 1-2 working days to receive the order from the date
          since it has been shipped.
        </Typography>

        <Typography paragraph>
          Free shipping and delivery can be availed for shipment within the UAE if the value is above AED 1500. For all
          orders below AED 1500, a minimal charge of AED 25 per order will be applied. Delivery to Out of Service Areas
          will incur extra charges. The recipient of an international shipment may be subjected to pay Customs Duties or
          fees as levied by the destination country. We have no control over these charges and are unable to calculate
          what they may be.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            RETURNS & EXCHANGES
          </Typography>

          <Typography paragraph>
            Accidents happen. Whether you ordered the wrong part or realized afterwards that you wanted to upgrade, E
            Zone offers a no-hassle return and exchange policy to help you get the right product you need for your
            system. Unless it is specifically stated on a product page, the following policy applies to all E Zone
            online purchases.
          </Typography>

          <Typography paragraph>
            Exchange or Return is possible only within 7 days from the date of delivery subject to the terms herein.
          </Typography>

          <Typography paragraph>
            No Exchange or Return shall be made without the Original Invoice & Warranty Card provided and the product
            (including the unit carton) is returned unused and unopened (original seal not broken) along with
            accessories & FOC (Free of Cost) items, if applicable.
          </Typography>

          <Typography paragraph>
            No Exchange or Return shall be made for the following product categories: Software, Cartridges & Toners.
          </Typography>

          <Typography paragraph>
            To complete your return or exchange, we require a receipt or proof of purchase. For returns, it is the
            customer’s responsibility to deliver the item back to E Zone Office.
          </Typography>

          <Typography paragraph>
            For the customer’s convenience, E Zone may be able to provide an option for collection via courier at a
            nominal rate.
          </Typography>

          <Typography paragraph>
            Once your return is received and inspected, we will send you an email to notify you that we have received
            your returned item. We will also notify you of the approval or rejection of your refund. If you are
            approved, then your refund will be processed, and a credit will automatically be applied to your credit card
            or bank account, within a certain amount of days.
          </Typography>

          <Typography paragraph>Selected products as “On request” items are not possible to be returned.</Typography>

          <Typography paragraph>
            Shipping costs on returned products would be your responsibility. Shipping costs charged upon your purchase
            are non-refundable. Ensuring that it’s not our responsibility, if at all E Zone is necessitated for paying
            shipping charges upon any return product/shipment then such charges will be deducted from the subjected
            refund amount.
          </Typography>

          <Typography paragraph>
            These terms & conditions shall be governed and constructed in accordance with the laws of the UAE as applied
            in the respective emirate.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
            REFUNDS (IF APPLICABLE)
          </Typography>

          <Typography paragraph>
            Once your return is received and inspected, we will send you an email to notify you that we have received
            your returned item. We will also notify you of the approval or rejection of your refund. If you are
            approved, then your refund will be processed, and a credit will automatically be applied to your credit card
            or bank account, within a certain amount of days.
          </Typography>

          <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
            SALE ITEMS (IF APPLICABLE)
          </Typography>

          <Typography paragraph>
            Only regular priced items may be refunded, unfortunately, sale items cannot be refunded.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ShippingReturnsPage;
