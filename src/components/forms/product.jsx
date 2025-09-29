'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { capitalCase } from 'change-case';
import { Form, FormikProvider, useFormik } from 'formik';
// mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Switch,
  InputAdornment,
  IconButton,
  Paper,
  Box,
  Divider
} from '@mui/material';
import { IoAdd, IoRemove } from 'react-icons/io5';
import * as api from 'src/services';
import { useMutation } from 'react-query';
// import { useNavigate, useParams } from "react-router-dom";
import { useRouter } from 'next-nprogress-bar';
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import { fCurrency } from 'src/utils/formatNumber';
import axios from 'axios';
import TiptapEditor from 'src/components/editor/TiptapEditor';
// ----------------------------------------------------------------------

const GENDER_OPTION = ['men', 'women', 'kids', 'others'];
const STATUS_OPTIONS = ['sale', 'new', 'regular', 'disabled'];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,

  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function ProductForm({
  categories,
  currentProduct,

  categoryLoading = false,
  isInitialized = false,
  brands
}) {
  const router = useRouter();
  const [loading, setloading] = React.useState(false);
  const { mutate, isLoading: updateLoading } = useMutation(
    currentProduct ? 'update' : 'new',
    currentProduct ? api.updateProduct : api.newProduct,
    {
      onSuccess: (data) => {
        toast.success(data.message);

        router.back();
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      }
    }
  );
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    images: Yup.array().min(1, 'Images is required'),
    available: Yup.number().required('Quantity is required'),
    price: Yup.number().required('Price is required'),
  shipping: Yup.number().min(0, 'Shipping cost must be 0 or greater'),
  deliveryWithin: Yup.number().min(0, 'Delivery Within must be 0 or greater'),
    // category: Yup.string().required('Category is required'),
    // subCategory: Yup.string().required('Sub Category is required'),
    priceSale: Yup.number().when('price', (price, schema) => {
      return price ? schema.max(price, 'Sale price should be smaller than price') : schema;
    }),
    specifications: Yup.array().of(
      Yup.object().shape({
        title: Yup.string().required('Specification title is required'),
        description: Yup.string().required('Specification description is required')
      })
    )
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      code: currentProduct?.code || '',
      slug: currentProduct?.slug || '',
      metaTitle: currentProduct?.metaTitle || '',
      metaDescription: currentProduct?.metaDescription || '',
      brand: currentProduct?.brand || brands[0]?._id || '',
      tags: currentProduct?.tags || [],
      paymentFeatures: currentProduct?.paymentFeatures || [],
      specifications: currentProduct?.specifications || [],
      gender: currentProduct?.gender || '',
      category: (() => {
        if (!currentProduct?.category) return '';
        
        // Check if the category still exists in the categories list
        const categoryExists = categories.some(cat => cat._id === currentProduct.category);
        return categoryExists ? currentProduct.category : '';
      })(),
      subCategory: (() => {
        if (!currentProduct?.subCategory) return '';
        
        // Find the category that contains this subcategory
        const parentCategory = categories.find(cat => 
          cat.subCategories?.some(sub => sub._id === currentProduct.subCategory)
        );
        
        // If the subcategory exists in the current category list, use it
        if (parentCategory) {
          return currentProduct.subCategory;
        }
        
        // If subcategory doesn't exist, return empty string to show blank
        return '';
      })(),
      status: currentProduct?.status || STATUS_OPTIONS[0],
      blob: currentProduct?.blob || [],
      isFeatured: currentProduct?.isFeatured || false,
      	dailyOffer: currentProduct?.dailyOffer || false,
      showStock: currentProduct?.showStock || false,
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || '',
      shipping: currentProduct?.shipping || 0,
  deliveryWithin: currentProduct?.deliveryWithin ?? 3,
      priceSale: currentProduct?.priceSale || '',
      colors: currentProduct?.colors || '',
      sizes: currentProduct?.sizes || '',
      available: currentProduct?.available || '',
      images: currentProduct?.images || [],
      variantImages: currentProduct?.variantImages || {}
    },

    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          priceSale: values.priceSale || values.price,
          ...(currentProduct && { currentSlug: currentProduct.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;

  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  // Reset subcategory when category changes
  React.useEffect(() => {
    if (values.category && !currentProduct) {
      // For new products, auto-select first subcategory if available
      const selectedCategory = categories.find(cat => cat._id === values.category);
      if (selectedCategory?.subCategories?.length > 0) {
        setFieldValue('subCategory', selectedCategory.subCategories[0]._id);
      }
    } else if (values.category && currentProduct) {
      // For existing products, check if current subcategory belongs to selected category
      const selectedCategory = categories.find(cat => cat._id === values.category);
      const subcategoryExists = selectedCategory?.subCategories?.some(sub => sub._id === values.subCategory);
      
      if (!subcategoryExists) {
        setFieldValue('subCategory', '');
      }
    }
  }, [values.category, categories, setFieldValue, currentProduct]);

  // Clean up variant images when colors are removed
  React.useEffect(() => {
    if (values.colors && Array.isArray(values.colors)) {
      const currentVariantImages = { ...values.variantImages };
      let hasChanges = false;

      // Remove variant images for colors that are no longer selected
      Object.keys(currentVariantImages).forEach(color => {
        if (!values.colors.includes(color)) {
          // Delete images from cloud storage
          const variantImages = currentVariantImages[color] || [];
          variantImages.forEach(image => {
            deleteMutate(image._id);
          });
          
          delete currentVariantImages[color];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        setFieldValue('variantImages', currentVariantImages);
      }
    }
  }, [values.colors, values.variantImages, setFieldValue, deleteMutate]);

  // handle drop
  const handleDrop = (acceptedFiles) => {
    setloading(true);
    const uploaders = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my-uploads');
      setFieldValue('blob', values.blob.concat(acceptedFiles));
      return axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    });

    axios.all(uploaders).then((data) => {
      const newImages = data.map(({ data }) => ({
        url: data.secure_url,
        _id: data.public_id
        // blob: blobs[i],
      }));
      setloading(false);
      setFieldValue('images', values.images.concat(newImages));
    });
  };

  // upload a single image for the description editor and return the URL
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
  // handleAddVariants

  // handleRemoveAll
  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
  };
  // handleRemove
  const handleRemove = (file) => {
    const removeImage = values.images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    setFieldValue('images', removeImage);
  };

  // Variant image handlers
  const handleVariantDrop = (acceptedFiles, color) => {
    setloading(true);
    const uploaders = acceptedFiles.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'my-uploads');
      return axios.post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
    });

    axios.all(uploaders).then((data) => {
      const newImages = data.map(({ data }) => ({
        url: data.secure_url,
        _id: data.public_id
      }));
      setloading(false);
      
      const currentVariantImages = values.variantImages[color] || [];
      setFieldValue('variantImages', {
        ...values.variantImages,
        [color]: [...currentVariantImages, ...newImages]
      });
    });
  };

  const handleVariantRemoveAll = (color) => {
    const variantImages = values.variantImages[color] || [];
    variantImages.forEach((image) => {
      deleteMutate(image._id);
    });
    
    const updatedVariantImages = { ...values.variantImages };
    delete updatedVariantImages[color];
    setFieldValue('variantImages', updatedVariantImages);
  };

  const handleVariantRemove = (file, color) => {
    const variantImages = values.variantImages[color] || [];
    const removeImage = variantImages.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    
    setFieldValue('variantImages', {
      ...values.variantImages,
      [color]: removeImage
    });
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-'); // convert to lowercase, remove special characters, and replace spaces with hyphens
    formik.setFieldValue('slug', slug); // set the value of slug in the formik state
    formik.handleChange(event); // handle the change in formik
  };
  return (
    <Stack spacing={3}>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <div>
                      {isInitialized ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="product-name">
                          {'Product Name'}
                        </LabelStyle>
                      )}
                      {isInitialized ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="product-name"
                          fullWidth
                          {...getFieldProps('name')}
                          onChange={handleTitleChange} // add onChange handler for title
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </div>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select">
                                {'Category'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('category')}
                                value={values.category}
                                id="grouped-native-select"
                              >
                                <option value="">
                                  <em>Select Category</em>
                                </option>
                                {categories?.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.name}
                                  </option>

                                  // </optgroup>
                                ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.category && errors.category && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.category && errors.category}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select-subCategory">
                                {'Sub Category'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('subCategory')}
                                value={values.subCategory}
                                id="grouped-native-select-subCategory"
                              >
                                <option value="">
                                  <em>Select Sub Category</em>
                                </option>
                                {categories
                                  .find((v) => v._id.toString() === values.category)
                                  ?.subCategories?.map((subCategory) => (
                                    <option key={subCategory._id} value={subCategory._id}>
                                      {subCategory.name}
                                    </option>

                                    // </optgroup>
                                  ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.subCategory && errors.subCategory && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.subCategory && errors.subCategory}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="brand-name">
                                {'Brand'}
                              </LabelStyle>
                            )}

                            <Select native {...getFieldProps('brand')} value={values.brand} id="grouped-native-select">
                              {brands?.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                  {brand.name}
                                </option>
                              ))}
                            </Select>

                            {touched.brand && errors.brand && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.brand && errors.brand}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <LabelStyle component={'label'} htmlFor="size">
                            {'Sizes'}
                          </LabelStyle>

                          <Autocomplete
                            id="size"
                            multiple
                            freeSolo
                            value={values.sizes}
                            onChange={(event, newValue) => {
                              setFieldValue('sizes', newValue);
                            }}
                            options={[]}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                id=""
                                {...params}
                                error={Boolean(touched.sizes && errors.sizes)}
                                helperText={touched.sizes && errors.sizes}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <LabelStyle component={'label'} htmlFor="color">
                            {'Colors'}
                          </LabelStyle>

                          <Autocomplete
                            id="color"
                            multiple
                            freeSolo
                            value={values.colors}
                            onChange={(event, newValue) => {
                              setFieldValue('colors', newValue);
                            }}
                            options={[]}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                id=""
                                {...params}
                                error={Boolean(touched.colors && errors.colors)}
                                helperText={touched.colors && errors.colors}
                              />
                            )}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={80} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="gander">
                                {'Gender'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <Select
                                id="gander"
                                native
                                {...getFieldProps('gender')}
                                error={Boolean(touched.gender && errors.gender)}
                              >
                                <option value={''}>
                                  <em>None</em>
                                </option>
                                {GENDER_OPTION.map((gender) => (
                                  <option key={gender} value={gender}>
                                    {capitalCase(gender)}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={80} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="status">
                                {'Status'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
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
                                    {capitalCase(status)}
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
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={120} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="product-code">
                                {'Product Code'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <TextField
                                id="product-code"
                                fullWidth
                                {...getFieldProps('code')}
                                error={Boolean(touched.code && errors.code)}
                                helperText={touched.code && errors.code}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-sku">
                              {'Product Sku'}
                            </LabelStyle>
                            <TextField
                              id="product-sku"
                              fullWidth
                              {...getFieldProps('sku')}
                              error={Boolean(touched.sku && errors.sku)}
                              helperText={touched.sku && errors.sku}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          {isInitialized ? (
                            <Skeleton variant="text" width={70} />
                          ) : (
                            <LabelStyle component={'label'} htmlFor="tags">
                              {'Tags'}
                            </LabelStyle>
                          )}
                          {isInitialized ? (
                            <Skeleton variant="rectangular" width="100%" height={56} />
                          ) : (
                            <Autocomplete
                              id="tags"
                              multiple
                              freeSolo
                              value={values.tags}
                              onChange={(event, newValue) => {
                                setFieldValue('tags', newValue);
                              }}
                              options={[]}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  id=""
                                  {...params}
                                  error={Boolean(touched.tags && errors.tags)}
                                  helperText={touched.tags && errors.tags}
                                />
                              )}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md={12}>
                          {isInitialized ? (
                            <Skeleton variant="text" width={120} />
                          ) : (
                            <LabelStyle component={'label'}>
                              {'Payment Features'}
                            </LabelStyle>
                          )}
                          {isInitialized ? (
                            <Skeleton variant="rectangular" width="100%" height={200} />
                          ) : (
                            <Paper sx={{ p: 2, mt: 1 }}>
                              <Stack spacing={2}>
                                {values.paymentFeatures && values.paymentFeatures.length > 0 ? (
                                  values.paymentFeatures.map((pf, index) => (
                                    <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                                      <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Grid container spacing={2} sx={{ flex: 1 }}>
                                          <Grid item xs={12} sm={4}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Name"
                                              value={pf.name || ''}
                                              onChange={(e) => {
                                                const newArr = [...values.paymentFeatures];
                                                newArr[index] = { ...newArr[index], name: e.target.value };
                                                setFieldValue('paymentFeatures', newArr);
                                              }}
                                              placeholder="e.g., Cash On Delivery"
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={8}>
                                            <TiptapEditor
                                              value={pf.description || ''}
                                              onChange={(html) => {
                                                const newArr = [...values.paymentFeatures];
                                                newArr[index] = { ...newArr[index], description: html };
                                                setFieldValue('paymentFeatures', newArr);
                                              }}
                                              uploadImage={uploadDescriptionImage}
                                              placeholder="Add rich description... you can insert links and images"
                                              error={Boolean(touched.paymentFeatures && errors.paymentFeatures)}
                                            />
                                          </Grid>
                                        </Grid>
                                        <Stack spacing={1}>
                                          <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                              const newArr = values.paymentFeatures.filter((_, i) => i !== index);
                                              setFieldValue('paymentFeatures', newArr);
                                            }}
                                          >
                                            <IoRemove />
                                          </IconButton>
                                        </Stack>
                                      </Stack>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography variant="body2" color="textSecondary">No payment features added.</Typography>
                                )}

                                <Stack direction="row" spacing={1}>
                                  <LoadingButton
                                    size="small"
                                    onClick={() => {
                                      const newArr = values.paymentFeatures ? [...values.paymentFeatures] : [];
                                      newArr.push({ name: '', description: '' });
                                      setFieldValue('paymentFeatures', newArr);
                                    }}
                                    startIcon={<IoAdd />}
                                  >
                                    Add Feature
                                  </LoadingButton>
                                  {values.paymentFeatures && values.paymentFeatures.length > 0 && (
                                    <LoadingButton
                                      size="small"
                                      color="error"
                                      onClick={() => setFieldValue('paymentFeatures', [])}
                                      startIcon={<IoRemove />}
                                    >
                                      Remove All
                                    </LoadingButton>
                                  )}
                                </Stack>
                                {touched.paymentFeatures && errors.paymentFeatures && (
                                  <FormHelperText error>{errors.paymentFeatures}</FormHelperText>
                                )}
                              </Stack>
                            </Paper>
                          )}
                        </Grid>
                        
                        {/* Specifications Field */}
                        <Grid item xs={12} md={12}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'}>
                                {'Product Specifications'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={200} />
                            ) : (
                              <Paper sx={{ p: 2, mt: 1 }}>
                                <Stack spacing={2}>
                                  {values.specifications.map((spec, index) => (
                                    <Box key={index} sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                                      <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Grid container spacing={2} sx={{ flex: 1 }}>
                                          <Grid item xs={12} sm={4}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Title"
                                              value={spec.title || ''}
                                              onChange={(e) => {
                                                const newSpecs = [...values.specifications];
                                                newSpecs[index] = { 
                                                  ...newSpecs[index], 
                                                  title: e.target.value 
                                                };
                                                setFieldValue('specifications', newSpecs);
                                              }}
                                              placeholder="e.g., Display, Camera, Storage"
                                            />
                                          </Grid>
                                          <Grid item xs={12} sm={8}>
                                            <TextField
                                              fullWidth
                                              size="small"
                                              label="Description"
                                              value={spec.description || ''}
                                              onChange={(e) => {
                                                const newSpecs = [...values.specifications];
                                                newSpecs[index] = { 
                                                  ...newSpecs[index], 
                                                  description: e.target.value 
                                                };
                                                setFieldValue('specifications', newSpecs);
                                              }}
                                              placeholder="e.g., 6.1-inch Super Retina XDR"
                                            />
                                          </Grid>
                                        </Grid>
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => {
                                            const newSpecs = values.specifications.filter((_, i) => i !== index);
                                            setFieldValue('specifications', newSpecs);
                                          }}
                                          sx={{ mt: 0.5 }}
                                        >
                                          <IoRemove />
                                        </IconButton>
                                      </Stack>
                                    </Box>
                                  ))}
                                  
                                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <IconButton
                                      color="primary"
                                      onClick={() => {
                                        const newSpecs = [...values.specifications, { title: '', description: '' }];
                                        setFieldValue('specifications', newSpecs);
                                      }}
                                      sx={{ 
                                        border: '2px dashed #ccc', 
                                        borderRadius: 2,
                                        '&:hover': {
                                          borderColor: 'primary.main',
                                          bgcolor: 'primary.50'
                                        }
                                      }}
                                    >
                                      <IoAdd />
                                    </IconButton>
                                  </Box>
                                  
                                  {values.specifications.length === 0 && (
                                    <Typography 
                                      variant="body2" 
                                      color="text.secondary" 
                                      sx={{ textAlign: 'center', py: 2 }}
                                    >
                                      No specifications added yet. Click the + button to add your first specification.
                                    </Typography>
                                  )}
                                </Stack>
                              </Paper>
                            )}
                          </div>
                        </Grid>
                        
                        <Grid item xs={12} md={12}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="meta-title">
                                {'Meta Title'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <TextField
                                id="meta-title"
                                fullWidth
                                {...getFieldProps('metaTitle')}
                                error={Boolean(touched.metaTitle && errors.metaTitle)}
                                helperText={touched.metaTitle && errors.metaTitle}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={120} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="description">
                                {'Description'}{' '}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={240} />
                            ) : (
                              <TiptapEditor
                                value={values.description}
                                onChange={(value) => setFieldValue('description', value)}
                                placeholder="Enter product description..."
                                error={Boolean(touched.description && errors.description)}
                                helperText={touched.description && errors.description}
                                uploadImage={uploadDescriptionImage}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-image">
                              {'Products Images'} <span>1080 * 1080</span>
                            </LabelStyle>
                            <UploadMultiFile
                              id="product-image"
                              showPreview
                              maxSize={3145728}
                              accept="image/*"
                              files={values?.images}
                              loading={loading}
                              onDrop={handleDrop}
                              onRemove={handleRemove}
                              onRemoveAll={handleRemoveAll}
                              blob={values.blob}
                              error={Boolean(touched.images && errors.images)}
                            />
                            {touched.images && errors.images && (
                              <FormHelperText error sx={{ px: 2 }}>
                                {touched.images && errors.images}
                              </FormHelperText>
                            )}
                          </div>
                        </Grid>
                        
                        {/* Color Variant Images */}
                        {values.colors && Array.isArray(values.colors) && values.colors.length > 0 && (
                          <Grid item xs={12} md={12}>
                            <div>
                              <LabelStyle component={'label'}>
                                {'Color Variant Images'} <span>1080 * 1080</span>
                              </LabelStyle>
                              <Stack spacing={3} sx={{ mt: 2 }}>
                                {values.colors.map((color, index) => (
                                  <Card key={color} sx={{ p: 2, bgcolor: 'grey.50' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 2, textTransform: 'capitalize' }}>
                                      {color} Images
                                    </Typography>
                                    <UploadMultiFile
                                      id={`variant-image-${color}`}
                                      showPreview
                                      maxSize={3145728}
                                      accept="image/*"
                                      files={values.variantImages[color] || []}
                                      loading={loading}
                                      onDrop={(acceptedFiles) => handleVariantDrop(acceptedFiles, color)}
                                      onRemove={(file) => handleVariantRemove(file, color)}
                                      onRemoveAll={() => handleVariantRemoveAll(color)}
                                      blob={[]}
                                    />
                                  </Card>
                                ))}
                              </Stack>
                            </div>
                          </Grid>
                        )}
                      </Grid>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3} pb={1}>
                  <div>
                    {isInitialized ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="slug">
                        {'Slug'}
                      </LabelStyle>
                    )}
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="slug"
                        fullWidth
                        {...getFieldProps('slug')}
                        error={Boolean(touched.slug && errors.slug)}
                        helperText={touched.slug && errors.slug}
                      />
                    )}
                  </div>
                  <div>
                    {isInitialized ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="meta-description">
                        {'Meta Description'}{' '}
                      </LabelStyle>
                    )}
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
                    ) : (
                      <TextField
                        id="meta-description"
                        fullWidth
                        {...getFieldProps('metaDescription')}
                        error={Boolean(touched.metaDescription && errors.metaDescription)}
                        helperText={touched.metaDescription && errors.metaDescription}
                        rows={9}
                        multiline
                      />
                    )}
                  </div>

                  <div>
                    <FormControlLabel
                      control={
                        <Switch
                          {...getFieldProps('showStock')}
                          checked={values.showStock}
                          onChange={(event) => setFieldValue('showStock', event.target.checked)}
                        />
                      }
                      label="Show Stock"
                    />
                  </div>

                  <div>
                    <LabelStyle component={'label'} htmlFor="quantity">
                      {'Quantity'}
                    </LabelStyle>
                    <TextField
                      id="quantity"
                      fullWidth
                      type="number"
                      {...getFieldProps('available')}
                      error={Boolean(touched.available && errors.available)}
                      helperText={touched.available && errors.available}
                    />
                  </div>

                  <div>
                    <LabelStyle component={'label'} htmlFor="regular-price">
                      {'Regular Price'}
                    </LabelStyle>
                    <TextField
                      id="regular-price"
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps('price')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{fCurrency(0)?.split('0')[0]}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                    />
                  </div>
                  <div>
                    <LabelStyle component={'label'} htmlFor="sale-price">
                      {'Sale Price'}
                    </LabelStyle>
                    <TextField
                      id="sale-price"
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps('priceSale')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{fCurrency(0)?.split('0')[0]}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.priceSale && errors.priceSale)}
                      helperText={touched.priceSale && errors.priceSale}
                    />
                  </div>
                  <div>
                    <LabelStyle component={'label'} htmlFor="shipping">
                      {'Shipping Cost'}
                    </LabelStyle>
                    <TextField
                      id="shipping"
                      fullWidth
                      placeholder="0.00"
                      {...getFieldProps('shipping')}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">{fCurrency(0)?.split('0')[0]}</InputAdornment>,
                        type: 'number'
                      }}
                      error={Boolean(touched.shipping && errors.shipping)}
                      helperText={touched.shipping && errors.shipping}
                    />
                  </div>
                  <div>
                    <LabelStyle component={'label'} htmlFor="deliveryWithin">
                      {'Delivery Within (Days)'}
                    </LabelStyle>
                    <TextField
                      id="deliveryWithin"
                      type="number"
                      fullWidth
                      {...getFieldProps('deliveryWithin')}
                      inputProps={{ min: 0 }}
                      error={Boolean(touched.deliveryWithin && errors.deliveryWithin)}
                      helperText={touched.deliveryWithin && errors.deliveryWithin}
                    />
                  </div>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
                            checked={values.isFeatured}
                          />
                        }
                        label={'Featured Product'}
                      />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('dailyOffer', e.target.checked)}
                            checked={values.dailyOffer}
                          />
                        }
                        label={'Daily Offer'}
                      />
                    </FormGroup>
                  </div>
                  <Stack spacing={2}>
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton type="submit" variant="contained" size="large" fullWidth loading={updateLoading}>
                        {currentProduct ? 'Update Product' : 'Create Product'}
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Stack>
  );
}
ProductForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.array.isRequired
      // ... add other required properties for category
    })
  ).isRequired,
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
    slug: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    brand: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    paymentFeatures: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string
    })),
    specifications: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string
    })),
    gender: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    status: PropTypes.string,
    blob: PropTypes.array,
    isFeatured: PropTypes.bool,
  dailyOffer: PropTypes.bool,
    sku: PropTypes.string,
    price: PropTypes.number,
    priceSale: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    sizes: PropTypes.arrayOf(PropTypes.string),
    available: PropTypes.number,
    images: PropTypes.array
    // ... add other optional properties for currentProduct
  }),
  categoryLoading: PropTypes.bool,
  isInitialized: PropTypes.bool,
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
      // ... add other required properties for brands
    })
  )
};
