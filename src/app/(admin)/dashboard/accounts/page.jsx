'use client';
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useQuery } from 'react-query';
import SalesReport from 'src/components/charts/SalesReport';
import * as api from 'src/services';
import ProfitLossReport from 'src/components/charts/ProfitLossReport';

function AddEntryModal({ open, onClose, onCreate }) {
  const [reason, setReason] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = React.useState('income');

  const handleSubmit = async () => {
    if (!reason || !amount || !date) {
      alert('Please fill all fields');
      return;
    }
    const payload = { reason, amount: Number(amount), date, type };
    await onCreate(payload);
  };

  return (
    <div>
      {open ? (
        <Paper sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1400 }}>
          <Card sx={{ width: 500, p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                <TextField label="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
                  <MenuItem value="income">Income</MenuItem>
                  <MenuItem value="expense">Expense</MenuItem>
                </TextField>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button variant="contained" onClick={handleSubmit}>
                    Create
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Paper>
      ) : null}
    </div>
  );
}

export default function AccountsPage() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [startDate, setStartDate] = React.useState('2025-08-01');
  const [endDate, setEndDate] = React.useState('2025-08-16');
  const [granularity, setGranularity] = React.useState('day');

  const { data, isLoading, refetch } = useQuery(
    ['sales-report', startDate, endDate, granularity],
    () => api.getSalesReport({ startDate, endDate, granularity }),
    {
      enabled: true,
      keepPreviousData: true,
      onError: (err) => console.error(err)
    }
  );

  const [downloading, setDownloading] = React.useState(false);

  const {
    data: profit,
    isLoading: profitIsLoading,
    refetch: refetchProfit
  } = useQuery(
    ['profit-loss-report', startDate, endDate, granularity],
    () => api.getProfitLossReport({ startDate, endDate, granularity }),
    {
      enabled: true,
      keepPreviousData: true,
      onError: (err) => console.error(err)
    }
  );

  const labels = data?.data?.labels || [];
  const values = data?.data?.values || [];
  const total = data?.data?.total || 0;
  const profitData = profit?.data || null;

  const {
    data: customEntriesData,
    isLoading: customEntriesLoading,
    refetch: refetchCustomEntries
  } = useQuery(['custom-entries'], () => api.getCustomEntries(), { enabled: true });

  const customEntries = customEntriesData?.data || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField select size="small" value={granularity} onChange={(e) => setGranularity(e.target.value)}>
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </TextField>
        <Button
          variant="contained"
          disabled={downloading}
          onClick={async () => {
            try {
              setDownloading(true);
              const blob = await api.getReportDownload({ startDate, endDate, granularity });
              const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
              const a = document.createElement('a');
              a.href = url;
              a.download = `report_${startDate}_${endDate}_${granularity}.pdf`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error(err);
              alert('Download failed');
            } finally {
              setDownloading(false);
            }
          }}
        >
          {downloading ? 'Downloading...' : 'Download Report'}
        </Button>
      </Box>

      <Grid container spacing={3}>
  <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="Granularity"
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value)}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  onClick={() => {
                    refetch();
                    refetchProfit();
                  }}
                >
                  Apply
                </Button>
                <Box sx={{ ml: 'auto', fontWeight: 600 }}>
                  Total: {total}
                </Box>
              </Box>

              <SalesReport values={values} labels={labels} isLoading={isLoading} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  select
                  label="Granularity"
                  value={granularity}
                  onChange={(e) => setGranularity(e.target.value)}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </TextField>
                <Button variant="contained" onClick={() => refetchProfit()}>
                  Apply
                </Button>
                <Box sx={{ ml: 'auto', fontWeight: 600 }}>
                  Revenue: {profitData?.totals?.revenue || 0} • Expenses: {profitData?.totals?.expenses || 0} • Profit: {profitData?.totals?.profit || 0}
                </Box>
              </Box>

              <ProfitLossReport
                revenue={profitData?.revenue || []}
                expenses={profitData?.expenses || []}
                profit={profitData?.profit || []}
                labels={profitData?.labels || []}
                isLoading={profitIsLoading}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ fontWeight: 700 }}>Custom Income and Expense</Box>
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenAdd(true);
                  }}
                >
                  Add Entry
                </Button>
              </Box>

              {/* Add Entry Modal */}
              <AddEntryModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onCreate={async (payload) => {
                  try {
                    await api.createCustomEntry(payload);
                    await refetchCustomEntries();
                    setOpenAdd(false);
                  } catch (err) {
                    console.error(err);
                    alert('Create failed');
                  }
                }}
              />

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customEntries.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{row.type}</TableCell>
                        <TableCell>{row.reason}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                        <TableCell align="center">
                          <Button
                            color="error"
                            size="small"
                            onClick={async () => {
                              if (!confirm('Delete this entry?')) return;
                              try {
                                await api.deleteCustomEntry(row._id);
                                // refetch custom entries
                                await refetchCustomEntries();
                              } catch (err) {
                                console.error(err);
                                alert('Delete failed');
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
