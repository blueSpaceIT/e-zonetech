import * as React from 'react';
// react js
import { IoSearchOutline } from 'react-icons/io5';
// mui
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  DialogContent,
  Grow,
  IconButton,
  InputAdornment,
  Popper,
  Slide,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
// components
import Search from 'src/components/dialog/search/search';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SearchBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');
  const isTablet = useMediaQuery('(min-width:769px) and (max-width:1024px)');
  const isLargeDesktop = useMediaQuery('(min-width:1200px)');
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const anchorRef = React.useRef(null);
  const handleOpen = React.useCallback(() => setOpen(true), []);
  const handleClose = React.useCallback(() => {
    setOpen(false);
    if (!searchValue.trim()) return;
  }, [searchValue]);

  const handleDialogOpen = React.useCallback(() => setDialogOpen(true), []);
  const handleDialogClose = React.useCallback(() => setDialogOpen(false), []);
  const handleSearch = React.useCallback(async (value) => {
    if (!value.trim()) return;
    setIsSearching(true);
    try {
      console.log('Performing search for:', value);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearchValue('');
      setIsSearching(false);
    }
  }, []);

  const handleSearchIconClick = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleSearch(searchValue);
    },
    [handleSearch, searchValue]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch(searchValue);
      }
    },
    [handleSearch, searchValue]
  );

  const searchIcon = (
    <IconButton
      size="small"
      onClick={handleSearchIconClick}
      disabled={isSearching || !searchValue.trim()}
      sx={{
        bgcolor: searchValue.trim() ? '#007EFC' : 'grey.300',
        color: 'white',
        borderRadius: '50%',
        p: 0.5,
        transition: theme.transitions.create(['bgcolor'], { duration: theme.transitions.duration.short }),
        '&:hover': {
          bgcolor: searchValue.trim() ? alpha(theme.palette.primary.main, 0.8) : 'grey.400'
        },
        '&.Mui-disabled': {
          bgcolor: 'grey.300',
          color: 'grey.500'
        }
      }}
    >
      {isSearching ? <CircularProgress size={16} color="inherit" thickness={4} /> : <IoSearchOutline size={18} />}
    </IconButton>
  );

  const popperContent = (
    <Grow in={open} timeout={200}>
      <Box
        sx={{
          boxShadow: theme.shadows[4],
          bgcolor: 'background.paper',
          borderRadius: 1,
          mt: 0.5,
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          minWidth: '320px',
          maxWidth: isTablet ? '90vw' : '100%',
          maxHeight: isTablet ? '70vh' : '500px',
          width: anchorRef.current ? anchorRef.current.offsetWidth : 'auto',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.100'
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.300',
            borderRadius: 3
          }
        }}
      >
        <Search
          onClose={handleClose}
          mobile={isTablet}
          showInput={false}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
        />
      </Box>
    </Grow>
  );

  return (
    <>
      {isMobile ? (
        <Button
          onClick={handleDialogOpen}
          endIcon={searchIcon}
          disabled={isSearching}
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            bgcolor: 'background.default',
            border: 1,
            borderColor: 'divider',
            borderRadius: 5,
            color: 'text.secondary',
            textTransform: 'none',
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '13px', sm: '14px' },
            transition: theme.transitions.create(['border-color', 'background-color'], {
              duration: theme.transitions.duration.short
            }),
            '&:hover': {
              bgcolor: alpha(theme.palette.action.hover, 0.08),
              borderColor: 'action.active'
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled'
            }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'inherit',
              fontWeight: 400,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
              textAlign: 'left'
            }}
          >
            {searchValue.trim() || 'What are you looking for?'}
          </Typography>
        </Button>
      ) : (
        <ClickAwayListener onClickAway={handleClose}>
          <Box sx={{ width: '100%' }}>
            {' '}
            <TextField
              variant="outlined"
              inputRef={anchorRef}
              placeholder="What are you looking for?"
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleOpen}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              InputProps={{
                endAdornment: <InputAdornment position="end">{searchIcon}</InputAdornment>
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.default',
                  borderRadius: 5,
                  transition: theme.transitions.create(['border-color', 'box-shadow'], {
                    duration: theme.transitions.duration.short
                  }),
                  '& fieldset': {
                    borderColor: 'divider',
                    borderWidth: 1
                  },
                  '&:hover fieldset': {
                    borderColor: 'action.active'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  }
                },
                '& .MuiInputBase-input': {
                  py: 1.5,
                  px: 2,
                  color: 'text.primary',
                  fontSize: '14px'
                },

                maxWidth: '100%',
                width: '100%'
              }}
            />
            <Popper
              open={open && Boolean(anchorRef.current)}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              style={{
                zIndex: 1400,
                maxWidth: isTablet ? '90vw' : 'none'
              }}
              disablePortal={false}
              modifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 8]
                  }
                },
                {
                  name: 'preventOverflow',
                  enabled: true,
                  options: {
                    altAxis: true,
                    altBoundary: true,
                    tether: true,
                    rootBoundary: 'viewport',
                    padding: 8
                  }
                }
              ]}
            >
              {popperContent}
            </Popper>
          </Box>
        </ClickAwayListener>
      )}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        TransitionProps={{
          timeout: { enter: theme.transitions.duration.enteringScreen, exit: theme.transitions.duration.leavingScreen }
        }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            bgcolor: 'background.default',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogContent sx={{ p: 0, overflow: 'auto', maxHeight: 'calc(90vh - 64px)' }}>
          <Search
            onClose={handleDialogClose}
            mobile
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearch={handleSearch}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
