import React from 'react';
import { useRouter } from 'next-nprogress-bar';
import { usePathname } from 'next/navigation';

// reduxt
import { useDispatch } from 'react-redux';
import { setLogout } from 'src/lib/redux/slices/user';
import { resetWishlist } from 'src/lib/redux/slices/wishlist';

// mui
import { Typography, Divider, ListItemIcon, Button, MenuItem, Box } from '@mui/material';
import { LuLogOut } from 'react-icons/lu';
import { MdKey } from 'react-icons/md';
import { LiaFileInvoiceSolid } from 'react-icons/lia';
import { IoIosHeartEmpty } from 'react-icons/io';
import { LuLayoutDashboard } from 'react-icons/lu';

import { SlHome } from 'react-icons/sl';
import { TbUserSquareRounded } from 'react-icons/tb';

// styles
import RootStyled from './styled';
import { deleteCookies } from 'src/hooks/cookies';

import PropTypes from 'prop-types';

UserList.propTypes = {
  openUser: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  setOpen: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

export default function UserList({ ...props }) {
  const { openUser, user, setOpen, isAuthenticated } = props;
  const allowedRoles = ['admin', 'manager', 'accountant', 'super admin'];
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const toggleLogout = () => {
    if (pathname.includes('dashboard') || pathname.includes('profile')) {
      router.push('/auth/login');
    }
  };

  return (
    <RootStyled autoFocusItem={openUser} id="composition-menu">
      <Box px={2}>
        <Typography variant="body1" color="text.primary" fontWeight={600} noWrap>
          {user?.firstName + ' ' + user?.lastName} {allowedRoles.includes(user?.role) ? `(${user?.role})` : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary" pb={1} noWrap>
          {user?.email}
        </Typography>
      </Box>
      <Divider />
      <MenuItem
        className="menu-item"
        onClick={() => {
          router.push('/');
          setOpen(false);
        }}
      >
        <ListItemIcon className="menu-icon">
          <SlHome />
        </ListItemIcon>
        Home
      </MenuItem>
  {allowedRoles.includes(user.role) ? (
        <MenuItem
          onClick={() => {
            router.push('/dashboard');
            setOpen(false);
          }}
        >
          <ListItemIcon className="menu-icon">
            <LuLayoutDashboard />
          </ListItemIcon>
          Dashboard
        </MenuItem>
  ) : null}
      <MenuItem
        onClick={() => {
          setOpen(false);

          router.push(isAuthenticated ? '/profile/wishlist' : '/auth/login');
        }}
      >
        <ListItemIcon className="menu-icon">
          <IoIosHeartEmpty />
        </ListItemIcon>
        Wishlist
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
          router.push('/profile/orders');
        }}
      >
        <ListItemIcon className="menu-icon">
          <LiaFileInvoiceSolid />
        </ListItemIcon>
        Orders
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
            router.push(allowedRoles.includes(user.role) ? '/dashboard/settings' : '/profile/general');
        }}
      >
        <ListItemIcon className="menu-icon">
          <TbUserSquareRounded />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          setOpen(false);
            router.push(
              allowedRoles.includes(user.role)
                ? '/dashboard/settings/change-password'
                : '/profile/change-password'
            );
        }}
      >
        <ListItemIcon className="menu-icon">
          <MdKey />
        </ListItemIcon>
        Change Password
      </MenuItem>
      <Box px={2} mt={1}>
        <Button
          onClick={() => {
            deleteCookies('token');
            dispatch(setLogout());
            dispatch(resetWishlist());
            setOpen(false);
            toggleLogout();
          }}
          variant="outlined"
          color="inherit"
          startIcon={<LuLogOut />}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </RootStyled>
  );
}
