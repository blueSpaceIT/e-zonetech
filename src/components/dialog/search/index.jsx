import * as React from 'react';
// react js
import { IoSearchOutline } from 'react-icons/io5';
// mui
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
// components
import Search from './search';

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} name="search">
        <IoSearchOutline />
      </IconButton>
      <Dialog open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: 600 } }}>
        <Search onClose={handleClose} />
      </Dialog>
    </>
  );
}
