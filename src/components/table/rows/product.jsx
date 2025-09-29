// mui
import {
  Box,
  TableRow,
  Skeleton,
  TableCell,
  Typography,
  Stack,
  IconButton,
  Rating,
  Tooltip,
  Link
} from '@mui/material';
// redux
import { fCurrency } from 'src/utils/formatNumber';
import { fDateShort } from 'src/utils/formatTime';
// components
import Label from 'src/components/label';
import { MdEdit } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';
import { enUS } from 'date-fns/locale';
import { useRouter } from 'next-nprogress-bar';
import BlurImage from 'src/components/blurImage';
import PropTypes from 'prop-types';

// const label = { inputProps: { 'aria-label': 'Switch demo' } };
export default function ProductRow({ isLoading, row, handleClickOpen }) {
  const router = useRouter();
  return (
    <TableRow hover key={Math.random()}>
      <TableCell component="th" scope="row" sx={{ maxWidth: 300 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <Skeleton variant="rectangular" width={50} height={50} sx={{ borderRadius: 1 }} />
          ) : (
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                width: 50,
                height: 50,
                bgcolor: 'background.default',
                mr: 2,
                border: (theme) => '1px solid ' + theme.palette.divider,
                borderRadius: '6px',
                img: {
                  borderRadius: '2px'
                }
              }}
            >
              <BlurImage alt={row?.name} src={row?.image?.url} layout="fill" objectFit="cover" />
            </Box>
          )}
          <Typography variant="subtitle2" noWrap>
            {isLoading ? <Skeleton variant="text" width={120} sx={{ ml: 1 }} /> : row?.name}
          </Typography>
        </Box>
      </TableCell>
      {/* <TableCell>
        <Skeleton variant="text" />
      </TableCell> */}
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{row?.sku || '-'}</>}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : <>{fDateShort(row?.createdAt, enUS)}</>}</TableCell>
  
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant="filled"
            sx={{
              bgcolor:
                !row?.available ||
                (row?.available < 1 && 'error.light') ||
                (row?.available < 20 && 'warning.light') ||
                (row?.available >= 20 && 'success.light') ||
                'primary.light',
              color:
                !row?.available ||
                (row?.available < 1 && 'error.dark') ||
                (row?.available < 20 && 'warning.dark') ||
                (row?.available >= 20 && 'success.dark') ||
                'primary.dark'
            }}
          >
            {(row?.available < 1 && 'Out of stock') ||
              (row?.available < 20 && 'Low stock') ||
              (row?.available >= 20 && 'In stock') ||
              (!row?.available && 'Out of stock')}
          </Label>
        )}
      </TableCell>
      <TableCell align="left">
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Rating name="text-feedback" size="small" value={row?.averageRating || 0} readOnly precision={0.5} />
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row?.priceSale || row?.price)}</TableCell>
      {/* <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Switch
            {...label}
            defaultChecked={row.isFeatured}
            onChange={() => {
              mutate({
                isFeatured: !row.isFeatured,
                id: row._id,
              });
            }}
          />
        )}
      </TableCell> */}
      <TableCell align="right">
        {isLoading ? (
          <Stack direction="row" justifyContent="flex-end">
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
            <Skeleton variant="circular" width={34} height={34} />
          </Stack>
        ) : (
          <Stack direction="row" justifyContent="flex-end">
            <Link target="_blank" href={`/product/${row.slug}`}>
              <IconButton>
                <IoEye />
              </IconButton>
            </Link>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/dashboard/products/${row.slug}`)}>
                <MdEdit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={handleClickOpen(row.slug)}>
                <MdDelete />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
ProductRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.object.isRequired,
    createdAt: PropTypes.instanceOf(Date).isRequired,
    available: PropTypes.number,
    averageRating: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    price: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired
  }).isRequired,
  handleClickOpen: PropTypes.func.isRequired
};
