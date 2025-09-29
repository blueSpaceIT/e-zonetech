// react
'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';
// next
import BlurImage from 'src/components/blurImage';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next-nprogress-bar';
// mui
import { Box, Stack, IconButton, useMediaQuery, Tooltip, Typography, Modal } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoIosHeart } from 'react-icons/io';
// redux
import { setWishlist } from 'src/lib/redux/slices/wishlist';
import { useSelector, useDispatch } from 'react-redux';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';

// styles override
import RootStyled from './styled';

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

// ----------------------------------------------------------------------
ProductDetailsCarousel.propTypes = {
  item: PropTypes.object.isRequired,
  onClickWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  _id: PropTypes.string.isRequired
};

function ProductDetailsCarousel({ ...props }) {
  const { item, onClickWishList, wishlist, isLoading, isMobile, _id } = props;
  const [openFull, setOpenFull] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const handleOpenFull = () => {
    // try to initialize modal index to current image if provided
    const start = typeof props.currentIndex === 'number' ? props.currentIndex : 0;
    setModalIndex(start);
  console.log('opening modal start index', start);
  setOpenFull(true);
  };
  const handleCloseFull = () => setOpenFull(false);

  const totalImages = props.allImages ? props.allImages.length : 0;
  const goPrev = () => {
    if (!totalImages) return;
    setModalIndex((i) => (i - 1 + totalImages) % totalImages);
  };
  const goNext = () => {
    if (!totalImages) return;
    setModalIndex((i) => (i + 1) % totalImages);
  };

  const onModalKeyDown = (e) => {
    if (!openFull) return;
    if (e.key === 'ArrowLeft') {
      goPrev();
    } else if (e.key === 'ArrowRight') {
      goNext();
    } else if (e.key === 'Escape') {
      handleCloseFull();
    }
  };

  return (
    <>
    <div className="slide-wrapper">
      <Stack
        sx={{
          bgcolor: 'background.paper',
          position: 'absolute',
          top: isMobile ? 7 : 12,
          right: isMobile ? 5 : 14,
          borderRadius: '50%',
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          img: {
            borderRadius: '50%'
          }
        }}
      >
        {wishlist?.filter((v) => v === _id).length > 0 ? (
          <Tooltip title="Remove from cart">
            <IconButton
              disabled={isLoading}
              onClick={onClickWishList}
              aria-label="add to cart"
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            >
              <IoIosHeart />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Add to wishlist">
            <IconButton
              disabled={isLoading}
              onClick={onClickWishList}
              aria-label="add to wishlist"
              size={isMobile ? 'small' : 'medium'}
            >
              <IoMdHeartEmpty />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
      {item && (
        <BlurImage
          onClick={handleOpenFull}
          priority
          fill
          style={{ cursor: 'zoom-in' }}
          objectFit="contain"
          sizes="50%"
          src={item?.url || item?.src}
          alt="hero-carousel"
          placeholder="blur"
          blurDataURL={item.blurDataURL}
        />
      )}
      <Box className="bg-overlay" />
    </div>
    <Modal open={openFull} onClose={handleCloseFull} closeAfterTransition backdropProps={{ invisible: false }}>
        <Box tabIndex={0} onKeyDown={onModalKeyDown} sx={{ position: 'fixed', inset: 0, bgcolor: '#fff', color: 'text.primary', display: 'flex', flexDirection: 'column', p: 2, alignItems: 'center' }}>
          <IconButton onClick={handleCloseFull} sx={{ position: 'absolute', top: 12, right: 12, color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' }}>
            ✕
          </IconButton>

          {/* left/right navigation arrows */}
          {totalImages > 1 && (
            <>
              <IconButton
                onClick={goPrev}
                aria-label="previous image"
                size="large"
                sx={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={goNext}
                aria-label="next image"
                size="large"
                sx={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'text.primary', bgcolor: 'rgba(0,0,0,0.04)' }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            {props.allImages && props.allImages[modalIndex] ? (
              <img
                src={props.allImages[modalIndex]?.large || props.allImages[modalIndex]?.url || props.allImages[modalIndex]?.src}
                alt="full"
                style={{ maxHeight: 'calc(100vh - 160px)', maxWidth: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Box sx={{ color: 'grey.300' }}>No image</Box>
            )}
          </Box>

          <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto', pb: 1, width: '100%', justifyContent: 'center', maxWidth: 1200 }}>
            {props.allImages && props.allImages.map((img, idx) => (
              <Box
                key={idx}
                onClick={() => setModalIndex(idx)}
                sx={{
                  width: 80,
                  height: 80,
                  flex: '0 0 80px',
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: idx === modalIndex ? '0 0 0 2px rgba(255,255,255,0.12)' : 'none',
                  border: idx === modalIndex ? '2px solid' : '2px solid transparent',
                  borderColor: idx === modalIndex ? 'primary.main' : 'transparent',
                  cursor: 'pointer'
                }}
              >
                <BlurImage
                  priority
                  objectFit="cover"
                  sizes="80px"
                  src={img?.src || img?.url}
                  alt={`thumb-${idx}`}
                  placeholder="blur"
                  blurDataURL={img.blurDataURL}
                  width={80}
                  height={80}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default function CarouselAnimation({ ...props }) {
  const { product, data: others } = props;
  console.log(product, 'imageIndex');
  const dispatch = useDispatch();
  const _id = others?._id;

  const images = product?.images && product.images.length > 0 ? product.images : [];
  
  // If no images available, show a placeholder or return null
  if (!images || images.length === 0) {
    return (
      <RootStyled>
        <Box
          sx={{
            width: '100%',
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            color: 'text.secondary',
            borderRadius: 1
          }}
        >
          <Typography variant="body2">No images available</Typography>
        </Box>
      </RootStyled>
    );
  }

  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { mutate } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err?.response?.data?.message);
      toast.error(message);
    }
  });
  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      await mutate(_id);
    }
  };
  const isMobile = useMediaQuery('(max-width:600px)');
  const { themeMode } = useSelector(({ settings }) => settings);
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % images?.length);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <RootStyled>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          className="motion-dev"
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        >
          <ProductDetailsCarousel
            themeMode={themeMode}
            item={images[imageIndex]}
            index={images[imageIndex]}
            activeStep={imageIndex}
            isActive={imageIndex}
            key={Math.random()}
            isLoading={isLoading}
            wishlist={wishlist}
            onClickWishList={onClickWishList}
            isMobile={isMobile}
            _id={_id}
            allImages={images}
            currentIndex={imageIndex}
          />
        </motion.div>
      </AnimatePresence>
      <Stack
        direction="row"
        justifyContent={images.length < 6 ? 'center' : 'left'}
        spacing={1}
        className="controls-wrapper"
      >
        {images.map((item, i) => (
          <Box
            key={Math.random()}
            className={`controls-button ${imageIndex === i ? 'active' : ''}`}
            onClick={() => {
              setPage([i, i]);
            }}
          >
            <BlurImage
              priority
              fill
              objectFit="cover"
              sizes="14vw"
              src={item?.src || item?.url}
              alt="hero-carousel"
              placeholder="blur"
              blurDataURL={item.blurDataURL}
            />
          </Box>
        ))}
      </Stack>
    </RootStyled>
  );
}
CarouselAnimation.propTypes = {
  product: PropTypes.object,
  data: PropTypes.object
};
