'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { Form, FormikProvider, useFormik } from 'formik';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Typography,
  TextField
} from '@mui/material';
import * as api from 'src/services';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';
import axios from 'axios';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function BulkUploadProductForm() {
  const router = useRouter();

  const BulkUploadSchema = Yup.object().shape({
    csvFile: Yup.mixed()
      .required('A CSV file is required')
      .test(
        'fileType',
        'Unsupported File Format',
        (value) => value && ['text/csv'].includes(value.type)
      )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      csvFile: null
    },
    validationSchema: BulkUploadSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('csvFile', values.csvFile);

        const response = await api.bulkUploadProducts(formData);
        toast.success(response.message);
        router.push('/dashboard/products');
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || 'An error occurred during upload.');
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, isSubmitting } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    <LabelStyle component={'label'} htmlFor="csv-upload">
                      Upload CSV File
                    </LabelStyle>
                    <TextField
                      id="csv-upload"
                      type="file"
                      fullWidth
                      inputProps={{ accept: '.csv' }}
                      onChange={(event) => {
                        setFieldValue('csvFile', event.currentTarget.files[0]);
                      }}
                      error={Boolean(touched.csvFile && errors.csvFile)}
                      helperText={touched.csvFile && errors.csvFile}
                    />
                  </div>
                </Stack>
              </Card>

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Upload Products
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
} 