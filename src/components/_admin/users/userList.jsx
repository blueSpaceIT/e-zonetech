'use client';
import React, { useState } from 'react';

// toast
import toast from 'react-hot-toast';
// api
import * as api from 'src/services';
// react
import { useQuery } from 'react-query';
import { useMutation } from 'react-query';
// component
import Table from 'src/components/table/table';
import UserListCard from 'src/components/cards/usersList';
import UserList from 'src/components/table/rows/usersList';
import RoleDialog from 'src/components/dialog/role';

// next
import { useSearchParams } from 'next/navigation';

const TABLE_HEAD = [
  { id: 'name', label: 'User', alignRight: false, sort: true },
  { id: 'email', label: 'Email', alignRight: false, sort: true },
  { id: 'phone', label: 'phone', alignRight: false, sort: false },
  { id: 'orders', label: 'Orders', alignRight: false, sort: true },
  { id: 'role', label: 'Role', alignRight: false, sort: true },
  { id: 'joined', label: 'Joined', alignRight: false, sort: true },

  { id: '', label: 'Actions', alignRight: true }
];

export default function AdminProducts() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const [count, setCount] = useState(0);

  const { data, isLoading } = useQuery(
    ['user', pageParam, searchParam, count],
    () => api.getUsers(+pageParam || 1, searchParam || '', 'user'),
    {
      onError: (err) => {
        toast.error(err.response.data.message || 'Something went wrong!');
      }
    }
  );
  const [id, setId] = useState(null);

  const { mutate, isLoading: roleLoading } = useMutation(api.updateUserRole, {
    onSuccess: (data) => {
      toast.success(data.message);
      setCount((prev) => prev + 1);
      setId(null);
    },
    onError: (err) => {
      toast.error(err.response.data.message);
      setId(null);
    }
  });

  return (
    <>
      <RoleDialog open={Boolean(id)} onClose={() => setId(null)} onClick={() => mutate(id)} loading={roleLoading} />
      <Table
        headData={TABLE_HEAD}
        data={data}
        mobileRow={UserListCard}
        isLoading={isLoading}
        row={UserList}
        setId={setId}
        id={setId}
      />
    </>
  );
}
