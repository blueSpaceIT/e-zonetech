import React from 'react';
import PropTypes from 'prop-types';
// mui
import { Grid, Paper, Typography, Skeleton, IconButton, Box, Stack, Rating } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// components
import Label from 'src/components/label';
import { fDateShort } from 'src/utils/formatTime';
import BlurImage from 'src/components/blurImage';
import { fCurrency } from 'src/utils/formatNumber';
// lodash
import { capitalize } from 'lodash';
import { uniqueId } from 'lodash';
// icons ;
import { MdEdit, MdDelete } from 'react-icons/md';

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

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 56,
  minWidth: 56,
  height: 56,
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));

export default function AdminProductCard({ item, isLoading, handleClickOpen }) {
  const theme = useTheme();
  return (
    <RootStyle key={uniqueId()}>
      <Grid container alignItems="center">
        <Grid item md={8} sm={8} xs={8}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {isLoading ? (
              <Skeleton variant="rectangular" width={56} height={56} sx={{ borderRadius: 1 }} />
            ) : (
              <ThumbImgStyle>
                <BlurImage priority fill alt={item?.name} src={item?.image?.url} objectFit="cover" />
              </ThumbImgStyle>
            )}
            <Stack spacing={0.3}>
              <Typography noWrap variant="h6" lineHeight={1.3}>
                {isLoading ? <Skeleton variant="text" /> : capitalize(item.name).slice(0, 20)}
              </Typography>
              <Stack alignItems="center" spacing={2} direction="row">
                <Typography className="time-slot" fontWeight={600}>
                  {isLoading ? (
                    <Skeleton variant="text" width={50} />
                  ) : (
                    fCurrency(Number(item?.priceSale || item?.price)).slice(0, -2)
                  )}
                </Typography>
                <Typography className="date">
                  {isLoading ? <Skeleton variant="text" width={50} /> : fDateShort(item?.createdAt)}
                </Typography>
              </Stack>
              {isLoading ? (
                <Skeleton variant="text" width="100px" sx={{ ml: 'auto' }} />
              ) : (
                <Rating name="text-feedback" size="small" value={item?.averageRating || 0} readOnly precision={0.5} />
              )}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={4} sx={{ textAlign: 'right' }}>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (item?.available < 1 && 'error') ||
                  (item?.available < 20 && 'warning') ||
                  (item?.available >= 20 && 'success') ||
                  'primary'
                }
              >
                {(item?.available < 1 && 'Out of stock') ||
                  (item?.available < 20 && 'Low stock') ||
                  (item?.available >= 20 && 'In stock')}
              </Label>
            )}

            {isLoading ? (
              <Stack>
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="circular" width={30} height={30} />
              </Stack>
            ) : (
              <Stack>
                <IconButton
                  className="btn-phone"
                  size="small"
                  onClick={() => router.push(`/dashboard/products/${item?.slug}`)}
                >
                  <MdEdit size={20} />
                </IconButton>
                <IconButton className="btn-phone" size="small" onClick={!isLoading && handleClickOpen(item._id)}>
                  <MdDelete size={20} />
                </IconButton>
              </Stack>
            )}
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}

AdminProductCard.propTypes = {
  item: PropTypes.shape({
    image: PropTypes.object.isRequired,
    name: PropTypes.string,
    priceSale: PropTypes.number,
    price: PropTypes.number,
    createdAt: PropTypes.string,
    averageRating: PropTypes.number,
    available: PropTypes.number,
    slug: PropTypes.string,
    _id: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  handleClickOpen: PropTypes.func
};
