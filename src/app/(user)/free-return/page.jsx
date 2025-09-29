import React from 'react';
import { Container, Typography } from '@mui/material';

const FreeReturnPage = () => {
  return (
    <Container fixed style={{ marginTop: '50px', marginBottom: '50px' }}>
      <section>
        <div>
          <div>
            <div>
              <h2>
                <strong>📦 Return Policy – E Zone Technologies LLC</strong>
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 20 }}>
        <div>
          <div>
            <div>
              <div>
                <Typography paragraph>
                  ✨ At E Zone Technologies LLC, we care about your satisfaction. If you change your mind or decide you don’t
                  want the item, you can return it within <strong>7 days</strong> of your purchase.
                </Typography>

                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  ✅ Return Conditions
                </Typography>
                <ul>
                  <li>📦 <strong>Original Packaging:</strong> Item must be returned in its proper box packaging.</li>
                  <li>🛠️ <strong>Product Condition:</strong> Product must be in unused and undamaged condition.</li>
                  <li>🧾 <strong>Proof of Purchase:</strong> Invoice/receipt must be included.</li>
                </ul>

                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  🚫 Non-Returnable Items
                </Typography>
                <ul>
                  <li>❌ Items that are used, damaged, or missing parts.</li>
                  <li>❌ Products without original packaging.</li>
                  <li>❌ Hygiene-sensitive products (e.g., earphones, personal care devices).</li>
                </ul>

                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  💰 Refund & Exchange
                </Typography>
                <ul>
                  <li>🔄 After inspection, a refund or exchange will be processed within <strong>7 working days</strong>.</li>
                  <li>💳 Refunds will be issued to the original payment method.</li>
                </ul>

                <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
                  📌 How to Return
                </Typography>
                <ul>
                  <li>📞 Contact us within 7 days of purchase.</li>
                  <li>📦 Pack the item securely in its original box.</li>
                  <li>🚚 Ship or drop off the product as instructed by our team.</li>
                </ul>

                <Typography variant="body1" sx={{ mt: 2 }}>
                  📞 Customer Support: <strong>+971502424117</strong>
                </Typography>
                <Typography variant="body1">🌐 Website: <strong>www.e-zonetech.com</strong></Typography>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default FreeReturnPage;
