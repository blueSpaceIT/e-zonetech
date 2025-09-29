import * as React from 'react';
// mui
import { Box } from '@mui/material';
// components
import Navbar from 'src/components/layout/_main/navbar';
import Footer from 'src/components/layout/_main/footer';
import WhatsappFab from 'src/components/whatsappFab';
import { cookies } from 'next/headers';

// This layout intentionally reads request cookies; mark as dynamic.
export const dynamic = 'force-dynamic';

// Meta information
export const metadata = {
  title: 'Ezone | Your Gateway to Seamless Shopping and Secure Transactions',
  description:
    'Log in to Ezone for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
  applicationName: 'Ezone',
  authors: 'Ezone',
  keywords: 'ecommerce, Ezone, Login Ezone, LoginFrom Ezone',
  icons: {
    icon: '/favicon.ico'
  },
  openGraph: {
    images: 'https://ezone-app.vercel.app/opengraph-image.png'
  }
};

export default async function RootLayout({ children }) {
  const cookiesList = cookies();
  const hasCookie = cookiesList.get('token');

  return (
    <>
      <Navbar isAuth={hasCookie} />
      {children}
  <WhatsappFab />
      <Box sx={{ py: { xs: 5, md: 3 } }} />
      <Footer />
    </>
  );
}
