'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Box, Dialog } from '@mui/material';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Table from 'src/components/table/table';
import AdminCard from 'src/components/cards/adminList';
import AdminRow from 'src/components/table/rows/adminList';
import RoleDialog from 'src/components/dialog/role';
import DeleteDialog from 'src/components/dialog/delete';

export const TABLE_HEAD = [
  { id: 'name', label: 'Admin', alignRight: false, sort: true },
  { id: 'email', label: 'Email', alignRight: false, sort: true },
  { id: 'phone', label: 'Phone', alignRight: false, sort: false },
  { id: 'role', label: 'Role', alignRight: false, sort: true },
  { id: 'joined', label: 'Joined', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminsList() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [apiCall, setApiCall] = useState({ apicall: false });

  const { data, isLoading } = useQuery(['admins', count, apiCall.apicall], () => api.getUsers(1, ''), {
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  });

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleEditClick = (id) => {
    router.push(`/dashboard/admin/edit/${id}`);
  };

  // Filter for admin roles: admin, manager, accountant
  const allowedRoles = ['admin', 'manager', 'accountant'];
  const admins = data?.data 
    ? { 
        data: data.data.filter((u) => allowedRoles.includes(u.role)), 
        count: data.count 
      } 
    : { data: [], count: 0 };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push('/dashboard/admin/add')}
        >
          Add New Admin
        </Button>
      </Box>
      <Table 
        headData={TABLE_HEAD} 
        data={admins} 
        mobileRow={AdminCard} 
        isLoading={isLoading} 
        row={(props) => (
          <AdminRow 
            {...props} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
      />
      
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DeleteDialog
          onClose={() => setDeleteOpen(false)}
          id={deleteId}
          apicall={setApiCall}
          endPoint="userDelete"
          type="Admin deleted successfully"
          deleteMessage="Are you sure you want to delete this admin? This action cannot be undone."
        />
      </Dialog>
    </Box>
  );
}
