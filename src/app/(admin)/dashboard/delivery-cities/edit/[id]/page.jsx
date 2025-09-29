"use client";
import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import DeliveryCityForm from 'src/components/forms/deliveryCity';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import toast from 'react-hot-toast';

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const { data, isLoading } = useQuery(['delivery-city', id], () => api.getDeliveryCityByAdmin(id), {
    enabled: Boolean(id),
    onError: (err) => toast.error(err?.response?.data?.message || 'Could not load delivery city')
  });

  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Edit Delivery City"
          links={[
            {
              name: 'Dashboard',
              href: '/'
            },
            {
              name: 'Delivery Cities',
              href: '/dashboard/delivery-cities'
            },
            {
              name: 'Edit delivery city'
            }
          ]}
        />
      </Toolbar>
      <DeliveryCityForm data={data?.data} isLoading={isLoading} />
    </div>
  );
}
