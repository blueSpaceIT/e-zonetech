'use client';
import React, { useState } from 'react';
import { useMutation } from 'react-query';

// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Stack,
  TextField,
  Typography,
  Box,
  Select,
  FormControl,
  FormHelperText,
  Grid,
  Skeleton,
  InputAdornment
} from '@mui/material';
// components
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
// next
import { useRouter } from 'next/navigation';
// yup
import * as Yup from 'yup';
// axios
import axios from 'axios';
// toast
import toast from 'react-hot-toast';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
// api
import * as api from 'src/services';
import PropTypes from 'prop-types';

BannerForm.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
};

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5
}));

const STATUS_OPTIONS = ['active', 'inactive'];

export default function BannerForm({ data: currentBanner, isLoading: bannerLoading }) {
  const router = useRouter();

  const [state, setstate] = useState({
    loading: false,
    name: '',
    search: '',
    open: false
  });

  const { mutate, isLoading } = useMutation(
    currentBanner ? 'update' : 'new',
    currentBanner 
      ? (data) => api.updateBanner(currentBanner._id, data)
      : api.createBanner,
    {
      ...(currentBanner && {
        enabled: Boolean(currentBanner)
      }),
      retry: false,
      onSuccess: (data) => {
        toast.success(data.message);
        router.push('/dashboard/banners');
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      }
    }
  );

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const NewBannerSchema = Yup.object().shape({
    cover: Yup.mixed().required('Cover image is required')
  });

  const formik = useFormik({
    initialValues: {
      heading: currentBanner?.heading || '',
      description: currentBanner?.description || '',
      cover: currentBanner?.cover || null,
      color: currentBanner?.color || '#FBCA66',
      order: currentBanner?.order || 0,
      status: currentBanner?.status || STATUS_OPTIONS[0],
      btnPrimaryText: currentBanner?.btnPrimary?.btnText || '',
      btnPrimaryUrl: currentBanner?.btnPrimary?.url || '',
      btnSecondaryText: currentBanner?.btnSecondary?.btnText || '',
      btnSecondaryUrl: currentBanner?.btnSecondary?.url || '',
      file: currentBanner?.cover || ''
    },
    enableReinitialize: true,
    validationSchema: NewBannerSchema,
    onSubmit: async (values) => {
      const { btnPrimaryText, btnPrimaryUrl, btnSecondaryText, btnSecondaryUrl, file, ...rest } = values;
      
      const payload = {
        ...rest
      };

      // Add primary button only if both text and URL are provided
      if (btnPrimaryText && btnPrimaryUrl) {
        payload.btnPrimary = {
          btnText: btnPrimaryText,
          url: btnPrimaryUrl
        };
      }

      // Add secondary button only if both text and URL are provided
      if (btnSecondaryText && btnSecondaryUrl) {
        payload.btnSecondary = {
          btnText: btnSecondaryText,
          url: btnSecondaryUrl
        };
      }

      try {
        mutate(payload);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleDrop = async (acceptedFiles) => {
    setstate({ ...state, loading: 2 });
    const file = acceptedFiles[0];
    if (file) {
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      });
    }
    setFieldValue('file', file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads');
    const config = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentage = Math.floor((loaded * 100) / total);
        setstate({ ...state, loading: percentage });
      }
    };
    await axios
      .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData, config)
      .then(({ data }) => {
        setFieldValue('cover', {
          _id: data.public_id,
          url: data.secure_url
        });
        setstate({ ...state, loading: false });
      })
      .then(() => {
        if (values.file && values.cover?._id) {
          deleteMutate(values.cover._id);
        }
        setstate({ ...state, loading: false });
      });
  };

  return (
    <Box position="relative">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="banner-heading">
                        Banner Heading
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="banner-heading"
                        fullWidth
                        {...getFieldProps('heading')}
                        error={Boolean(touched.heading && errors.heading)}
                        helperText={touched.heading && errors.heading}
                      />
                    )}
                  </div>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="description">
                        Description
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={120} />
                    ) : (
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        id="description"
                        {...getFieldProps('description')}
                        error={Boolean(touched.description && errors.description)}
                        helperText={touched.description && errors.description}
                      />
                    )}
                  </div>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="color">
                        Color
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        fullWidth
                        id="color"
                        type="color"
                        {...getFieldProps('color')}
                        error={Boolean(touched.color && errors.color)}
                        helperText={touched.color && errors.color}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  backgroundColor: values.color,
                                  border: '1px solid',
                                  borderColor: 'divider'
                                }}
                              />
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  </div>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="order">
                        Order
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        fullWidth
                        id="order"
                        type="number"
                        {...getFieldProps('order')}
                        error={Boolean(touched.order && errors.order)}
                        helperText={touched.order && errors.order}
                      />
                    )}
                  </div>

                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Primary Button
                  </Typography>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="btn-primary-text">
                        Button Text
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="btn-primary-text"
                        fullWidth
                        {...getFieldProps('btnPrimaryText')}
                        error={Boolean(touched.btnPrimaryText && errors.btnPrimaryText)}
                        helperText={touched.btnPrimaryText && errors.btnPrimaryText}
                      />
                    )}
                  </div>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="btn-primary-url">
                        Button URL
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        fullWidth
                        id="btn-primary-url"
                        {...getFieldProps('btnPrimaryUrl')}
                        error={Boolean(touched.btnPrimaryUrl && errors.btnPrimaryUrl)}
                        helperText={touched.btnPrimaryUrl && errors.btnPrimaryUrl}
                      />
                    )}
                  </div>

                  <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                    Secondary Button (Optional)
                  </Typography>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="btn-secondary-text">
                        Button Text
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="btn-secondary-text"
                        fullWidth
                        {...getFieldProps('btnSecondaryText')}
                        error={Boolean(touched.btnSecondaryText && errors.btnSecondaryText)}
                        helperText={touched.btnSecondaryText && errors.btnSecondaryText}
                      />
                    )}
                  </div>

                  <div>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={100} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="btn-secondary-url">
                        Button URL
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        fullWidth
                        id="btn-secondary-url"
                        {...getFieldProps('btnSecondaryUrl')}
                        error={Boolean(touched.btnSecondaryUrl && errors.btnSecondaryUrl)}
                        helperText={touched.btnSecondaryUrl && errors.btnSecondaryUrl}
                      />
                    )}
                  </div>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <div>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      {bannerLoading ? (
                        <Skeleton variant="text" width={150} />
                      ) : (
                        <LabelStyle variant="body1" component={'label'} color="text.primary">
                          Banner Image
                        </LabelStyle>
                      )}
                      {bannerLoading ? (
                        <Skeleton variant="text" width={150} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="file">
                          <span>Recommended: 1200 x 600</span>
                        </LabelStyle>
                      )}
                    </Stack>
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={225} />
                    ) : (
                      <UploadSingleFile
                        id="file"
                        file={values.cover}
                        onDrop={handleDrop}
                        error={Boolean(touched.cover && errors.cover)}
                        accept="image/*"
                        loading={state.loading}
                      />
                    )}
                    {touched.cover && errors.cover && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.cover && errors.cover}
                      </FormHelperText>
                    )}
                  </div>

                  <FormControl fullWidth sx={{ select: { textTransform: 'capitalize' } }}>
                    {bannerLoading ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="status">
                        Status
                      </LabelStyle>
                    )}
                    {bannerLoading ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <Select
                        id="status"
                        native
                        {...getFieldProps('status')}
                        error={Boolean(touched.status && errors.status)}
                      >
                        <option value="" style={{ display: 'none' }} />
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </Select>
                    )}
                    {touched.status && errors.status && (
                      <FormHelperText error sx={{ px: 2, mx: 0 }}>
                        {touched.status && errors.status}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Card>
              
              {bannerLoading ? (
                <Skeleton variant="rectangular" width="100%" height={56} />
              ) : (
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size="large"
                  loading={isLoading}
                  sx={{ ml: 'auto', mt: 3, width: '100%' }}
                >
                  {currentBanner ? 'Update Banner' : 'Create Banner'}
                </LoadingButton>
              )}
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Box>
  );
}
