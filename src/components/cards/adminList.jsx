import React from 'react';
import { Card, CardContent, Typography, Stack } from '@mui/material';

export default function AdminListCard({ item }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack>
          <Typography variant="subtitle2">{`${item?.firstName || ''} ${item?.lastName || ''}`.trim() || '-'}</Typography>
          <Typography variant="caption">{item?.email || '-'}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
