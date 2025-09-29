'use client';
import React from 'react';
import * as Yup from 'yup';
import { FormikProvider, useFormik, Form } from 'formik';
import { LoadingButton } from '@mui/lab';
import { Card, Stack, TextField, Paper, Typography, FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import axios from 'axios';
import TiptapEditor from 'src/components/editor/TiptapEditor';
import * as api from 'src/services';
import { useMutation } from 'react-query';
import { useRouter } from 'next-nprogress-bar';

const PaymentFeatureSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required')
});

export default function PaymentFeatureForm({ current = null, data = null, isLoading = false }) {
  const router = useRouter();
  // prefer data prop (from query) over current prop
  const currentData = data || current;
  const isEdit = Boolean(currentData);

  const { mutate, isLoading: isMutating } = useMutation(
    isEdit ? (payload) => api.updatePaymentFeature(currentData._id, payload) : (payload) => api.createPaymentFeature(payload),
    {
      onSuccess: (data) => {
        toast.success(data.message || 'Success');
        router.back();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Something went wrong');
      }
    }
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentData?.name || '',
      description: currentData?.description || ''
    },
    validationSchema: PaymentFeatureSchema,
    onSubmit: (values) => {
      mutate(values);
    }
  });

  const { values, touched, errors, handleSubmit, setFieldValue, getFieldProps } = formik;

  const uploadDescriptionImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my-uploads');
      const res = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
      return res.data && res.data.secure_url;
    } catch (err) {
      console.error('Failed to upload description image', err);
      throw err;
    }
  };

  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <div>
                <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 2.5 }}>Name</Typography>
                <TextField fullWidth {...getFieldProps('name')} error={Boolean(touched.name && errors.name)} helperText={touched.name && errors.name} />
              </div>

              <div>
                <Typography variant="subtitle2" color="text.secondary" sx={{ lineHeight: 2.5 }}>Description</Typography>
                <Paper sx={{ p: 2, mt: 1 }}>
                  <TiptapEditor
                    value={values.description}
                    onChange={(html) => setFieldValue('description', html)}
                    uploadImage={uploadDescriptionImage}
                    placeholder="Add rich description... you can insert links and images"
                  />
                </Paper>
                {touched.description && errors.description && <FormHelperText error>{errors.description}</FormHelperText>}
              </div>

              <LoadingButton type="submit" variant="contained" loading={isMutating}>
                {isEdit ? 'Update Payment Feature' : 'Create Payment Feature'}
              </LoadingButton>
            </Stack>
          </Card>
        </Form>
      </FormikProvider>
    </Stack>
  );
}

PaymentFeatureForm.propTypes = {
  current: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string
  })
  ,
  data: PropTypes.object,
  isLoading: PropTypes.bool
};
