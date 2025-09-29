// react
'use client';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// mui
import { Paper, useMediaQuery, Grid, Fab, Stack } from '@mui/material';
// icons
import { IoArrowForward } from 'react-icons/io5';
import { IoArrowBackOutline } from 'react-icons/io5';
// redux
import { useSelector } from 'react-redux';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';
// components
import ProductCard from 'src/components/cards/product';

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
function CarouselItem({ ...props }) {
  const { index, isLoading, largeCard } = props;

  return (
    <Paper
      className="slide-wrapper"
      elevation={0}
      sx={{
        position: 'relative',
        pb: largeCard ? { xs: '60%', sm: '60%', md: '60%' } : { md: '38%', sm: '82%', xs: '142%' },
        zIndex: 11,
        bgcolor: 'transparent',
        borderRadius: 0
      }}
    >
      <ProductCard loading={isLoading} product={index} />
    </Paper>
  );
}

ProductsCarousel.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function ProductsCarousel({ ...props }) {
  const { data, isLoading, slidesToShowProp, largeCard } = props;

  const isLarge = useMediaQuery('(min-width:1200px)');
  const isDesktop = useMediaQuery('(min-width:900px)');
  const isTablet = useMediaQuery('(min-width:600px)');
  const isMobile = useMediaQuery('(max-width:600px)');

  const { themeMode } = useSelector(({ settings }) => settings);

  const [[page, direction], setPage] = useState([0, 0]);
  var slidesToShow = slidesToShowProp
    ? slidesToShowProp
    : isLarge
    ? 6
    : isDesktop
    ? 3
    : isTablet
    ? 2
    : isMobile
    ? 2
    : 6;
  // Slide 3 products per arrow click
  const slidesToScroll = 3;
  // Calculate total positions (pages) based on scroll step instead of full-row pages
  const itemsCount = Array.isArray(data) ? data.length : 0;
  const totalPositions =
    itemsCount <= slidesToShow ? 1 : Math.ceil(Math.max(itemsCount - slidesToShow, 0) / slidesToScroll) + 1;

  const imageIndex = page;
  const startIndex = page * slidesToScroll;
  const pageItems =
    isLoading || !data
      ? Array.from(new Array(slidesToShow))
      : data.slice(startIndex, startIndex + slidesToShow);

  const paginate = (newDirection) => {
    const nextPage = page + newDirection;
    if (nextPage >= 0 && nextPage <= totalPositions - 1) {
      setPage([nextPage, newDirection]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      const nextPage = page + 1;
      if (nextPage >= 0 && nextPage <= totalPositions - 1) {
        setPage([nextPage, 1]);
      }
    }, 12000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        borderRadius: 0,
        width: '100%',
        marginLeft: 0,
        backgroundColor: 'transparent',
        '& .slide-wrapper ': {
          paddingBottom: '60%'
        }
      }}
    >
      <Paper
        className="main-paper"
        elevation={0}
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pt: { lg: '24%', md: '44%', sm: '73%', xs: '86%' },
          overflow: 'hidden',
          width: '100%',
          height: {xs: '330px', md: '100%'},
          ml: 0,
          backgroundColor: 'transparent',
          // remove extra inner padding so slides can reach container edges
          '& .motion-dev': {
            pl: { md: `0 !important`, xs: `0 !important` },
            pr: { md: `0 !important`, xs: `0 !important` }
          }
        }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            className="motion-dev"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              top: 0
            }}
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
            <Grid
              container
              spacing={{ xs: 1, md: 3 }}
              justifyContent={pageItems.length < slidesToShow ? 'flex-start' : 'center'}
            >
              {pageItems.map((item) => (
                <Grid
                  item
                  lg={Math.floor(12 / slidesToShow)}
                  md={Math.floor(12 / slidesToShow)}
                  sm={Math.floor(12 / slidesToShow)}
                  xs={Math.floor(12 / slidesToShow)}
                  key={Math.random()}
                >
                  <CarouselItem
                    themeMode={themeMode}
                    item={data ? item : null}
                    index={data ? item : null}
                    activeStep={imageIndex}
                    isActive={imageIndex}
                    key={Math.random()}
                    isLoading={isLoading}
                    largeCard={largeCard}
                  />
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </AnimatePresence>
      </Paper>
      {!isLoading && !isMobile && (
        // make the arrows container absolute so it doesn't take layout space
        <Stack
          direction={'row'}
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          className="slider-arrows"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            zIndex: 12,
            // allow clicks only on the buttons
            pointerEvents: 'none',
            px: { xs: 1, md: 2 }
          }}
        >
      <Fab
            aria-label="back"
            size="small"
            className="left"
            onClick={() => paginate(-1)}
            disabled={page === 0}
            sx={{
        // allow this element to receive pointer events and center vertically
        pointerEvents: 'auto',
        position: 'absolute',
        left: { xs: 8, md: 12 },
        top: '50%',
        transform: 'translateY(-50%)',
              transition: 'all 0.2s ease-in-out',
              zIndex: 13,
              backgroundColor: 'rgba(255,255,255,0.6)',
              color: '#222',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: 'none',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.75)',
                color: '#000'
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.45)',
                color: '#bdbdbd',
                opacity: 0.5
              }
            }}
          >
            <IoArrowBackOutline size={20} />
          </Fab>
      <Fab
            aria-label="forward"
            size="small"
            className="right"
            onClick={() => paginate(1)}
      disabled={totalPositions - 1 === page}
            sx={{
        pointerEvents: 'auto',
        position: 'absolute',
        right: { xs: 8, md: 12 },
        top: '50%',
        transform: 'translateY(-50%)',
              transition: 'all 0.2s ease-in-out',
              zIndex: 13,
              backgroundColor: 'rgba(255,255,255,0.6)',
              color: '#222',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: 'none',
              borderRadius: '50%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              width: 40,
              height: 40,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.75)',
                color: '#000'
              },
              '&:disabled': {
                backgroundColor: 'rgba(255,255,255,0.45)',
                color: '#bdbdbd',
                opacity: 0.5
              }
            }}
          >
            <IoArrowForward size={20} />
          </Fab>
        </Stack>
      )}
    </Paper>
  );
}
CarouselItem.propTypes = {
  index: PropTypes.any.isRequired,
  isLoading: PropTypes.bool.isRequired
};
