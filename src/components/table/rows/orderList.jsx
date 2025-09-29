import React from 'react';
// mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, Checkbox } from '@mui/material';
// components
import { IoEye } from 'react-icons/io5';
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';
import { fDateShort } from 'src/utils/formatTime';
import { useRouter } from 'next-nprogress-bar';
// utils
import { fCurrency } from 'src/utils/formatNumber';

import PropTypes from 'prop-types';

OrderList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    orderNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        cover: PropTypes.string,
        imageUrl: PropTypes.string,
        cover: PropTypes.string
      })
    ).isRequired,
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired
    }),
    createdAt: PropTypes.instanceOf(Date).isRequired,
    status: PropTypes.oneOf(['delivered', 'ontheway', 'pending']).isRequired,
    total: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
  selectedOrders: PropTypes.array,
  onSelectOrder: PropTypes.func
};

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  objectFit: 'cover',
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));
export default function OrderList({ isLoading, row, isUser, selectedOrders = [], onSelectOrder }) {
  const theme = useTheme();
  const router = useRouter();
  
  const isSelected = selectedOrders.includes(row?._id);
  
  const handleSelectChange = (event) => {
    if (onSelectOrder && row?._id) {
      onSelectOrder(row._id, event.target.checked);
    }
  };

  return (
    <TableRow hover key={Math.random()}>
      {/* Selection Checkbox */}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="rectangular" width={24} height={24} />
        ) : (
          <Checkbox
            checked={isSelected}
            onChange={handleSelectChange}
          />
        )}
      </TableCell>
      {/* Order Number */}
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" width={80} />
        ) : (
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {row?.orderNo ?? '-'}
          </Typography>
        )}
      </TableCell>
      
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage
                priority
                fill
                alt={row.items[0]?.name}
                src={row.items[0].cover || row.items[0]?.imageUrl}
                objectFit="cover"
              />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? (
              <Skeleton variant="text" width={120} sx={{ ml: 1 }} />
            ) : !isUser ? (
              row.user.firstName + ' ' + row.user.lastName
            ) : (
              row.items[0]?.name
            )}
          </Typography>
        </Box>
      </TableCell>

      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {fDateShort(row.createdAt)} </>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.total)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row.items.length}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (row?.status === 'delivered' && 'success') ||
              (row?.status === 'ontheway' && 'warning') ||
              (row?.status === 'pending' && 'info') ||
              'error'
            }
          >
            {row.status}
          </Label>
        )}
      </TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
          ) : (
            <Tooltip title="Preview">
              <IconButton onClick={() => router.push(`/dashboard/orders/${row._id}`)}>
                <IoEye />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
