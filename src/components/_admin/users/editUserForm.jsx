'use client';
import React from 'react';
import UserForm from 'src/components/forms/user';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import toast from 'react-hot-toast';

export default function EditUserForm({ id }) {
  const { data, isLoading } = useQuery(['get-user', id], () => api.getUser(id), {
    enabled: Boolean(id),
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to load user')
  });
  // API returns single user under `user` key
  const user = data?.user || null;

  return <UserForm initialValues={user} onSuccess={() => toast.success('Saved')} />;
}
