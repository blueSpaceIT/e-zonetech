'use client';
// react
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// next
import Image from 'next/image';
import Link from 'next/link';
// mui
import {
  Box,
  Paper,
  Button,
  Typography,
  Container,
  useMediaQuery,
  Stack,
  alpha
} from '@mui/material';
// redux
import { useSelector } from 'react-redux';
// framer motion
import { motion, AnimatePresence } from 'framer-motion';
import { varFadeInRight, MotionContainer } from 'src/components/animate';
// components
import Actions from './actions';

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
CarouselItem.propTypes = {
  item: PropTypes.shape({
    cover: PropTypes.string.isRequired,
    heading: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    btnPrimary: PropTypes.shape({
      url: PropTypes.string.isRequired,
      btnText: PropTypes.string.isRequired
    }).isRequired,
    btnSecondary: PropTypes.shape({
      url: PropTypes.string.isRequired,
      btnText: PropTypes.string.isRequired
    })
  }).isRequired,
  index: PropTypes.number.isRequired,
  themeMode: PropTypes.string.isRequired
};

function CarouselItem({ ...props }) {
  const { item, index, themeMode } = props;
  const isMobile = useMediaQuery('@media (max-width: 992px)');
  const [first, setfirst] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setfirst(true);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <Paper
      sx={{
        position: 'relative',
  // keep a consistent desktop aspect ratio (1480x400) across breakpoints
  // so the banner doesn't get clipped on mobile. The width constrains the
  // height via aspectRatio.
  aspectRatio: '1480/400',
        borderRadius: 0,
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Product Image - Positioned on the right */}
      <Box
        sx={{
          position: 'absolute',
          right: { xs: '0px', md: '0px' },
          width: '100%',
          height: '100%',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            '& img': {
              filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))'
            },
            overflow: 'hidden',
            borderRadius: '20px',
          }}
        >
          <Image
            priority
            src={item.cover}
            alt="product banner"
            layout="fill"
            objectFit="cover"
            quality={90}
            draggable="false"
            
          />
        </Box>
      </Box>

      {/* Content Container - Left side */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 3, 
        height: '100%',
        maxWidth: { xs: '100%', md: 'lg' },
        mx: 'auto',
        px: { xs: 3, md: 3 }
      }}>
        {/* Only show content if heading, description, or buttons are available */}
        {(item?.heading || item?.description || item?.btnPrimary || item?.btnSecondary) && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: { xs: 0, md: 0 },
              transform: 'translateY(-50%)',
              width: '100%',
              maxWidth: { md: '50%', sm: '60%', xs: '100%' },
              textAlign: 'left',
              color: 'common.white',
              px: { xs: 2, md: 0 }
            }}
          >
            <MotionContainer open={first}>
              {/* Show heading only if available */}
              {item?.heading && (
                <motion.div variants={varFadeInRight}>
                  <Typography
                    variant="h1"
                    color={item.color}
                    component="h1"
                    lineHeight={1.1}
                    gutterBottom
                    fontWeight="800!important"
                    sx={{
                      pointerEvents: 'none',
                      fontSize: { xs: '1rem', sm: '1.8rem', md: '2.5rem', lg: '2.5rem' },
                      textShadow: '2px 2px 8px rgba(0, 0, 0, 0.11)',
                      mb: { xs: 1, md: 2 },
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {item.heading}
                  </Typography>
                </motion.div>
              )}
              
              {/* Show description only if available */}
              {item?.description && (
                <motion.div variants={varFadeInRight}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color={item.color}
                    sx={{
                      fontWeight: 500,
                      pointerEvents: 'none',
                      marginTop: 1,
                      marginBottom: { xs: 1, md: 2 },
                      textShadow: '1px 1px 4px rgba(0, 0, 0, 0.1)',
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.25rem' },
                      lineHeight: 1.5,
                      opacity: 0.9,
                      maxWidth: { md: '400px', xs: '100%' }
                    }}
                  >
                    {item.description}
                  </Typography>
                </motion.div>
              )}
              
              {/* Show buttons only if at least one is available */}
              {(item?.btnPrimary || item?.btnSecondary) && (
                <motion.div variants={varFadeInRight}>
                  <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ mt: { xs: 1, md: 2 } }}>
                    {/* Show primary button only if available */}
                    {item?.btnPrimary && (
                      <Button
                        size={isMobile ? 'small' : 'large'}
                        variant="contained"
                        component={Link}
                        href={item.btnPrimary.url}
                        sx={{ 
                          py: { xs: 0.5, sm: 1.2, md: 2 },
                          px: { xs: 1.5, sm: 3, md: 5 },
                          fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1.1rem' },
                          fontWeight: 600,
                          backgroundColor: 'common.white',
                          color: 'common.black',
                          borderRadius: '50px',
                          boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                          '&:hover': {
                            backgroundColor: 'common.white',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 12px 35px 0 rgba(0,0,0,0.25)'
                          },
                          transition: 'all 0.3s ease',
                          minWidth: { xs: '80px', sm: '120px', md: '160px' }
                        }}
                      >
                        {item.btnPrimary.btnText || 'Shop Now'}
                      </Button>
                    )}

                    {/* Show secondary button only if available */}
                    {item?.btnSecondary && (
                      <Button
                        size={isMobile ? 'small' : 'large'}
                        variant="outlined"
                        component={Link}
                        href={item.btnSecondary.url}
                        sx={{ 
                          py: { xs: 0.5, sm: 1.2, md: 2 },
                          px: { xs: 1.5, sm: 3, md: 5 },
                          fontSize: { xs: '0.7rem', sm: '0.9rem', md: '1.1rem' },
                          fontWeight: 600,
                          borderColor: 'common.white',
                          color: 'common.white',
                          borderWidth: 2,
                          borderRadius: '50px',
                          '&:hover': {
                            borderColor: 'common.white',
                            backgroundColor: alpha('#ffffff', 0.15),
                            transform: 'translateY(-3px)'
                          },
                          transition: 'all 0.3s ease',
                          minWidth: { xs: '80px', sm: '120px', md: '160px' }
                        }}
                      >
                        {item.btnSecondary.btnText || 'See All'}
                      </Button>
                    )}
                  </Stack>
                </motion.div>
              )}
            </MotionContainer>
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default function SingleSlideCarousel({ ...props }) {
  const { data } = props;
  const { themeMode } = useSelector(({ settings }) => settings);
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % data?.length);

  const paginate = (newDirection) => {
    setPage(([p]) => [p + newDirection, newDirection]);
  };
  useEffect(() => {
    // auto-advance every 3 seconds
    const interval = setInterval(() => {
      setPage(([p]) => [p + 1, 1]);
    }, 3000);

    return () => clearInterval(interval);
    // reset interval if slides change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length]);
  const isEmpty = !Boolean(data?.length);

  return (
    <Paper
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', md: '1480px' },
        mx: 'auto',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
  // ensure the outer container keeps the same aspect ratio as desktop
  aspectRatio: '1480/400',
        borderRadius: 0,
        boxShadow: 'none',
        marginTop: { xs: 0, md: 4 },
      }}
    >
      {isEmpty ? (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" color="text.secondary">
            Slides are not uploaded yet!
          </Typography>
        </Box>
      ) : (
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
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
            <CarouselItem
              themeMode={themeMode}
              item={data ? data[imageIndex] : null}
              index={data ? data[imageIndex] : null}
              activeStep={imageIndex}
              isActive={imageIndex}
              key={Math.random()}
            />
          </motion.div>
        </AnimatePresence>
      )}
      {data.length && (
        <Actions active={imageIndex} themeMode={themeMode} setPage={setPage} paginate={paginate} data={data} />
      )}
    </Paper>
  );
}
SingleSlideCarousel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cover: PropTypes.string.isRequired,
      heading: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      btnPrimary: PropTypes.shape({
        url: PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired
      }).isRequired,
      btnSecondary: PropTypes.shape({
        url: PropTypes.string.isRequired,
        btnText: PropTypes.string.isRequired
      })
    })
  ).isRequired
};
