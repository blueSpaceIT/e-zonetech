'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// toast
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import OrderList from 'src/components/table/rows/orderList';
import OrderListCard from 'src/components/cards/OrderList';
import DeleteDialog from 'src/components/dialog/delete';
import OrderPDF from 'src/components/_admin/orders/orderPdf';
// mui
import { 
  Dialog, 
  Box, 
  Card, 
  TextField, 
  MenuItem, 
  Button, 
  Stack, 
  Checkbox, 
  Typography,
  Chip,
  InputAdornment,
  Toolbar,
  alpha,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { IoSearchOutline, IoFunnelOutline, IoDownloadOutline, IoCloseOutline, IoTrashOutline } from 'react-icons/io5';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
const TABLE_HEAD = [
  { id: 'select', label: '', alignRight: false, width: '50px' },
  // Order number as the first data column
  { id: 'orderNo', label: 'Order No', alignRight: false, width: '140px' },
  { id: 'name', label: 'product', alignRight: false },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: 'price', label: 'price', alignRight: false, sort: true },
  { id: 'items', label: 'items', alignRight: false },
  { id: 'inventoryType', label: 'status', alignRight: false, sort: true },
  { id: '', label: 'actions', alignRight: true }
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'onHold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' },
];

export default function OrdersAdminList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const statusParam = searchParams.get('status');
  
  const [apicall, setApicall] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchValue, setSearchValue] = useState(searchParam || '');
  const [statusFilter, setStatusFilter] = useState(statusParam || '');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({ current: 0, total: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });
  const [searchInputValue, setSearchInputValue] = useState(searchParam || '');

  // Debounced search effect
  useEffect(() => {
    console.log('🕐 Search debounce effect triggered with:', searchInputValue);
    const timer = setTimeout(() => {
      console.log('⏰ Debounce timer fired, updating search value:', searchInputValue);
      setSearchValue(searchInputValue);
    }, 500); // 500ms debounce

    return () => {
      console.log('🚫 Clearing debounce timer');
      clearTimeout(timer);
    };
  }, [searchInputValue]);

  // Effect to trigger search when searchValue changes
  useEffect(() => {
    if (searchValue !== searchParam) {
      console.log('🔄 Search value changed, triggering URL update:', searchValue);
      handleSearch(searchValue);
    }
  }, [searchValue]);

  // Sync search input with URL parameter
  useEffect(() => {
    console.log('📡 URL search param changed:', searchParam);
    if (searchParam !== searchInputValue) {
      console.log('🔄 Syncing search input with URL param:', searchParam);
      setSearchInputValue(searchParam || '');
    }
  }, [searchParam]);

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (pageParam) queryParams.set('page', pageParam);
  if (searchValue) queryParams.set('search', searchValue);
  if (statusFilter) queryParams.set('status', statusFilter);

  console.log('=== SEARCH DEBUG INFO ===');
  console.log('pageParam:', pageParam);
  console.log('searchValue:', searchValue);
  console.log('statusFilter:', statusFilter);
  console.log('queryParams:', queryParams.toString());
  console.log('========================');

  const { data, isLoading: loadingList } = useQuery(
    ['orders', apicall, pageParam, searchValue, statusFilter],
    () => {
      console.log('🔍 API CALL - getOrders with parameters:');
      console.log('  - page:', +pageParam || 1);
      console.log('  - search:', searchValue || '');
      console.log('  - status:', statusFilter || '');
      console.log('  - Full API call: getOrders(' + (+pageParam || 1) + ', "' + (searchValue || '') + '", "' + (statusFilter || '') + '")');
      
      return api.getOrders(+pageParam || 1, searchValue || '', statusFilter || '');
    },
    {
      onError: (err) => {
        console.error('❌ API Error:', err);
        console.error('Error response:', err.response?.data);
        toast.error(err.response?.data?.message || 'Something went wrong!');
      },
      onSuccess: (data) => {
        console.log('✅ API Success - Orders received:', data);
        console.log('  - Total orders:', data?.data?.length || 0);
        console.log('  - Current page:', data?.page);
        console.log('  - Total pages:', data?.totalPages);
        setSelectedOrders([]);
        setSelectAll(false);
      }
    }
  );

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  // Handle URL updates
  const updateURL = (newParams) => {
    console.log('🔄 Updating URL with params:', newParams);
    const url = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        console.log(`  Setting ${key} = ${value}`);
        url.set(key, value);
      } else {
        console.log(`  Removing ${key}`);
        url.delete(key);
      }
    });
    url.delete('page'); // Reset to page 1 when filtering
    console.log('  Final URL params:', url.toString());
    router.push(`?${url.toString()}`);
  };

  // Handle search (with debouncing)
  const handleSearchInput = (value) => {
    console.log('⌨️ Search input changed to:', value);
    setSearchInputValue(value);
  };

  // Handle search (actual API call trigger)
  const handleSearch = (value) => {
    console.log('🔍 Search triggered with value:', value);
    updateURL({ search: value, status: statusFilter });
  };

  // Handle status filter
  const handleStatusFilter = (status) => {
    console.log('🏷️ Status filter triggered with value:', status);
    setStatusFilter(status);
    updateURL({ search: searchValue, status });
  };

  // Handle individual order selection
  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
      setSelectAll(false);
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedOrders(data?.data?.map(order => order._id) || []);
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle bulk invoice download
  const handleBulkDownload = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to download invoices');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress({ current: 0, total: selectedOrders.length });
    let downloadedCount = 0;
    
    try {
      toast(`Starting download of ${selectedOrders.length} invoice${selectedOrders.length > 1 ? 's' : ''}...`);
      
      for (let i = 0; i < selectedOrders.length; i++) {
        const orderId = selectedOrders[i];
        try {
          console.log(`Processing order ${i + 1}/${selectedOrders.length}: ${orderId}`);
          
          // Fetch complete order details
          const orderResponse = await api.getOrderByAdmin(orderId);
          
          // Handle response data structure
          const orderData = orderResponse?.data || orderResponse;
          
          if (!orderData) {
            throw new Error('No order data received from API');
          }
          
          console.log(`Order data received for ${orderData._id || orderId}, generating PDF...`);
          
          // Generate PDF using the same method as the working single download
          const pdfDoc = pdf(<OrderPDF data={orderData} />);
          const blob = await pdfDoc.toBlob();
          
          console.log(`PDF blob generated, size: ${blob.size} bytes`);
          
          // Create and trigger download
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `INVOICE-${orderData._id || orderId}.pdf`;
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          downloadedCount++;
          setDownloadProgress({ current: downloadedCount, total: selectedOrders.length });
          
          console.log(`Successfully downloaded invoice ${downloadedCount}/${selectedOrders.length}`);
          
          // Add delay between downloads to prevent browser blocking
          if (i < selectedOrders.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
          
        } catch (error) {
          console.error(`Error downloading invoice for order ${orderId}:`, error);
          const errorMessage = error.message || 'Unknown error occurred';
          toast.error(`Failed to download invoice for order ${orderId}: ${errorMessage}`);
        }
      }
      
      if (downloadedCount > 0) {
        toast.success(`Successfully downloaded ${downloadedCount} out of ${selectedOrders.length} invoice${selectedOrders.length > 1 ? 's' : ''}`);
      } else {
        toast.error('No invoices were downloaded successfully');
      }
      
      setSelectedOrders([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Bulk download error:', error);
      toast.error(`Bulk download failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDownloading(false);
      setDownloadProgress({ current: 0, total: 0 });
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to delete');
      return;
    }

    setConfirmBulkDelete(true);
  };

  // Execute bulk delete after confirmation
  const executeBulkDelete = async () => {
    setConfirmBulkDelete(false);

    setIsDeleting(true);
    setDeleteProgress({ current: 0, total: selectedOrders.length });
    let deletedCount = 0;

    try {
      toast(`Starting deletion of ${selectedOrders.length} order${selectedOrders.length > 1 ? 's' : ''}...`);

      for (let i = 0; i < selectedOrders.length; i++) {
        const orderId = selectedOrders[i];
        try {
          console.log(`Deleting order ${i + 1}/${selectedOrders.length}: ${orderId}`);

          // Delete the order using the existing API
          await api.deleteOrder(orderId);

          deletedCount++;
          setDeleteProgress({ current: deletedCount, total: selectedOrders.length });

          console.log(`Successfully deleted order ${deletedCount}/${selectedOrders.length}`);

          // Add a small delay between deletions to prevent overwhelming the server
          if (i < selectedOrders.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }

        } catch (error) {
          console.error(`Error deleting order ${orderId}:`, error);
          const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
          toast.error(`Failed to delete order ${orderId}: ${errorMessage}`);
        }
      }

      if (deletedCount > 0) {
        toast.success(`Successfully deleted ${deletedCount} out of ${selectedOrders.length} order${selectedOrders.length > 1 ? 's' : ''}`);
        // Trigger a refetch of the data
        setApicall(prev => !prev);
      } else {
        toast.error('No orders were deleted successfully');
      }

      setSelectedOrders([]);
      setSelectAll(false);
    } catch (error) {
      console.error('Bulk delete error:', error);
      toast.error(`Bulk delete failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
      setDeleteProgress({ current: 0, total: 0 });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchValue('');
    setStatusFilter('');
    router.push('/dashboard/orders');
  };

  const handleClickOpen = (props) => () => {
    setId(props);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const isLoading = loadingList;
  const hasFilters = searchValue || statusFilter;

  return (
    <>
      {/* Filters and Actions */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Stack spacing={2}>
          {/* Search and Status Filter Row */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search by name, phone, or email..."
              value={searchInputValue}
              onChange={(e) => {
                console.log('⌨️ Search input changed:', e.target.value);
                setSearchInputValue(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IoSearchOutline />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { md: 400 } }}
            />
            
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              sx={{ minWidth: 150 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IoFunnelOutline />
                  </InputAdornment>
                ),
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {hasFilters && (
              <Button
                variant="outlined"
                startIcon={<IoCloseOutline />}
                onClick={clearFilters}
                sx={{ minWidth: 'fit-content' }}
              >
                Clear Filters
              </Button>
            )}
          </Stack>

          {/* Active Filters Display */}
          {hasFilters && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {searchValue && (
                <Chip
                  label={`Search: ${searchValue}`}
                  onDelete={() => handleSearch('')}
                  size="small"
                />
              )}
              {statusFilter && (
                <Chip
                  label={`Status: ${STATUS_OPTIONS.find(opt => opt.value === statusFilter)?.label}`}
                  onDelete={() => handleStatusFilter('')}
                  size="small"
                />
              )}
            </Stack>
          )}

          {/* Bulk Actions */}
          {selectedOrders.length > 0 && (
            <Box
              sx={{
                backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                borderRadius: 1,
                p: 2
              }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack spacing={0.5}>
                  <Typography variant="body2" color="primary.main">
                    {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                  </Typography>
                  {(isDownloading || isDeleting) && (
                    <Typography variant="caption" color="text.secondary">
                      {isDownloading && `Downloading invoices... (${downloadProgress.current}/${downloadProgress.total})`}
                      {isDeleting && `Deleting orders... (${deleteProgress.current}/${deleteProgress.total})`}
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={<IoDownloadOutline />}
                    onClick={handleBulkDownload}
                    disabled={isDownloading || isDeleting}
                    size="small"
                  >
                    {isDownloading 
                      ? `Downloading... (${downloadProgress.current}/${downloadProgress.total})` 
                      : 'Download Invoices'
                    }
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<IoTrashOutline />}
                    onClick={handleBulkDelete}
                    disabled={isDownloading || isDeleting}
                    size="small"
                  >
                    {isDeleting 
                      ? `Deleting... (${deleteProgress.current}/${deleteProgress.total})` 
                      : 'Delete Orders'
                    }
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSelectedOrders([]);
                      setSelectAll(false);
                    }}
                    size="small"
                  >
                    Clear Selection
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </Card>

      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteOrder"
          type={'Order deleted'}
        />
      </Dialog>
      
      {/* Bulk Delete Confirmation Dialog */}
      <Dialog 
        open={confirmBulkDelete} 
        onClose={() => setConfirmBulkDelete(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''}? 
            This action cannot be undone.
          </DialogContentText>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Selected orders: {selectedOrders.length}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmBulkDelete(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={executeBulkDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={<IoTrashOutline />}
          >
            {isDeleting ? 'Deleting...' : 'Delete Orders'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={OrderList}
        mobileRow={OrderListCard}
        handleClickOpen={handleClickOpen}
        selectedOrders={selectedOrders}
        selectAll={selectAll}
        onSelectOrder={handleSelectOrder}
        onSelectAll={handleSelectAll}
      />
    </>
  );
}
