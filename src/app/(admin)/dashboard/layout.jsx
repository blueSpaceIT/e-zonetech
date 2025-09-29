import React from 'react';
// guard
import AdminGuard from 'src/guards/admin';
// layout
import DashboardLayout from 'src/components/layout/_admin';
import 'simplebar-react/dist/simplebar.min.css';

export default function layout({ children }) {
  return (
    <AdminGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AdminGuard>
  );
}
