import React from 'react';
import PropTypes from 'prop-types';
// mui
import { styled } from '@mui/material/styles';
import { Box, TableRow, Skeleton, TableCell, Typography, Stack, IconButton, Tooltip, useTheme } from '@mui/material';
// icons
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
// components
import BlurImage from 'src/components/blurImage';
import { fDateShort } from 'src/utils/formatTime';
// next
import { useRouter } from 'next-nprogress-bar';
// components
import Label from 'src/components/label';
// lodash
import { capitalize } from 'lodash';

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
export default function BrandsRow({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  const theme = useTheme();
  return (
    <TableRow hover key={Math.random()}>
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
              <BlurImage priority fill alt={row?.name} src={row?.logo?.url} />
            </ThumbImgStyle>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row.description.slice(0, 50)}</TableCell>
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
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <> {fDateShort(row.createdAt)} </>}</TableCell>

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
                <IconButton onClick={() => router.push(`/dashboard/brands/${row?.slug}`)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={handleClickOpen(row.slug)}>
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
BrandsRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string,
    logo: PropTypes.shape({
      url: PropTypes.string
    }),
    description: PropTypes.string,
    status: PropTypes.string,
    createdAt: PropTypes.string,
    slug: PropTypes.string
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
