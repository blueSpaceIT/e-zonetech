import React from 'react';
import Dashboard from 'src/components/_admin/dashboard';
// Meta information
export const metadata = {
  title: 'Ezone - Dashboard',
  description: 'Welcome to the Ezone Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'Ezone Dashboard',
  authors: 'Ezone',
  keywords: 'dashboard, e-commerce, management, Ezone',
  icons: {
    icon: '/favicon.png'
  }
};

export default function page() {
  return (
    <>
      <Dashboard />
    </>
  );
}
