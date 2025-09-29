'use client';
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import UploadSingleFile from 'src/components/upload/UploadSingleFile';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function BannerSevenList() {
  const { data, isLoading, refetch } = useQuery(['banner-seven'], () => api.getBannerSeven(), { enabled: true });
  const banners = data?.data || [];
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ image: '', url: '' });
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [fileObj, setFileObj] = React.useState(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ image: '', url: '' });
    setOpen(true);
  };
  const openEdit = (b) => {
    setEditing(b);
    setForm({ image: b.image, url: b.url });
    setOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editing) {
        await api.updateBannerSeven(editing._id, form);
      } else {
        await api.createBannerSeven(form);
      }
      setOpen(false);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  const handleDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setFileObj(Object.assign(file, { preview: URL.createObjectURL(file) }));
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'my-uploads');
    try {
      setUploadProgress(1);
      const config = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadProgress(percent);
        }
      };
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        config
      );
      setForm((s) => ({ ...s, image: data.secure_url }));
      toast.success('Image uploaded');
      setUploadProgress(0);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.deleteBannerSeven(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Banner Seven</Typography>
        <Button variant="contained" onClick={openCreate}>
          Add Banner Seven
        </Button>
      </Box>
      <Grid container spacing={2}>
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : banners && banners.length > 0 ? (
          banners.map((b) => (
            <Grid item xs={12} sm={6} md={4} key={b._id}>
              <Card>
                {b.image && <CardMedia component="img" height="140" image={b.image} alt="banner seven" />}
                <CardContent>
                  <Typography variant="subtitle1">{b.url || '—'}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => openEdit(b)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(b._id)}>
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No banner seven found.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Banner Seven' : 'Add Banner Seven'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <UploadSingleFile accept="image/*" maxSize={10485760} onDropAccepted={handleDrop} />
            {uploadProgress > 0 && <Typography variant="caption">Uploading: {uploadProgress}%</Typography>}
            {form.image && (
              <Box sx={{ mt: 1 }}>
                <img src={form.image} alt="preview" style={{ maxWidth: '100%', height: 140, objectFit: 'cover' }} />
              </Box>
            )}
            <TextField
              margin="dense"
              label="Target URL"
              fullWidth
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editing ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
