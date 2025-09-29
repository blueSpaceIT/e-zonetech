import React from 'react';
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
// mui
import { Grid, Paper, Typography, Skeleton, IconButton, Box, Stack } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// lodash
import { capitalize } from 'lodash';
// components
import BlurImage from 'src/components/blurImage';
import Label from 'src/components/label';
import { fDateShort } from 'src/utils/formatTime';
// icons
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
// next
import { useRouter } from 'next/navigation';

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

export default function BrandsCard({ item, isLoading, handleClickOpen }) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <RootStyle key={uniqueId()}>
      <Grid container spacing={2} alignItems="center">
        <Grid item md={8} sm={8} xs={8}>
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
                <BlurImage priority fill alt={item?.name} src={item?.logo?.url} objectFit="cover" />
              </Box>
            )}
            <Stack spacing={0.5}>
              <Typography noWrap variant="h6">
                {isLoading ? <Skeleton variant="text" /> : capitalize(item.name).slice(0, 20)}
              </Typography>
              <Typography className="date">
                {isLoading ? <Skeleton variant="text" width={50} /> : fDateShort(item.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Box className="phone-container">
            {isLoading ? (
              <Skeleton variant="text" width={50} />
            ) : (
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={item?.status?.toLowerCase() === 'active' ? 'success' : 'error'}
              >
                {capitalize(item?.status)}
              </Label>
            )}
            {isLoading ? (
              <Stack>
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="circular" width={30} height={30} />
              </Stack>
            ) : (
              <Stack>
                <IconButton size="small" onClick={() => router.push(`/dashboard/brands/${item?.slug}`)}>
                  <MdEdit size={20} />
                </IconButton>
                <IconButton size="small" onClick={!isLoading && handleClickOpen(item._id)}>
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
BrandsCard.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string
    }),
    createdAt: PropTypes.string,
    status: PropTypes.string,
    slug: PropTypes.string
  }),
  isLoading: PropTypes.bool,
  handleClickOpen: PropTypes.func
};
