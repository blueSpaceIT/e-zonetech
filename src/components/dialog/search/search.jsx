'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
// next
import { useRouter } from 'next-nprogress-bar';
// mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import { InputAdornment, Stack } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import CircularProgress from '@mui/material/CircularProgress';
// components
import NoDataFound from 'src/components/illustrations/noDataFound';
import { useMutation } from 'react-query';
import BlurImageAvatar from '../../avatar';
// api
import * as api from 'src/services';

Search.propTypes = {
  onClose: PropTypes.func.isRequired,
  mobile: PropTypes.bool.isRequired,
  // optional props for inline dropdown usage
  showInput: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func
};

export default function Search({ ...props }) {
  const { onClose, mobile, showInput = true, searchValue, onSearchChange } = props;

  const [state, setstate] = React.useState({ products: [] });
  const [loading, setLoading] = React.useState(true);

  const router = useRouter();

  // local search state if parent doesn't control it
  const [searchLocal, setSearchLocal] = React.useState('');
  const search = typeof searchValue === 'string' ? searchValue : searchLocal;
  const setSearch = onSearchChange ?? setSearchLocal;

  const { mutate } = useMutation('search', api.search, {
    onSuccess: (data) => {
      setLoading(false);
      // keep only products from API response
      setstate({ products: data?.products || [] });
    }
  });

  const [focus, setFocus] = React.useState(true);

  const handleListItemClick = (slug, type) => {
    !mobile && onClose(slug);
    router.push(
      type === 'brand' ? `/products?brand=${slug}` : type === 'category' ? `/products/${slug}` : `/product/${slug}`
    );
  };
  const onKeyDown = (e) => {
    if (e.keyCode == '38' || e.keyCode == '40') {
      setFocus(false);
    }
  };
  React.useEffect(() => {
    const query = (search || '').trim();

    // If input is empty, don't call the API — clear results and stop loading
    if (!query) {
      setLoading(false);
      setstate({ products: [] });
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      mutate({ query: search });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <>
      {showInput && (
        <TextField
          id="standard-basic"
          variant="standard"
          onFocus={() => setFocus(true)}
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ justifyContent: 'center' }}>
                {loading ? (
                  <CircularProgress sx={{ width: '24px !important', height: '24px !important' }} />
                ) : (
                  <SearchIcon />
                )}
              </InputAdornment>
            )
          }}
          sx={{
            ...(mobile && {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              bgcolor: 'background.paper'
            }),
            '& .MuiInput-root': {
              height: { lg: 72, md: 72, sm: 72, xs: 56 }
            },
            '& .MuiInputAdornment-root': {
              width: 100,
              mr: 0,
              svg: {
                mx: 'auto',
                color: 'primary.main'
              }
            }
          }}
        />
      )}
      <Box className="scroll-main">
  <Box sx={{ height: 'auto', maxHeight: mobile ? 'auto' : '400px', overflow: 'auto' }}>
          {/* {!loading && !Boolean(state.products.length) && (
              <>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    svg: {
                      width: 300,
                      height: 380
                    }
                  }}
                >
                  <NoDataFound className="svg" />
                </Stack>
              </>
            )} */}

          <>
            <>
              {/* brands removed - search shows products only */}
            </>
            {/* categories removed - search shows products only */}
            {!loading && !Boolean(state.products.length) ? (
              ''
            ) : (
              <>
                <MenuList
                  sx={{
                    pt: 0,
                    overflow: 'auto',
                    px: 1,
                    li: {
                      borderRadius: '4px',
                      border: `1px solid transparent`,
                      '&:hover, &.Mui-focusVisible, &.Mui-selected ': {
                        border: (theme) => `1px solid ${theme.palette.primary.main}`,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                        h6: {
                          color: 'primary.main'
                        }
                      }
                    }
                  }}
                  autoFocusItem={!focus}
                >
                  {/* <Typography variant="subtitle2" color="text.primary" p={2} textTransform="uppercase">
                    {loading ? <Skeleton variant="text" width={150} /> : 'Products'}
                  </Typography> */}
                  {(loading ? Array.from(new Array(mobile ? 4 : 2)) : state.products).map((product) => (
                    <MenuItem key={product?.id} onClick={() => handleListItemClick(product?.slug, 'product')}>
                      <ListItemIcon>
                        {loading ? (
                          <Skeleton variant="circular" width={40} height={40} />
                        ) : (
                          <BlurImageAvatar
                            alt={product.name}
                            src={product.images[0].url}
                            priority
                            layout="fill"
                            objectFit="cover"
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText>
                        <Typography variant="subtitle1" color="text.primary" noWrap>
                          {loading ? <Skeleton variant="text" /> : product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {loading ? <Skeleton variant="text" /> : product.category?.name}
                        </Typography>
                      </ListItemText>
                    </MenuItem>
                  ))}
                </MenuList>
              </>
            )}
          </>
        </Box>
      </Box>
    </>
  );
}
