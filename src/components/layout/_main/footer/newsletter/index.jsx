'use client';
import React from 'react';
import * as Yup from 'yup';
// mui
import { FormControl, InputAdornment, TextField } from '@mui/material';
// react
import { useMutation } from 'react-query';
// formik
import { Form, FormikProvider, useFormik } from 'formik';
import Stack from '@mui/material/Stack';
// api
import * as api from 'src/services';
// toast
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

// icons
import { BsFillSendFill } from 'react-icons/bs';

export default function NewsLetter() {
  const [loading, setloading] = React.useState(false);
  const ChangePassWordSchema = Yup.object().shape({
    email: Yup.string().email('Please enter valid email').required('Email is required')
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ChangePassWordSchema,
    onSubmit: async (values) => {
      setloading(true);
      mutate(values);
    }
  });

  const { mutate } = useMutation(api.sendNewsletter, {
    onSuccess: (data) => {
      toast.success(data.message);
      setloading(false);
      formik.resetForm();
    },
    onError: (err) => {
      setloading(false);
      toast.error(err.response.data.message);
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Stack sx={{ maxWidth: 500, margin: 'auto', marginTop: 2, marginBottom: 1 }}>
          <FormControl fullWidth variant="outlined">
            <TextField
              size="medium"
              placeholder="Enter your Email"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              sx={{
                '& .MuiInputBase-root': {
                  bgcoolor: (theme) => theme.palette.background.paper
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <LoadingButton
                      name="newsletter-button"
                      // component="span"
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      loading={loading}
                      sx={{
                        p: 0,
                        height: 32,
                        borderRadius: 50,
                        minWidth: 32,
                        border: 'unset !important'
                      }}
                    >
                      <BsFillSendFill fontSize={16} />
                    </LoadingButton>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
