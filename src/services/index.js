import http from './http';
//----------------------------------

export const login = async (payload) => {
  const { data } = await http.post(`/auth/login`, payload);
  return data;
};
export const register = async (payload) => {
  const { data } = await http.post(`/auth/register`, payload);
  return data;
};
export const getUserCategories = async () => {
  const { data } = await http.get(`/categories/active`);
  return data;
};
export const getProducts = async (query = '') => {
  console.log('🔌 API getProducts - Query:', query);
  const { data } = await http.get(`/products${query}`);
  console.log('🔌 API getProducts - Response from backend:', data);
  console.log(
    '🔌 API getProducts - Sample product shipping field:',
    data?.data?.length > 0 ? data.data[0]?.shipping : 'No products'
  );
  return data;
};
export const getAllProducts = async () => {
  const { data } = await http.get(`/products/all`);
  return data;
};
export const getAllFilters = async () => {
  const { data } = await http.get(`/products/filters`);
  return data;
};
export const getFiltersByCategory = async (category) => {
  const { data } = await http.get(`filters/${category}`);
  return data;
};
export const getFiltersBySubCategory = async (category, subcategory) => {
  const { data } = await http.get(`filters/${category}/${subcategory}`);
  return data;
};
export const getNewProducts = async () => {
  const { data } = await http.get(`/products/new`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get('/new-arrivals');
  return data;
};
export const getRelatedProducts = async (pid) => {
  const { data } = await http.get(`/related-products/${pid}`);
  return data;
};
export const getProductBySlug = async (slug) => {
  console.log('🔌 API getProductBySlug - Requesting product with slug:', slug);
  const { data } = await http.get(`/products/${slug}`);
  console.log('🔌 API getProductBySlug - Response from backend:', data);
  console.log('🔌 API getProductBySlug - Product shipping field:', data?.data?.shipping);
  return data;
};
export const getProductReviews = async (pid) => {
  const { data } = await http.get(`/reviews/${pid}`);
  return data;
};
export const addReview = async (payload) => {
  const { data } = await http.post(`/reviews`, payload);
  return data;
};

export const getUserInvoice = async (page) => {
  const { data: response } = await http.get(`/users/invoice${page}`);
  return response;
};

export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`/users/profile`, payload);
  return data;
};
export const changerPassword = async ({ ...payload }) => {
  const { data } = await http.put(`/users/change-password`, payload);
  return data;
};
export const forgetPassword = async (payload) => {
  const { data } = await http.post('/auth/forget-password', payload);
  return data;
};
export const resetPassword = async ({ newPassword, token }) => {
  const { data } = await http.post('/auth/reset-password', {
    newPassword: newPassword,
    token: token
  });
  return data;
};
export const getAddress = async (payload) => {
  const { data } = await http.get(`/users/addresses?id=${payload}`);
  return data;
};
export const updateAddress = async ({ _id, ...payload }) => {
  const { data } = await http.put(`/users/addresses/${_id}`, payload);
  return data;
};
export const createAddress = async ({ ...payload }) => {
  const { data } = await http.post(`/users/addresses/`, payload);
  return data;
};
export const deleteAddress = async ({ _id }) => {
  const { data } = await http.delete(`/users/addresses/${_id}`);
  return data;
};
export const search = async (payload) => {
  const { data } = await http.post(`/search`, payload);
  return data;
};
export const getInvoices = async () => {
  const { data } = await http.get(`/users/invoice`);
  return data;
};
export const placeOrder = async (payload) => {
  const { data } = await http.post(`/orders`, payload);
  return data;
};
export const getLayout = async () => {
  const { data } = await http.get(`/layout`);
  return data;
};
export const singleDeleteFile = async (id) => {
  const { data } = await http.delete(`/delete-file/${id}`);
  return data;
};

export const sendNewsletter = async (payload) => {
  const { data } = await http.post(`/newsletter`, payload);
  return data;
};

export const getWishlist = async () => {
  const { data } = await http.get(`/wishlist`);
  return data;
};
export const updateWishlist = async (pid) => {
  const { data } = await http.post(`/wishlist`, { pid });
  return data;
};

export const getSliders = async () => {
  const { data } = await http.get(`/sliders/primary`);
  return data;
};

export const getProfile = async () => {
  const { data } = await http.get(`/users/profile`);
  return data;
};

export const verifyOTP = async (payload) => {
  const { data } = await http.post(`/auth/verify-otp`, payload);
  return data;
};
export const resendOTP = async (payload) => {
  const { data } = await http.post(`/auth/resend-otp`, payload);
  return data;
};

export const getHeaderData = async () => {
  const { data } = await http.get(`/header`);
  return data;
};
export const getCart = async (ids) => {
  console.log('🔌 API getCart - Requesting cart with IDs:', ids);
  const { data } = await http.post(`/cart`, {
    products: ids
  });
  console.log('🔌 API getCart - Response from backend:', data);
  console.log('🔌 API getCart - Sample product data:', data?.data?.length > 0 ? data.data[0] : 'No products');
  return data;
};
// admin
export const dashboardAnalytics = async () => {
  const { data } = await http.get(`/admin/dashboard-analytics`);
  return data;
};
export const getNotification = async (page) => {
  const { data } = await http.get(`/admin/notifications?limit=${page}`, {});
  return data;
};

// reports
export const getSalesReport = async ({ startDate, endDate, granularity }) => {
  const query = `?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`;
  const { data } = await http.get(`/admin/reports/sales${query}`);
  return data;
};

// profit-loss report
export const getProfitLossReport = async ({ startDate, endDate, granularity }) => {
  const query = `?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`;
  const { data } = await http.get(`/admin/reports/profit-loss${query}`);
  return data;
};

// custom income/expense entries
export const getCustomEntries = async () => {
  const { data } = await http.get(`/admin/custom-entries`);
  return data;
};

export const deleteCustomEntry = async (id) => {
  const { data } = await http.delete(`/admin/custom-entries/${id}`);
  return data;
};

export const createCustomEntry = async (payload) => {
  const { data } = await http.post(`/admin/custom-entries`, payload);
  return data;
};

// mid banners
export const getMidBanners = async () => {
  const { data } = await http.get(`/admin/mid-banners`);
  return data;
};

export const createMidBanner = async (payload) => {
  const { data } = await http.post(`/admin/mid-banners`, payload);
  return data;
};

export const updateMidBanner = async (id, payload) => {
  const { data } = await http.put(`/admin/mid-banners/${id}`, payload);
  return data;
};

export const deleteMidBanner = async (id) => {
  const { data } = await http.delete(`/admin/mid-banners/${id}`);
  return data;
};

// public mid banners (frontend display)
export const getPublicMidBanners = async () => {
  const { data } = await http.get(`/mid-banners`);
  return data;
};

// public side banners (frontend display)
export const getPublicSideBanners = async () => {
  const { data } = await http.get(`/side-banners`);
  return data;
};

// side banners (same contract as mid banners)
export const getSideBanners = async () => {
  const { data } = await http.get(`/admin/side-banners`);
  return data;
};

export const createSideBanner = async (payload) => {
  const { data } = await http.post(`/admin/side-banners`, payload);
  return data;
};

export const updateSideBanner = async (id, payload) => {
  const { data } = await http.put(`/admin/side-banners/${id}`, payload);
  return data;
};

export const deleteSideBanner = async (id) => {
  const { data } = await http.delete(`/admin/side-banners/${id}`);
  return data;
};

// download full report (returns PDF blob)
export const getReportDownload = async ({ startDate, endDate, granularity }) => {
  const query = `?startDate=${startDate}&endDate=${endDate}&granularity=${granularity}`;
  const response = await http.get(`/admin/reports/download${query}`, { responseType: 'blob' });
  return response.data;
};

// brands
export const getBrands = async (page, search) => {
  const { data } = await http.get(`/admin/brands?search=${search}&page=${page}`);
  return data;
};
export const getBrandByAdmin = async (id) => {
  const { data } = await http.get(`/admin/brands/${id}`);
  return data;
};
export const getAllBrands = async () => {
  const { data } = await http.get(`/admin/all-brands`);
  return data;
};

export const addBrand = async (payload) => {
  const { data } = await http.post(`/admin/brands`, payload);
  return data;
};
export const updateBrand = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/brands/${currentSlug}`, payload);
  return data;
};
export const deleteBrand = async (slug) => {
  const { data } = await http.delete(`/admin/brands/${slug}`);
  return data;
};

// categories
export const getCategories = async (page, search) => {
  const { data } = await http.get(`/admin/categories?search=${search}&page=${page}`);
  return data;
};
export const getCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/categories/${slug}`);
  return data;
};
export const deleteCategory = async (slug) => {
  const { data } = await http.delete(`/admin/categories/${slug}`);
  return data;
};
export const addCategory = async (payload) => {
  const { data } = await http.post(`/admin/categories`, payload);
  return data;
};
export const updateCategory = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/categories/${currentSlug}`, payload);
  return data;
};
export const getAllCategories = async () => {
  const { data } = await http.get(`/all-categories`);
  return data;
};
export const homeCategroies = async () => {
  const { data } = await http.get(`/home/categories`);
  return data;
};
export const getBestSellingProducts = async () => {
  const { data } = await http.get(`/home/products/best-selling`);
  return data;
};

export const getFeaturedProducts = async () => {
  const { data } = await http.get(`/home/products/featured`);
  return data;
};

export const getDailyOfferProducts = async () => {
  const { data } = await http.get(`/home/products/daily-offer`);
  return data;
};

export const getTopRatedProducts = async () => {
  const { data } = await http.get(`/home/products/top`);
  return data;
};
export const getHomeBrands = async () => {
  const { data } = await http.get(`/home/brands`);
  return data;
};

// sub categories
export const getSubCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/subcategories/${slug}`);
  return data;
};
export const getSubCategories = async (page, search) => {
  const { data } = await http.get(`/admin/subcategories?search=${search}&page=${page}`);
  return data;
};
export const deleteSubCategory = async (slug) => {
  const { data } = await http.delete(`/admin/subcategories/${slug}`);
  return data;
};
export const addSubCategory = async (payload) => {
  const { data } = await http.post(`/admin/subcategories`, payload);
  return data;
};
export const updateSubCategory = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/subcategories/${currentSlug}`, payload);
  return data;
};

export const getAdminProducts = async (page, search) => {
  console.log('🔌 API getAdminProducts - Page:', page, 'Search:', search);
  const { data: response } = await http.get(`/admin/products?search=${search}&page=${page}`);
  console.log('🔌 API getAdminProducts - Response from backend:', response);
  console.log(
    '🔌 API getAdminProducts - Sample product shipping field:',
    response?.data?.length > 0 ? response.data[0]?.shipping : 'No products'
  );
  return response;
};
// payment features
export const getPaymentFeatures = async () => {
  const { data } = await http.get(`/admin/payment-features?sort=updatedAt:asc`);
  return data;
};
// public payment features (frontend display)
export const getPublicPaymentFeatures = async () => {
  const { data } = await http.get(`/payment-features?sort=updatedAt:asc`);
  return data;
};
export const getPaymentFeature = async (id) => {
  const { data } = await http.get(`/admin/payment-features/${id}`);
  return data;
};
export const createPaymentFeature = async (payload) => {
  const { data } = await http.post(`/admin/payment-features`, payload);
  return data;
};
export const updatePaymentFeature = async (id, payload) => {
  const { data } = await http.put(`/admin/payment-features/${id}`, payload);
  return data;
};
export const deletePaymentFeature = async (id) => {
  const { data } = await http.delete(`/admin/payment-features/${id}`);
  return data;
};
export const deleteProduct = async (slug) => {
  const { data: response } = await http.delete(`/admin/products/${slug}`);
  return response;
};
export const newProduct = async (payload) => {
  const { data: response } = await http.post(`/admin/products`, payload);
  return response;
};
export const updateProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/admin/products/${currentSlug}`, payload);
  return response;
};

// orders

export const getOrders = async (page, search, status) => {
  let query = `?page=${page}`;
  if (search) query += `&search=${search}`;
  if (status) query += `&status=${status}`;

  console.log('🌐 API Service - getOrders called with:');
  console.log('  - page:', page);
  console.log('  - search:', search);
  console.log('  - status:', status);
  console.log('  - constructed query:', query);
  console.log('  - full URL:', `/admin/orders${query}`);

  const { data } = await http.get(`/admin/orders${query}`);

  console.log('🌐 API Service - Response received:', data);

  return data;
};
export const getOrderByAdmin = async (id) => {
  const { data } = await http.get(`/admin/orders/${id}`);
  return data;
};
export const deleteOrder = async (id) => {
  const { data } = await http.delete(`/admin/orders/${id}`);
  return data;
};
export const updateOrderStatus = async ({ id, ...payload }) => {
  const { data } = await http.put(`/admin/orders/${id}`, payload);
  return data;
};

// users
export const getUsers = async (page, search, role) => {
  let query = `?search=${search}&page=${page}`;
  if (role) query += `&role=${role}`;
  const { data: response } = await http.get(`/admin/users${query}`);
  return response;
};
export const getUser = async (id) => {
  const { data: response } = await http.get(`/admin/users/${id}`);
  return response;
};
export const userStatus = async ({ id, ...payload }) => {
  const { data: response } = await http.put(`/admin/users/${id}`, payload);
  return response;
};
export const createUser = async (payload) => {
  const { data: response } = await http.post(`/admin/users`, payload);
  return response;
};
export const updateUser = async (id, payload) => {
  const { data: response } = await http.put(`/admin/users/${id}`, payload);
  return response;
};
export const userDelete = async (id) => {
  const { data: response } = await http.delete(`/admin/users/${id}`);
  return response;
};

// coupon code

export const applyCouponCode = async (code) => {
  const { data: response } = await http.get(`/coupon-codes/${code}`);
  return response;
};
export const getCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.get(`/admin/coupon-codes/${id}`);
  return response;
};

export const getCouponCodes = async (page, search) => {
  const { data: response } = await http.get(`/admin/coupon-codes?search=${search}&page=${page}`);
  return response;
};
export const addCouponCode = async (payload) => {
  const { data: response } = await http.post(`/admin/coupon-codes`, payload);
  return response;
};

export const updateCouponCode = async ({ currentId, ...others }) => {
  const { data: response } = await http.put(`/admin/coupon-codes/${currentId}`, others);
  return response;
};
export const deleteCouponCode = async (id) => {
  const { data: response } = await http.delete(`/admin/coupon-codes/${id}`);
  return response;
};

// user

export const updateUserRole = async (id) => {
  const { data: response } = await http.post(`/admin/users/role/${id}`);
  return response;
};
// newsletter
export const getNewsletter = async (page) => {
  const { data } = await http.get(`/admin/newsletter?page=${page}`);
  return data;
};

export const paymentIntents = async (amount) => {
  const { data } = await http.post(`/payment-intents`, {
    amount
  });
  return data;
};

export const bulkUploadProducts = async (payload) => {
  const { data } = await http.post(`/admin/products/bulk-upload`, payload);
  return data;
};

// banners
export const getAdminBanners = async (page = 1, search = '') => {
  const { data } = await http.get(`/admin/banners?search=${search}&page=${page}`);
  return data;
};

export const getBannerByAdmin = async (id) => {
  const { data } = await http.get(`/admin/banners/${id}`);
  return data;
};

export const createBanner = async (payload) => {
  const { data } = await http.post(`/admin/banners`, payload);
  return data;
};

export const updateBanner = async (id, payload) => {
  const { data } = await http.put(`/admin/banners/${id}`, payload);
  return data;
};

export const deleteBanner = async (id) => {
  const { data } = await http.delete(`/admin/banners/${id}`);
  return data;
};

export const getBanners = async () => {
  const { data } = await http.get(`/banners`);
  return data;
};

// header menus (admin + public)
export const getHeaderMenus = async (page = 1, search = '') => {
  const { data } = await http.get(`/admin/header-menus?search=${search}&page=${page}`);
  return data;
};

export const getHeaderMenuByAdmin = async (id) => {
  const { data } = await http.get(`/admin/header-menus/${id}`);
  return data;
};

export const createHeaderMenu = async (payload) => {
  const { data } = await http.post(`/admin/header-menus`, payload);
  return data;
};

export const updateHeaderMenu = async (id, payload) => {
  const { data } = await http.put(`/admin/header-menus/${id}`, payload);
  return data;
};

export const deleteHeaderMenu = async (id) => {
  const { data } = await http.delete(`/admin/header-menus/${id}`);
  return data;
};

// public header menus
export const getPublicHeaderMenus = async () => {
  const { data } = await http.get(`/header-menus`);
  return data;
};

// banner four (admin + public)
export const getBannerFour = async () => {
  const { data } = await http.get(`/admin/banner-four`);
  return data;
};

export const createBannerFour = async (payload) => {
  const { data } = await http.post(`/admin/banner-four`, payload);
  return data;
};

export const updateBannerFour = async (id, payload) => {
  const { data } = await http.put(`/admin/banner-four/${id}`, payload);
  return data;
};

export const deleteBannerFour = async (id) => {
  const { data } = await http.delete(`/admin/banner-four/${id}`);
  return data;
};

// public banner four
export const getPublicBannerFour = async () => {
  const { data } = await http.get(`/banner-four`);
  return data;
};

// banner five (admin + public)
export const getBannerFive = async () => {
  const { data } = await http.get(`/admin/banner-five`);
  return data;
};

export const createBannerFive = async (payload) => {
  const { data } = await http.post(`/admin/banner-five`, payload);
  return data;
};

export const updateBannerFive = async (id, payload) => {
  const { data } = await http.put(`/admin/banner-five/${id}`, payload);
  return data;
};

export const deleteBannerFive = async (id) => {
  const { data } = await http.delete(`/admin/banner-five/${id}`);
  return data;
};

// public banner five
export const getPublicBannerFive = async () => {
  const { data } = await http.get(`/banner-five`);
  return data;
};

// banner six (admin + public)
export const getBannerSix = async () => {
  const { data } = await http.get(`/admin/banner-six`);
  return data;
};

export const createBannerSix = async (payload) => {
  const { data } = await http.post(`/admin/banner-six`, payload);
  return data;
};

export const updateBannerSix = async (id, payload) => {
  const { data } = await http.put(`/admin/banner-six/${id}`, payload);
  return data;
};

export const deleteBannerSix = async (id) => {
  const { data } = await http.delete(`/admin/banner-six/${id}`);
  return data;
};

// public banner six
export const getPublicBannerSix = async () => {
  const { data } = await http.get(`/banner-six`);
  return data;
};

// banner seven (admin + public)
export const getBannerSeven = async () => {
  const { data } = await http.get(`/admin/banner-seven`);
  return data;
};

export const createBannerSeven = async (payload) => {
  const { data } = await http.post(`/admin/banner-seven`, payload);
  return data;
};

export const updateBannerSeven = async (id, payload) => {
  const { data } = await http.put(`/admin/banner-seven/${id}`, payload);
  return data;
};

export const deleteBannerSeven = async (id) => {
  const { data } = await http.delete(`/admin/banner-seven/${id}`);
  return data;
};

// public banner seven
export const getPublicBannerSeven = async () => {
  const { data } = await http.get(`/banner-seven`);
  return data;
};

// delivery cities (admin)
export const getDeliveryCities = async (page = 1, search = '') => {
  const { data } = await http.get(`/admin/delivery-cities?search=${search}&page=${page}`);
  return data;
};

export const deleteDeliveryCity = async (id) => {
  const { data } = await http.delete(`/admin/delivery-cities/${id}`);
  return data;
};

export const getDeliveryCityByAdmin = async (id) => {
  const { data } = await http.get(`/admin/delivery-cities/${id}`);
  return data;
};

export const addDeliveryCity = async (payload) => {
  const { data } = await http.post(`/admin/delivery-cities`, payload);
  return data;
};

export const updateDeliveryCity = async ({ id, ...payload }) => {
  const { data } = await http.put(`/admin/delivery-cities/${id}`, payload);
  return data;
};

// public delivery cities (frontend)
export const getDeliveryCitiesPublic = async () => {
  const { data } = await http.get(`/delivery-cities`);
  return data;
};
