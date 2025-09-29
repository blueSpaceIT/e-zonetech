import { merge } from 'lodash';
import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// mui
import { Card, CardHeader, Box, Tabs, Tab, Skeleton, useMediaQuery, useTheme } from '@mui/material';
// components
import BaseOptionChart from './BaseOptionChart';
// utils
import { fCurrency } from 'src/utils/formatNumber';

export default function IncomeChart({ data, isLoading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [seriesData, setSeriesData] = useState('week');
  const pastWeek = [...Array(7).keys()].map((days) =>
    new Date(Date.now() - 86400000 * days).toLocaleString('en-us', {
      weekday: 'short'
    })
  );
  const handleChange = (event, newValue) => {
    setSeriesData(newValue);
  };
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: seriesData === 'week' ? pastWeek.reverse() : seriesData === 'year' ? month : null
    },
    yaxis: [
      {
        labels: {
          formatter: function (val) {
            return fCurrency(val);
          }
        }
      }
    ]
  });

  return (
    <Card>
      <CardHeader
        title={'Income Report'}
        action={
          <Tabs
            value={seriesData}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label="secondary tabs example"
            sx={{
              '& .MuiButtonBase-root:not(:last-of-type)': {
                marginRight: '1rem'
              }
            }}
          >
            <Tab value="week" label={'Week'} />
            <Tab value="month" label={'Month'} />
            <Tab value="year" label={'Year'} />
          </Tabs>
        }
        sx={{ flexWrap: 'wrap' }}
      />
      <Box sx={{ mt: 3, mx: 3 }}>
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width="100%" height={isMobile ? 260 : 360} sx={{ borderRadius: 2 }} />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1,
                mb: 3
              }}
            >
              <Skeleton variant="text" sx={{ width: 40 }} />
              <Skeleton variant="text" sx={{ width: 40 }} />
              <Skeleton variant="text" sx={{ width: 40 }} />
              <Skeleton variant="text" sx={{ width: 40 }} />
              <Skeleton variant="text" sx={{ width: 40 }} />
              <Skeleton variant="text" sx={{ width: 40 }} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              '.apexcharts-canvas': {
                width: '100% !important',
                overflow: 'hidden',
                position: 'relative'
              }
            }}
          >
            <ReactApexChart
              type="area"
              series={[
                {
                  name: 'income',
                  data: data[seriesData]
                }
              ]}
              options={chartOptions}
              height={isMobile ? 260 : 400}
            />
          </Box>
        )}
      </Box>
    </Card>
  );
}
IncomeChart.propTypes = {
  data: PropTypes.shape({
    week: PropTypes.array,
    month: PropTypes.array,
    year: PropTypes.array
  }),
  isLoading: PropTypes.bool.isRequired
};
