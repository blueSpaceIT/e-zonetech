import { merge } from 'lodash';
import PropTypes from 'prop-types';
// chart
import ReactApexChart from 'react-apexcharts';
// mui
import { Card, CardHeader, Box, Skeleton } from '@mui/material';
// components
import BaseOptionChart from './BaseOptionChart';

export default function ProfitLossReport({ revenue = [], expenses = [], profit = [], labels = [], isLoading = false }) {
  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2
    },
    xaxis: {
      categories: labels && labels.length ? labels : ['No Data']
    },
    tooltip: {
      y: {
        formatter: (val) => val
      }
    },
    yaxis: {
      opposite: false,
      labels: {
        formatter: function (val) {
          return val.toFixed(0);
        }
      }
    }
  });

  return (
    <Card sx={{ pb: 1.5 }}>
      <CardHeader title={'Profit & Loss'} />

      {isLoading ? (
        <Box mx={3}>
          <Skeleton variant="rectangular" width="100%" height={219} sx={{ borderRadius: 2, mt: 3 }} />
        </Box>
      ) : (
        <Box sx={{ mt: 3, mx: 3 }} dir="ltr">
          <ReactApexChart
            type="line"
            series={[
              { name: 'Revenue', data: revenue },
              { name: 'Expenses', data: expenses },
              { name: 'Profit', data: profit }
            ]}
            options={chartOptions}
            height={320}
          />
        </Box>
      )}
    </Card>
  );
}

ProfitLossReport.propTypes = {
  revenue: PropTypes.array,
  expenses: PropTypes.array,
  profit: PropTypes.array,
  labels: PropTypes.array,
  isLoading: PropTypes.bool
};
