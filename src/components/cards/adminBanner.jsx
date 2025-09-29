import React from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
// mui
import { Grid, Paper, Typography, Skeleton, IconButton, Box, Stack, Chip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
// components
import Label from 'src/components/label';
import { fDateShort } from 'src/utils/formatTime';
import BlurImage from 'src/components/blurImage';
// lodash
import { capitalize } from 'lodash';
// icons
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { MdVisibility } from 'react-icons/md';
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
      height: 10,
      '& path': {
        fill: theme.palette.text.primary
      }
    }
  }
}));

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  minWidth: 60,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));

const ColorBox = styled(Box)(({ theme }) => ({
  width: 16,
  height: 16,
  borderRadius: '50%',
  border: '1px solid ' + theme.palette.divider,
  marginRight: theme.spacing(1)
}));

export default function AdminBannerCard({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <RootStyle>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
              {isLoading ? (
                <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 1, mr: 2 }} />
              ) : (
                <ThumbImgStyle>
                  <BlurImage priority fill alt={row?.heading} src={row?.cover?.url} objectFit="cover" />
                </ThumbImgStyle>
              )}
              
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="subtitle2" className="name" noWrap>
                  {isLoading ? <Skeleton variant="text" width={120} /> : row?.heading}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 0.5 }}>
                  {isLoading ? <Skeleton variant="text" width={150} /> : row?.description?.slice(0, 60) + '...'}
                </Typography>
                
                <Box display="flex" alignItems="center" sx={{ mb: 0.5 }}>
                  {isLoading ? (
                    <Skeleton variant="text" width={80} />
                  ) : (
                    <>
                      <ColorBox sx={{ backgroundColor: row?.color }} />
                      <Typography variant="caption" color="text.secondary">
                        Color: {row?.color}
                      </Typography>
                    </>
                  )}
                </Box>
                
                <Box display="flex" alignItems="center" gap={1} sx={{ mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Order: {isLoading ? <Skeleton variant="text" width={20} /> : row?.order}
                  </Typography>
                  
                  {isLoading ? (
                    <Skeleton variant="text" width={60} />
                  ) : (
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={row?.status?.toLowerCase() === 'active' ? 'success' : 'error'}
                      sx={{ ml: 1 }}
                    >
                      {capitalize(row?.status)}
                    </Label>
                  )}
                </Box>
                
                {!isLoading && (row?.btnPrimary || row?.btnSecondary) && (
                  <Stack direction="row" spacing={0.5} sx={{ mb: 0.5 }}>
                    {row?.btnPrimary && (
                      <Chip 
                        label={row.btnPrimary.btnText} 
                        size="small" 
                        variant="outlined" 
                        color="primary"
                      />
                    )}
                    {row?.btnSecondary && (
                      <Chip 
                        label={row.btnSecondary.btnText} 
                        size="small" 
                        variant="outlined" 
                        color="secondary"
                      />
                    )}
                  </Stack>
                )}
                
                <Typography variant="caption" color="text.secondary" className="date">
                  {isLoading ? <Skeleton variant="text" width={80} /> : row?.createdAt}
                </Typography>
              </Box>
            </Box>
            
            <Stack direction="row" spacing={0.5}>
              {isLoading ? (
                <>
                  <Skeleton variant="circular" width={34} height={34} />
                  <Skeleton variant="circular" width={34} height={34} />
                  <Skeleton variant="circular" width={34} height={34} />
                </>
              ) : (
                <>
                  <IconButton size="small" onClick={() => window.open(row?.btnPrimary?.url || '#', '_blank')}>
                    <MdVisibility />
                  </IconButton>
                  <IconButton size="small" onClick={() => router.push(`/dashboard/banners/${row?._id}`)}>
                    <MdEdit />
                  </IconButton>
                  {/* <IconButton size="small" onClick={handleClickOpen(row._id)}>
                    <MdDelete />
                  </IconButton> */}
                </>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </RootStyle>
  );
}

AdminBannerCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    createdAt: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired
    }).isRequired,
    btnPrimary: PropTypes.shape({
      btnText: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }),
    btnSecondary: PropTypes.shape({
      btnText: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
