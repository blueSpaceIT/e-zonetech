'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, TextField, Button, MenuItem, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import * as api from 'src/services';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function UserForm({ initialValues = {}, onSuccess } = {}) {
  const router = useRouter();
  // normalize null initialValues (parent may pass null) to avoid runtime errors
  const safeInit = initialValues || {};
  const isEdit = Boolean(safeInit && safeInit._id);
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const [values, setValues] = useState({
    firstName: safeInit.firstName || '',
    lastName: safeInit.lastName || '',
    email: safeInit.email || '',
    password: '',
    confirmPassword: '',
    phone: safeInit.phone || '',
    gender: safeInit.gender || '',
    role: safeInit.role || 'user'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const initialSnapshotRef = useRef('');

  useEffect(() => {
    const next = {
      firstName: safeInit.firstName || '',
      lastName: safeInit.lastName || '',
      email: safeInit.email || '',
      phone: safeInit.phone || '',
      gender: safeInit.gender || '',
      role: safeInit.role || 'user'
    };

    const nextSnapshot = JSON.stringify(next);
    if (initialSnapshotRef.current !== nextSnapshot) {
      initialSnapshotRef.current = nextSnapshot;
      setValues(prev => ({ ...prev, ...next }));
    }
  }, [initialValues]);

  // Manual validation function for individual fields
  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value || value.trim() === '') return 'First name is required';
        return null;
      case 'lastName':
        if (!value || value.trim() === '') return 'Last name is required';
        return null;
      case 'email':
        if (!value || value.trim() === '') return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
        return null;
      case 'password':
        if (!isEdit) {
          if (!value) return 'Password is required';
          if (!passwordRules.test(value)) return 'Password must be at least 8 characters and include uppercase, lowercase, number and special character';
        } else {
          if (value && !passwordRules.test(value)) return 'Password must be at least 8 characters and include uppercase, lowercase, number and special character';
        }
        return null;
      case 'confirmPassword':
        if (values.password && values.password.length > 0) {
          if (!value) return 'Confirm password is required';
          if (value !== values.password) return 'Passwords must match';
        }
        return null;
      case 'phone':
        if (value && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(value)) return 'Invalid phone number';
        return null;
      case 'role':
        if (!value) return 'Role is required';
        return null;
      default:
        return null;
    }
  };

  // Validate all fields
  const validateAll = () => {
    const nextErrors = {};
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'role'];
    
    fields.forEach(field => {
      const error = validateField(field, values[field]);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    setAttemptedSubmit(true);
    setLocalSubmitting(true);

    // Mark all fields as touched
    const allFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'role'];
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    const isValid = validateAll();
    if (!isValid) {
      setLocalSubmitting(false);
      return;
    }

    try {
  if (isEdit) {
  const payload = { ...values };
  if (!payload.password) delete payload.password;
  delete payload.confirmPassword;
  await api.updateUser(safeInit._id, payload);
  toast.success('User updated');
      } else {
        const payload = { ...values };
        delete payload.confirmPassword;
        await api.createUser(payload);
        toast.success('User created');
      }
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default behavior: navigate to admin page
        router.push('/dashboard/admin');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLocalSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="First name" 
            name="firstName" 
            value={values.firstName} 
            onChange={(e) => handleChange('firstName', e.target.value)} 
            onBlur={() => handleBlur('firstName')} 
            error={Boolean(touched.firstName && errors.firstName)} 
            helperText={touched.firstName && errors.firstName} 
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="Last name" 
            name="lastName" 
            value={values.lastName} 
            onChange={(e) => handleChange('lastName', e.target.value)} 
            onBlur={() => handleBlur('lastName')} 
            error={Boolean(touched.lastName && errors.lastName)} 
            helperText={touched.lastName && errors.lastName} 
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="Email" 
            name="email" 
            value={values.email} 
            onChange={(e) => handleChange('email', e.target.value)} 
            onBlur={() => handleBlur('email')} 
            error={Boolean(touched.email && errors.email)} 
            helperText={touched.email && errors.email} 
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Grid>

        {(!isEdit || values.password) && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              helperText={touched.confirmPassword && errors.confirmPassword}
            />
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <TextField 
            fullWidth 
            label="Phone" 
            name="phone" 
            value={values.phone || ''} 
            onChange={(e) => handleChange('phone', e.target.value)} 
            onBlur={() => handleBlur('phone')} 
            error={Boolean(touched.phone && errors.phone)} 
            helperText={touched.phone && errors.phone} 
          />
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField 
            select 
            fullWidth 
            label="Gender" 
            name="gender" 
            value={values.gender || ''} 
            onChange={(e) => handleChange('gender', e.target.value)} 
            onBlur={() => handleBlur('gender')}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={3}>
          <TextField 
            select 
            fullWidth 
            label="Role" 
            name="role" 
            value={values.role || 'admin'} 
            onChange={(e) => handleChange('role', e.target.value)} 
            onBlur={() => handleBlur('role')} 
            error={Boolean(touched.role && errors.role)} 
            helperText={touched.role && errors.role}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="accountant">Accountant</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          {attemptedSubmit && Object.keys(errors).filter(key => errors[key]).length > 0 && (
            <div style={{ color: '#d32f2f', marginBottom: 8 }}>
              Please fix the highlighted fields before submitting.
            </div>
          )}
          <Button 
            variant="contained" 
            type="submit" 
            disabled={localSubmitting}
            onClick={handleSubmit}
          >
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
