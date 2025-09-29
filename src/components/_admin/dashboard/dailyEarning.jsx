// mui
import { alpha } from '@mui/material/styles';
import { Box, Card, Typography, Button, Skeleton } from '@mui/material';
// icon
import { FaFileInvoiceDollar } from 'react-icons/fa6';

// utils
import { fCurrency } from 'src/utils/formatNumber';

import PropTypes from 'prop-types';

DailyEaring.propTypes = {
  data: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isLoading: PropTypes.bool.isRequired
};

export default function DailyEaring({ data, isLoading }) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 1,
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
        border: (theme) => `1px solid ${theme.palette.primary.main}!important`
      }}
    >
      <>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">
            {isLoading ? <Skeleton variant="text" width="100px" /> : 'Daily Earning'}
          </Typography>
          <Typography variant="h3">
            {isLoading ? <Skeleton variant="text" width="100px" /> : fCurrency(data)}
          </Typography>
        </Box>
        <Button
          sx={{
            display: 'block',
            minWidth: 50,
            lineHeight: 0,
            minHeight: 50,
            padding: 0,
            background: (theme) => alpha(theme.palette.primary.main, 0.9) + '!important'
          }}
          variant="contained"
          color="primary"
        >
          <FaFileInvoiceDollar size={24} />
        </Button>
      </>
    </Card>
  );
}
