import * as React from 'react';
// react js
import { IoSearchOutline } from 'react-icons/io5';
// mui
import {
  Button,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Popper,
  ClickAwayListener,
  useMediaQuery
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
// components
import Search from 'src/components/dialog/search/search';

export default function SearchBar() {
  const isMobile = useMediaQuery('(max-width:768px)');

  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const anchorRef = React.useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  return (
    <>
      {/* Inline input for desktop, fallback button to open dialog on mobile */}
      {isMobile ? (
        <Button
          onClick={handleDialogOpen}
          endIcon={
            <Box
              sx={{
                bgcolor: '#007EFC',
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <IoSearchOutline size={16} />
            </Box>
          }
          sx={{
            width: '100%',
            justifyContent: 'space-between',
            bgcolor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '50px',
            color: '#6c757d',
            textTransform: 'none',
            px: 2,
            py: 2.5,
            '&:hover': {
              bgcolor: '#e9ecef',
              border: '1px solid #dee2e6'
            }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#6c757d',
              fontWeight: 400,
              fontSize: '14px'
            }}
          >
            What are you looking for?
          </Typography>
        </Button>
      ) : (
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            <TextField
              variant="standard"
              inputRef={anchorRef}
              placeholder="What are you looking for?"
              fullWidth
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={handleOpen}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end" sx={{ mr: 1 }}>
                    <Box
                      sx={{
                        bgcolor: '#007EFC',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <IoSearchOutline size={16} />
                    </Box>
                  </InputAdornment>
                )
              }}
              sx={{
                bgcolor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '50px',
                color: '#6c757d',
                '& .MuiInputBase-input': { py: 1.5, px: 2, color: '#6c757d' }
              }}
            />

            <Popper
              open={open && Boolean(anchorRef.current)}
              anchorEl={anchorRef.current}
              placement="bottom-start"
              style={{ width: anchorRef.current ? anchorRef.current.offsetWidth : undefined, zIndex: 1400 }}
            >
              <Box sx={{ boxShadow: 3, bgcolor: 'background.paper', borderRadius: 1, mt: 1 }}>
                <Search onClose={handleClose} mobile={false} showInput={false} searchValue={searchValue} onSearchChange={setSearchValue} />
              </Box>
            </Popper>
          </Box>
        </ClickAwayListener>
      )}

      {/* mobile dialog (unchanged behaviour) */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          '& .MuiPaper-root': {
            width: 600,
            maxWidth: '90vw'
          }
        }}
      >
        <Search onClose={handleDialogClose} mobile />
      </Dialog>
    </>
  );
}
