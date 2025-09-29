'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';

import { useMutation } from 'react-query';

// mui
import {
  Box,
  Card,
  Typography,
  Stack,
  CircularProgress,
  IconButton,
  Rating,
  Zoom,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';

// redux
import { addCart } from 'src/lib/redux/slices/product';
import { useDispatch } from 'src/lib/redux/store';
import { setWishlist } from 'src/lib/redux/slices/wishlist';
import { useSelector } from 'react-redux';
// next
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// components
import ColorPreview from 'src/components/colorPreview';
import SizePreview from 'src/components/sizePicker';
import Label from 'src/components/label';
import { fCurrency } from 'src/utils/formatNumber';
import BlurImage from 'src/components/blurImage';
// icons
import { IoMdHeartEmpty } from 'react-icons/io';
// api
import * as api from 'src/services';
// toast
import { toast } from 'react-hot-toast';
// icons

import ColorPreviewGroup from '../colorPreviewGroup';
import { BsCartPlus } from 'react-icons/bs';
import { FaRegStar } from 'react-icons/fa';
import { IoIosHeart } from 'react-icons/io';

export default function ShopProductCard({ ...props }) {
  const { product, category, loading } = props;
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  // type error
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isLoading, setLoading] = useState(false);

  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err.response.data.message);
      toast.error(t(message ? t('common:' + JSON.parse(message)) : t('common:something-wrong')));
    }
  });
  // status,
  const { name, slug, image, _id } = !loading && product;
  const linkTo = category ? '/categories/abc' : `/product/${slug ? slug : ''}`;

  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate({
        pid: _id
      });
    }
  };
  // collapse state
  const [isCollapseVisible, setCollapseVisible] = useState(false);
  const [currentColor, setColor] = useState(0);
  const [currentSize, setSize] = useState(0);
  const handleTypographyHover = () => {
    setCollapseVisible(true);
  };

  const handleTypographyLeave = () => {
    setCollapseVisible(false);
  };

  const onAddToCart = (event) => {
    event.stopPropagation();
    const { image } = product;
    const color = product?.colors.find((_, index) => index === currentColor);
    const size = product?.sizes.find((_, index) => index === currentSize);

    console.log('🛒 OldProductCard - Full product object:', product);
    console.log('🛒 OldProductCard - Product shipping field:', product?.shipping);
    dispatch(
      addCart({
        pid: product._id,
        sku: product.sku,
        quantity: 1,
        color,
        image,
        size,
        shipping: product?.shipping || 0,
        price: product.priceSale === 0 ? product.price : product.priceSale,
        priceSale: product.priceSale === 0 ? product.price : product.priceSale,
        subtotal: product.priceSale || product?.price
      })
    );
    toast.success('Product added in cart');
  };
  return (
    <Card
      sx={{
        display: 'block',
        boxShadow:
          theme.palette.mode === 'light' ? '0 6px 16px rgba(145, 158, 171, 25%)' : '0 6px 16px rgb(5 6 6 / 25%)',
        '&:hover': {
          border: '1px solid ' + theme.palette.primary.main + '!important'
        }
      }}
      onMouseEnter={handleTypographyHover}
      onMouseLeave={handleTypographyLeave}
    >
      <Box
        sx={{
          position: 'relative',
          borderBottom: isCollapseVisible
            ? '1px solid ' + theme.palette.primary.main
            : '1px solid ' + theme.palette.divider
        }}
      >
        {!loading && product?.price > product?.priceSale && product.averageRating && (
          <Label
            variant="filled"
            color={'primary'}
            sx={{
              top: isMobile ? 8 : 12,
              left: isMobile ? 8 : 12,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              height: 18,
              fontSize: isMobile ? 8 : 12
            }}
          >
            <Stack direction={'row'} gap={0.3} alignItems={'center'}>
              <FaRegStar /> {product.averageRating}
            </Stack>
          </Label>
        )}
        {!loading && product?.available < 1 && (
          <Label
            variant="filled"
            color={'error'}
            sx={{
              top: isMobile ? 8 : 12,
              left: isMobile ? 8 : 12,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
              fontSize: isMobile ? 8 : 12
            }}
          >
            Out of Stock
          </Label>
        )}
        <Box
          onClick={() => !loading && product?.available > 0 && router.push(linkTo)}
          sx={{
            bgcolor: isLoading || loading ? 'transparent' : 'common.white',
            position: 'relative',
            cursor: 'pointer',
            img: {
              transition: 'all 0.2s ease-in',
              objectFit: 'cover',
              borderRadius: '4x 4x 0 0!important'
            },
            '&:hover': {
              img: {
                filter: 'blur(2px)'
              }
            },
            '&:after': {
              content: `""`,
              display: 'block',
              paddingBottom: '100%'
            },
            width: '100%'
          }}
        >
          <Box component={Link} href={linkTo}>
            <BlurImage alt={name} src={image.url} fill draggable="false" />
          </Box>
        </Box>
        {loading ? (
          ''
        ) : (
          <Zoom in={isCollapseVisible}>
            <div>
              <Box
                sx={{
                  borderWidth: '1px 1px 0 1px',
                  borderStyle: 'solid',
                  borderColor: theme.palette.primary.main,
                  bgcolor: 'background.paper',
                  position: 'absolute',
                  bottom: -1,
                  p: 0.7,
                  textAlign: 'center',
                  borderRadius: '8px 8px 0 0',
                  transform: 'translateX(-50%)',
                  left: '50%'
                }}
              >
                <ColorPreview color={currentColor} setColor={setColor} colors={product?.colors} loading={loading} />
              </Box>
            </div>
          </Zoom>
        )}
      </Box>
      {isMobile ? (
        <Stack sx={{ py: 1.5, px: 1 }}>
          <Typography component={Link} href={linkTo} color="text.primary" variant="subtitle2" lineHeight={1.3} noWrap>
            {name}
          </Typography>
          <Typography variant="body2">{<> &nbsp;{fCurrency(product?.priceSale)}</>}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            {<Rating value={product?.averageRating} readOnly size="small" />}
            {<ColorPreviewGroup limit={3} colors={product?.colors} sx={{ minWidth: 72 }} />}
          </Stack>
        </Stack>
      ) : (
        <Stack
          justifyContent="center"
          sx={{
            zIndex: 111,
            p: 1,
            width: '100%',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen
            }),
            mt: 0,
            ...(isCollapseVisible && {
              transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
              })
            }),
            a: {
              color: 'text.primary',
              textDecoration: 'none'
            }
          }}
        >
          <Stack sx={{ mb: '0!important' }} justifyContent="space-between" direction="row" alignItems="center">
            <Link href={linkTo}>
              <Box sx={{ display: 'grid' }}>
                {' '}
                <Typography
                  sx={{
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                    // fontWeight: 500,
                  }}
                  variant={'subtitle1'}
                  noWrap
                >
                  {name}
                </Typography>
              </Box>
            </Link>
          </Stack>
          <Typography
            sx={{
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontWeight: 500
            }}
            variant={'body2'}
            color="text.secondary"
            noWrap
          >
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </Typography>

          <Stack spacing={0.5}>
            <Typography variant="subtitle2" fontWeight={600}>
              Size
            </Typography>
            <SizePreview size={currentSize} setSize={setSize} sizes={product?.sizes} loading={loading} />
          </Stack>

          <Stack spacing={0.5} direction="row" justifyContent={'space-between'} alignItems="center">
            <Typography
              variant={isMobile ? 'body2' : 'h5'}
              component="p"
              sx={{
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                '& .discount': {
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'error.main',
                  ml: 0.5
                }
              }}
            >
              <>
                <span>{fCurrency(product?.priceSale)}</span>
                <span className="discount">
                  ({`-${(100 - (product?.priceSale / product?.price) * 100).toFixed()}%`})
                </span>
              </>
            </Typography>
            <Stack direction={'row'}>
              <Tooltip title="Add to cart">
                <IconButton aria-label="add to cart" disabled={loading || product?.available < 1} onClick={onAddToCart}>
                  <BsCartPlus />
                </IconButton>
              </Tooltip>

              {isLoading ? (
                <Box sx={{ p: 1, height: 40 }}>
                  <CircularProgress
                    sx={{
                      width: '24px!important',
                      height: '24px!important'
                    }}
                  />
                </Box>
              ) : wishlist?.filter((v) => v === _id).length > 0 ? (
                <Tooltip title="Remove from cart">
                  <IconButton onClick={onClickWishList} aria-label="add to cart" color="primary">
                    <IoIosHeart />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Add to wishlist">
                  <IconButton onClick={onClickWishList} aria-label="add to wishlist">
                    <IoMdHeartEmpty />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
    </Card>
  );
}
ShopProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    slug: PropTypes.string,
    sku: PropTypes.string,
    status: PropTypes.string,
    image: PropTypes.object.isRequired,
    price: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    available: PropTypes.number,
    averageRating: PropTypes.number,
    colors: PropTypes.arrayOf(
      PropTypes.shape({
        // Define color properties if applicable
      })
    ),
    sizes: PropTypes.arrayOf(
      PropTypes.shape({
        // Define size properties if applicable
      })
    )
  }),
  category: PropTypes.bool,
  loading: PropTypes.bool.isRequired
};
