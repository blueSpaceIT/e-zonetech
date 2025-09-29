import React from 'react';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';

// mui
import { Grid, Paper, Typography, Skeleton, IconButton, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import { fDateShort } from 'src/utils/formatTime';
// lodash
import { capitalize } from 'lodash';
// next
import { useRouter } from 'next/navigation';
// icons
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';

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

function isExpired(expirationDate) {
  const currentDateTime = new Date();

  // Compare the current date and time with the expiration date
  return currentDateTime >= new Date(expirationDate);
}
export default function CouponCodeCard({ item, isLoading, handleClickOpen }) {
  const router = useRouter();

  return (
    <RootStyle key={uniqueId()}>
      <Grid container alignItems="center">
        <Grid item md={8} sm={8} xs={8}>
          <Stack spacing={0.1}>
            <Typography noWrap variant="h6">
              {isLoading ? <Skeleton variant="text" /> : capitalize(item.name).slice(0, 20)}
            </Typography>

            <Typography className="date">{isLoading ? <Skeleton variant="text" width={50} /> : item.code}</Typography>

            <Typography className="date">
              {isLoading ? (
                <Skeleton variant="text" width={50} />
              ) : isExpired(item.expire) ? (
                'Expired'
              ) : (
                fDateShort(item.expire)
              )}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Box className="phone-container">
            {isLoading ? (
              <>
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="circular" width={30} height={30} />
              </>
            ) : (
              <>
                <IconButton
                  className="btn-phone"
                  size="small"
                  onClick={() => router.push(`/dashboard/coupon-codes/${item?._id}`)}
                >
                  <MdEdit size={20} />
                </IconButton>{' '}
                <IconButton className="btn-phone" size="small" onClick={!isLoading && handleClickOpen(item._id)}>
                  <MdDelete size={20} />
                </IconButton>
              </>
            )}
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}
CouponCodeCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    expire: PropTypes.string.isRequired
    // Add more properties as needed
  }),
  isLoading: PropTypes.bool.isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
