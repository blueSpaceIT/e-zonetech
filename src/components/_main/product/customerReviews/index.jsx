'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
// mui
import { 
  Box, 
  Typography, 
  Grid, 
  LinearProgress, 
  Rating, 
  Avatar, 
  Stack, 
  Button, 
  TextField,
  Card,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { MdEdit, MdPerson } from 'react-icons/md';
// next
import Link from 'next/link';
// redux
import { useSelector } from 'react-redux';
// api
import * as api from 'src/services';
// utils
import { fShortenNumber } from 'src/utils/formatNumber';
// toast
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

CustomerReviews.propTypes = {
  productId: PropTypes.string.isRequired,
  totalRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired
};

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const queryClient = useQueryClient();

  const { mutate: submitReview, isLoading } = useMutation(api.addReview, {
    onSuccess: (data) => {
      toast.success('Review submitted successfully!');
      setRating(0);
      setReview('');
      queryClient.invalidateQueries(['product-reviews', productId]);
      onReviewSubmitted?.();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }

    submitReview({
      images: [],
      "pid": productId,
      rating,
      review: review.trim()
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Review This Product:
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>Rating:</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>
          <TextField
            multiline
            rows={4}
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            fullWidth
            variant="outlined"
          />
          <Box>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ mr: 2 }}
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button variant="outlined" onClick={() => { setRating(0); setComment(''); }}>
              Cancel
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

const ReviewCard = ({ review }) => {
  if (!review) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, py: 3, borderBottom: '1px solid #e0e0e0' }}>
      {/* Avatar */}
      <Avatar
        sx={{ width: 48, height: 48 }}
        src={review.user?.avatar || review.avatar}
      >
        <MdPerson />
      </Avatar>

      {/* Review Content */}
      <Box sx={{ flex: 1 }}>
        {/* User Name */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {review.user?.name || review.userName || review.name || 'Anonymous User'}
        </Typography>

        {/* Purchase Details */}
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          {(review.productDetails?.color || review.color) && (
            <Typography variant="caption" color="text.secondary">
              Color: {review.productDetails?.color || review.color}
            </Typography>
          )}
          {(review.productDetails?.network || review.network) && (
            <Typography variant="caption" color="text.secondary">
              Network: {review.productDetails?.network || review.network}
            </Typography>
          )}
          {(review.productDetails?.size || review.size) && (
            <Typography variant="caption" color="text.secondary">
              Size: {review.productDetails?.size || review.size}
            </Typography>
          )}
        </Stack>

        {/* Rating and Date */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
          <Rating value={review.rating || 0} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }) : 'Date not available'}
          </Typography>
        </Stack>

        {/* Review Comment */}
        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
          {review.comment || review.review || 'No comment provided'}
        </Typography>
      </Box>
    </Box>
  );
};

const RatingBreakdown = ({ reviewsSummary, totalReviews, reviews, totalRating }) => {
  // Use the passed totalRating if available, otherwise calculate from reviews
  let averageRating = totalRating || 0;
  
  // If we have reviews but no totalRating, calculate it
  if (!averageRating && reviews && reviews.length > 0) {
    const totalRatingSum = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    averageRating = totalRatingSum / reviews.length;
  }
  
  // If we have reviewsSummary, calculate from that
  if (!averageRating && reviewsSummary && Object.keys(reviewsSummary).length > 0) {
    const totalRatingSum = Object.entries(reviewsSummary).reduce((sum, [star, count]) => sum + (parseInt(star) * count), 0);
    const totalCount = Object.values(reviewsSummary).reduce((sum, count) => sum + count, 0);
    averageRating = totalCount > 0 ? totalRatingSum / totalCount : 0;
  }

  // Calculate star distribution - Initialize with zeros
  const starDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  
  // Method 1: Handle reviewsSummary as array of objects with _id and count
  if (reviewsSummary && Array.isArray(reviewsSummary) && reviewsSummary.length > 0) {
    reviewsSummary.forEach(item => {
      const star = parseInt(item._id);
      const count = parseInt(item.count) || 0;
      if (star >= 1 && star <= 5) {
        starDistribution[star] = count;
      }
    });
  } 
  // Method 2: Handle reviewsSummary as object (fallback for other API structures)
  else if (reviewsSummary && typeof reviewsSummary === 'object' && !Array.isArray(reviewsSummary) && Object.keys(reviewsSummary).length > 0) {
    // Handle different possible structures
    if (reviewsSummary['1'] !== undefined || reviewsSummary['5'] !== undefined) {
      // Direct star mapping (1, 2, 3, 4, 5)
      Object.entries(reviewsSummary).forEach(([star, count]) => {
        const starNum = parseInt(star);
        if (starNum >= 1 && starNum <= 5) {
          starDistribution[starNum] = parseInt(count) || 0;
        }
      });
    } else if (reviewsSummary.star1 !== undefined || reviewsSummary.star5 !== undefined) {
      // Named properties (star1, star2, etc.)
      for (let i = 1; i <= 5; i++) {
        starDistribution[i] = parseInt(reviewsSummary[`star${i}`]) || 0;
      }
    } else {
      // Fallback: try to extract any numeric keys
      Object.entries(reviewsSummary).forEach(([key, value]) => {
        const starNum = parseInt(key);
        if (starNum >= 1 && starNum <= 5) {
          starDistribution[starNum] = parseInt(value) || 0;
        }
      });
    }
  }
  
  // Method 2: If star distribution is still empty, calculate from reviews array
  const hasDistribution = Object.values(starDistribution).some(count => count > 0);
  if (!hasDistribution && reviews && reviews.length > 0) {
    console.log('Calculating distribution from individual reviews');
    reviews.forEach(review => {
      const rating = Math.round(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        starDistribution[rating]++;
      }
    });
  }

  // Get total count for percentage calculation
  const calculatedTotal = Object.values(starDistribution).reduce((sum, count) => sum + count, 0);
  const totalCount = totalReviews || calculatedTotal || reviews?.length || 0;

  console.log('Final star distribution:', starDistribution);
  console.log('Total count for percentage:', totalCount);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Overall Rating */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {averageRating.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Out of 5
          </Typography>
          <Rating value={averageRating} readOnly precision={0.1} />
        </Box>

        {/* Rating Breakdown */}
        <Box sx={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = starDistribution[star] || 0;
            const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            
            return (
              <Stack key={star} direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ minWidth: 60 }}>
                  {star} star{star !== 1 ? 's' : ''}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      backgroundColor: '#2196f3'
                    }
                  }}
                />
                <Typography variant="body2" sx={{ minWidth: 50, textAlign: 'right' }}>
                  {percentage}% ({count})
                </Typography>
              </Stack>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default function CustomerReviews({ productId, totalRating, totalReviews }) {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: reviewsData, isLoading, error } = useQuery(
    ['product-reviews', productId],
    () => api.getProductReviews(productId),
    {
      enabled: !!productId,
      retry: 3
    }
  );

  // Handle different possible API response structures
  let reviews = [];
  let reviewsSummary = {};

  if (reviewsData) {
    // Try multiple possible data structures
    reviews = reviewsData.reviews || 
              reviewsData.data?.reviews || 
              reviewsData.data || 
              (Array.isArray(reviewsData) ? reviewsData : []);
    
    reviewsSummary = reviewsData.reviewsSummary || 
                    reviewsData.data?.reviewsSummary || 
                    reviewsData.reviewsSummery ||  // Note: checking for typo 'summery'
                    {};
  }

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Customer Reviews
        </Typography>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Loading reviews...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    console.error('Error loading reviews:', error);
    return (
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 2,
          p: 4,
          mb: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Customer Reviews
        </Typography>
        <Alert severity="error">
          Failed to load reviews. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        borderRadius: 2,
        p: 4,
        mb: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#333' }}>
        Customer Reviews
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side - Reviews List */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reviews ({reviews?.length || 0})
          </Typography>
        
        {reviews && reviews.length > 0 ? (
          <Stack spacing={3}>
            {reviews.map((review, index) => (
              <ReviewCard key={review._id || review.id || index} review={review} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No reviews yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to review this product!
            </Typography>
          </Box>
        )}
        </Grid>

        {/* Right Side - Rating Summary */}
        <Grid item xs={12} md={4}>
          <RatingBreakdown 
            reviewsSummary={reviewsSummary} 
            totalReviews={totalReviews} 
            reviews={reviews}
            totalRating={totalRating}
          />
          
          {/* Review Form Section */}
          {!showReviewForm ? (
            <Box sx={{ mt: 3, p: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Review This Product:
              </Typography>
              {isAuthenticated ? (
                <Button
                  variant="contained"
                  startIcon={<MdEdit />}
                  onClick={() => setShowReviewForm(true)}
                  sx={{ textTransform: 'none', width: '100%' }}
                >
                  Write a Review
                </Button>
              ) : (
                <Alert severity="info">
                  Sorry! you need to login to rate this product.{' '}
                  <Link href="/auth/login" style={{ color: '#4caf50', textDecoration: 'none' }}>
                    Login here
                  </Link>
                </Alert>
              )}
            </Box>
          ) : (
            <Card sx={{ p: 3, mt: 3 }}>
              <ReviewForm
                productId={productId}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </Card>
          )}
        </Grid>

        
      </Grid>
    </Box>
  );
}
