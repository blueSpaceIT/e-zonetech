'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-query';
// mui
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Typography, Box, Select, FormControl, FormHelperText, Grid, Skeleton } from '@mui/material';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
// next
import { useRouter } from 'next/navigation';
// api
import * as api from 'src/services';
// toast
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['active', 'inactive'];

DeliveryCityForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

export default function DeliveryCityForm({ data: current = null, isLoading: cityLoading = false }) {
  const router = useRouter();

  const mutation = useMutation(current ? api.updateDeliveryCity : api.addDeliveryCity, {
    onSuccess: (res) => {
      toast.success(res.message || 'Saved');
      router.push('/dashboard/delivery-cities');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  });

  const CitySchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    deliveryTime: Yup.number().typeError('Delivery time must be a number').required('Delivery time is required')
  });

  const formik = useFormik({
    initialValues: {
      name: current?.name || '',
      deliveryTime: current?.deliveryTime ?? '',
      status: current?.status || STATUS_OPTIONS[0]
    },
    enableReinitialize: true,
    validationSchema: CitySchema,
    onSubmit: (values) => {
      if (current) {
        mutation.mutate({ id: current._id, ...values });
      } else {
        mutation.mutate(values);
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps } = formik;

  if (cityLoading) {
    return (
      <Card sx={{ p: 3 }}>
        <Skeleton variant="text" width={140} />
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mt: 2 }} />
      </Card>
    );
  }

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Name
                    </Typography>
                    <TextField fullWidth {...getFieldProps('name')} error={Boolean(touched.name && errors.name)} helperText={touched.name && errors.name} />
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Delivery Time (days)
                    </Typography>
                    <TextField fullWidth type="number" {...getFieldProps('deliveryTime')} error={Boolean(touched.deliveryTime && errors.deliveryTime)} helperText={touched.deliveryTime && errors.deliveryTime} />
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <div style={{ position: 'sticky', top: 0 }}>
                <Stack spacing={3}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <FormControl fullWidth>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Status
                        </Typography>
                        <Select native {...getFieldProps('status')}>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                        {touched.status && errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
                      </FormControl>
                    </Stack>
                  </Card>

                  <LoadingButton type="submit" variant="contained" size="large" loading={mutation.isLoading}>
                    {current ? 'Update City' : 'Create City'}
                  </LoadingButton>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
