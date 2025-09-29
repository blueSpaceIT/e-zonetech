'use client';
import * as React from 'react';
// mui
import { Menu, MenuItem } from '@mui/material';
// mui
import LoadingButton from '@mui/lab/LoadingButton';
// icons
import { IoIosArrowDown } from 'react-icons/io';
// react
import { useMutation } from 'react-query';
// next
import { useRouter } from 'next-nprogress-bar';
// api
import * as api from 'src/services';
// toast
import toast from 'react-hot-toast';

import PropTypes from 'prop-types';

SelectOrderStatus.propTypes = {
  data: PropTypes.object.isRequired
};

export default function SelectOrderStatus({ data }) {
  const router = useRouter();

  const { mutate, isLoading } = useMutation(api.updateOrderStatus, {
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/dashboard/orders');
    },
    onError: () => {
      toast.error('Something went wrong!');
    }
  });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (props) => {
    setSelected(props);
    if (props !== selected) {
      mutate({ id: data?._id, status: props });
    }
    setAnchorEl(null);
  };

  return (
    <>
      <LoadingButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="outlined"
        endIcon={<IoIosArrowDown />}
        sx={{ ml: 1 }}
        loading={isLoading || !data}
        loadingPosition="end"
      >
        {selected ? selected : data?.status || 'Loading'}
      </LoadingButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose(selected)}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {['pending', 'ontheway', 'delivered', 'returned', 'cancelled'].map((status) => (
          <MenuItem sx={{ textTransform: 'capitalize' }} key={status} onClick={() => handleClose(status)}>
            {status}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
