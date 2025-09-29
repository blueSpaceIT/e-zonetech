import React from 'react';
import { Card, CardContent, Typography, Stack, IconButton, Skeleton } from '@mui/material';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { fDateShort } from 'src/utils/formatTime';
import { MdEdit, MdDelete } from 'react-icons/md';

PaymentFeatureCard.propTypes = {
  item: PropTypes.object,
  isLoading: PropTypes.bool,
  handleClickOpen: PropTypes.func
};

export default function PaymentFeatureCard({ item, isLoading, handleClickOpen }) {
  const router = useRouter();
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton variant="text" width={160} />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </>
        ) : (
          <>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle1">{item?.name}</Typography>
              <Stack direction="row">
                <IconButton onClick={() => router.push(`/dashboard/payment-features/edit/${item?._id}`)}>
                  <MdEdit />
                </IconButton>
                <IconButton onClick={handleClickOpen(item?._id)}>
                  <MdDelete />
                </IconButton>
              </Stack>
            </Stack>
            <Typography variant="body2" sx={{ mt: 1 }}>{item?.description}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {fDateShort(item?.createdAt)}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}
