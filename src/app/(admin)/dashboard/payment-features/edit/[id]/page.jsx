"use client";
import React from 'react';
import Toolbar from 'src/components/_admin/toolbar';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import PaymentFeatureForm from 'src/components/forms/paymentFeature';
import { useParams } from 'next/navigation';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import toast from 'react-hot-toast';

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const { data, isLoading } = useQuery(['payment-feature', id], () => api.getPaymentFeature(id), {
    enabled: Boolean(id),
    retry: false,
    onError: (err) => toast.error(err?.response?.data?.message || 'Could not load payment feature')
  });

  return (
    <div>
      <Toolbar>
        <HeaderBreadcrumbs
          admin
          heading="Edit Payment Feature"
          links={[
            { name: 'Dashboard', href: '/' },
            { name: 'Payment features', href: '/dashboard/payment-features' },
            { name: 'Edit Payment Feature' }
          ]}
        />
      </Toolbar>
      <PaymentFeatureForm data={data?.data} isLoading={isLoading} />
    </div>
  );
}
