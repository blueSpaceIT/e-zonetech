import React from 'react';
// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, useTheme, Chip } from '@mui/material';
// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { MdVisibility } from 'react-icons/md';
// lodash
import { capitalize } from 'lodash';
// components
import Label from 'src/components/label';
import BlurImage from 'src/components/blurImage';
import { fDateShort } from 'src/utils/formatTime';
// next
import { useRouter } from 'next-nprogress-bar';

import PropTypes from 'prop-types';

Banner.propTypes = {
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

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  minWidth: 50,
  objectFit: 'cover',
  background: theme.palette.background.default,
  marginRight: theme.spacing(2),
  border: '1px solid ' + theme.palette.divider,
  borderRadius: theme.shape.borderRadiusSm,
  position: 'relative',
  overflow: 'hidden'
}));

const ColorBox = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  borderRadius: '50%',
  border: '1px solid ' + theme.palette.divider,
  marginRight: theme.spacing(1)
}));

export default function Banner({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  const theme = useTheme();
  
  return (
    <TableRow hover key={row?._id}>
      <TableCell component="th" scope="row">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <ThumbImgStyle>
              <BlurImage priority fill alt={row?.heading} src={row?.cover?.url} objectFit="cover" />
            </ThumbImgStyle>
          )}
          <Box>
            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
              {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.heading}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
              {isLoading ? <Skeleton variant="text" width={80} sx={{ ml: 1 }} /> : row?.description?.slice(0, 50) + '...'}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ColorBox sx={{ backgroundColor: row?.color }} />
            <Typography variant="body2">{row?.color}</Typography>
          </Box>
        )}
      </TableCell>
      
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Stack direction="row" spacing={0.5}>
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
      </TableCell>
      
      <TableCell align="center">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Typography variant="body2" fontWeight="bold">
            {row?.order}
          </Typography>
        )}
      </TableCell>
      
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={row?.status?.toLowerCase() === 'active' ? 'success' : 'error'}
          >
            {capitalize(row?.status)}
          </Label>
        )}
      </TableCell>
      
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fDateShort(row.createdAt)}</TableCell>
      
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <>
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
              <Skeleton variant="circular" width={34} height={34} />
            </>
          ) : (
            <>
              <Tooltip title="View">
                <IconButton onClick={() => window.open(row?.btnPrimary?.url || '#', '_blank')}>
                  <MdVisibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={() => router.push(`/dashboard/banners/${row?._id}`)}>
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
