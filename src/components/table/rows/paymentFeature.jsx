import React from 'react';
// mui
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip } from '@mui/material';
// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
// next
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
import { fDateShort } from 'src/utils/formatTime';

PaymentFeatureRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.string,
    _id: PropTypes.string
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};

export default function PaymentFeatureRow({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  return (
    <TableRow hover>
      <TableCell component="th" scope="row">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} /> : row?.name}
          </Typography>
        </Box>
  </TableCell>

  <TableCell>{isLoading ? <Skeleton variant="text" /> : fDateShort(row?.createdAt)}</TableCell>

      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/dashboard/payment-features/edit/${row?._id}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row._id)}>
                  <MdDelete />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
