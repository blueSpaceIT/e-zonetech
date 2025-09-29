import React from 'react';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import Toolbar from 'src/components/_admin/toolbar';
import AccountChangePassword from 'src/components/_main/profile/edit/accountChangePassword';
import { Card, Container, Stack, Typography } from '@mui/material';
export default function page() {
  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          heading="Dashboard"
          admin
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Settings',
              href: '/dashboard/settings'
            },
            {
              name: 'Change Password'
            }
          ]}
        />
      </Toolbar>
      <Container maxWidth="sm">
        <Card
          sx={{
            maxWidth: 560,
            m: 'auto',
            my: '80px',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 3
          }}
        >
          <Stack mb={5}>
            <Typography textAlign="center" variant="h4" component="h1" gutterBottom>
              Change Password
            </Typography>
            <Typography textAlign="center" color="text.secondary">
              Change your password by logging into your account.
            </Typography>
          </Stack>
          <AccountChangePassword />
        </Card>
      </Container>
    </div>
  );
}
