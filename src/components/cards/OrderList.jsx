import React from 'react';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
// mui
import { Grid, Paper, Typography, Skeleton, Box, Stack, Link, Checkbox } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';
// utils
import { fDateShort } from 'src/utils/formatTime';
import { fCurrency } from 'src/utils/formatNumber';
// lodash
import { capitalize } from 'lodash';
// next
import NextLink from 'next/link';

const RootStyle = styled(Paper)(({ theme }) => ({
  padding: '10px 10px 10px 16px',
  marginBottom: '0.5rem',
  backgroundColor: theme.palette.background.paper,
  border: '1px solid ' + theme.palette.divider,
  borderRadius: 4,
  '& .name': {
    fontWeight: 600,
    color: theme.palette.info.main
  },
  '& .time svg': {
    width: 10,
    height: 10,
    '& path': {
      fill: theme.palette.text.primary
    }
  },
  '& .date': {
    fontSize: '0.75rem',
    fontWeight: 500
  },
  '& .callander': {
    '& svg': {
      width: 10,
      height: 10
    }
  },
  '& .time-slot': {
    fontWeight: 500,
    fontSize: '0.75rem'
  },
  '& .phone-container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '0.5rem',
    '& .phone': {
      color: theme.palette.text.secondary,
      fontWeight: 400,
      fontSize: 11
    },
    '& .btn-phone': {
      fontSize: '1px'
    }
  }
}));

export default function OrderList({ item, isLoading, isUser, selectedOrders = [], onSelectOrder }) {
  const theme = useTheme();
  
  const isSelected = selectedOrders.includes(item?._id);
  
  const handleSelectChange = (event) => {
    if (onSelectOrder && item?._id) {
      onSelectOrder(item._id, event.target.checked);
    }
  };

  return (
    <RootStyle key={uniqueId()}>
      <Grid container alignItems="center">
        <Grid item xs={1}>
          {/* Selection Checkbox */}
          {isLoading ? (
            <Skeleton variant="rectangular" width={24} height={24} />
          ) : (
            <Checkbox
              checked={isSelected}
              onChange={handleSelectChange}
              size="small"
            />
          )}
        </Grid>
        <Grid item xs={7}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {isLoading ? (
              <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: 50,
                  width: 50,
                  minWidth: 50,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`
                }}
              >
                <BlurImage priority fill alt={item?.name} src={item?.items[0]?.imageUrl} objectFit="cover" />
              </Box>
            )}
            <Stack spacing={0.5}>
              {/* Order Number */}
              <Typography variant="caption" color="text.secondary">
                {isLoading ? <Skeleton variant="text" width={60} /> : `Order No: ${item?.orderNo ?? '-'}`}
              </Typography>
              <Link className="name" component={NextLink} href={`/orders/${item?._id}`} underline="none">
                {isLoading ? (
                  <Skeleton variant="text" />
                ) : isUser ? (
                  item.items[0]?.name
                ) : (
                  capitalize(item?.user.firstName)
                )}
              </Link>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography className="time-slot">
                  {isLoading ? (
                    <Skeleton variant="text" width={50} />
                  ) : (
                    item.items.length + ` item${item.items.length > 1 ? 's' : ''}`
                  )}
                </Typography>
                <Typography className="date">
                  {isLoading ? <Skeleton variant="text" width={50} /> : fDateShort(item.createdAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Typography sx={{ textAlign: 'right', mb: 0.5 }} variant="body2" fontWeight={600}>
            {isLoading ? (
              <Skeleton variant="text" width={50} sx={{ ml: 'auto' }} />
            ) : (
              fCurrency(Number(item?.total)).slice(0, -3)
            )}
          </Typography>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (item?.status === 'delivered' && 'success') ||
                  (item?.status === 'ontheway' && 'warning') ||
                  (item?.status === 'pending' && 'info') ||
                  'error'
                }
              >
                {capitalize(item?.status)}
              </Label>
            )}
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
OrderList.propTypes = {
  item: PropTypes.object,
  isLoading: PropTypes.bool,
  isUser: PropTypes.bool
};
