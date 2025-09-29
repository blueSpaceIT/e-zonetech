'use client';
import PropTypes from 'prop-types';
// next
import Link from 'next/link';
// mui
import { Typography, CardActionArea, Card, Box, Skeleton, Stack } from '@mui/material';
// components
import Image from 'src/components/blurImage';

export default function CategoriesCard({ ...props }) {
  const { category, isLoading } = props;
  const baseUrl = '/products/';

  return (
    <Stack spacing={1} alignItems="center">
      <Card
        sx={{
          borderRadius: '50%',
          borderWidth: '1px !important',
          transform: 'scale(1.0)',
          transition: 'all 0.2s ease-in-out',
          width: { xs: 90, md: 150 },
          height: { xs: 90, md: 150 },
          border: isLoading && 'none !important',
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 50%, #90CAF9 100%)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.01)',
          '&:hover': {
            color: '#E5F3FF',
            borderColor: (theme) => theme.palette.primary.main + '!important',
            transform: 'scale(1.005)',
            background: 'linear-gradient(135deg, #BBDEFB 0%, #90CAF9 50%, #64B5F6 100%)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.05)'
          },
          '& .image-wrapper': {
            position: 'relative',
            width: '100%',
            img: {
              borderRadius: '50%'
            },
            '&:after': {
              content: `""`,
              display: 'block',
              paddingBottom: '100%'
            }
          }
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            sx={{
              position: 'absolute',
              height: '100%',
              width: '100%'
            }}
          />
        ) : (
          <CardActionArea className="card-action-area" component={Link} href={`${baseUrl + category?.slug}`}>
            <Box p={0.4} sx={{ bgcolor: (theme) => theme.palette.background.default }}>
              <Box className="image-wrapper">
                <Image
                  alt="category"
                  src={category?.cover?.url}
                  placeholder="blur"
                  blurDataURL={category?.cover?.blurDataURL}
                  layout="fill"
                  objectFit="contain"
                  static
                  draggable="false"
                  quality={5}
                  sizes={'50vw'}
                />
              </Box>
            </Box>
          </CardActionArea>
        )}
      </Card>
      <Typography
        {...(!isLoading && {
          component: Link,
          href: baseUrl + category.slug
        })}
        color="text.primary"
        variant="subtitle2"
        textAlign="center"
        maxWidth={140}
        className="title"
        sx={{ py: 0.5, textTransform: 'capitalize' }}
      >
        {isLoading ? <Skeleton variant="text" width={100} /> : category?.name}
      </Typography>
    </Stack>
  );
}
CategoriesCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string.isRequired
    }),
    name: PropTypes.string.isRequired
  }).isRequired
};
