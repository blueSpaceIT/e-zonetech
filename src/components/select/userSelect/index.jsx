'use client';
import React from 'react';
// mui
import { Avatar, IconButton, Box } from '@mui/material';
// components
import MenuPopover from 'src/components/popover/popover';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import { PATH_PAGE } from 'src/routes/paths';
import { UserList } from 'src/components/lists';
import BlurImageAvatar from 'src/components/avatar';
// redux
import { useSelector } from 'react-redux';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function UserSelect() {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = getKeyByValue(PATH_PAGE.auth, pathname);
  const isHomePath = pathname === '/';
  const anchorRef = React.useRef(null);
  const [openUser, setOpen] = React.useState(false);

  const handleOpenUser = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setOpen(true);
    }
  };
  const handleCloseUser = () => {
    setOpen(false);
  };
  return (
    <Box>
      {!isAuthenticated ? (
        <IconButton
          name="user-select"
          size="small"
          onClick={() => router.push(`/auth/login${isAuthPath || isHomePath ? '' : `?redirect=${pathname}`}`)}
        >
          <Avatar size="small" />
        </IconButton>
      ) : (
        <>
          <IconButton ref={anchorRef} onClick={handleOpenUser} size="small" name="user-select">
            {user?.cover?.url ? (
              <BlurImageAvatar priority alt={user.firstName} src={user?.cover?.url} layout="fill" objectFit="cover" />
            ) : (
              <Avatar alt={user.firstName} src={user?.cover?.url} size="small">
                {user.firstName.slice(0, 1).toUpperCase()}
              </Avatar>
            )}
          </IconButton>
          <MenuPopover
            open={openUser}
            onClose={handleCloseUser}
            anchorEl={anchorRef.current}
            sx={{
              width: 300
            }}
          >
            <UserList
              openUser={openUser}
              isAuthenticated={isAuthenticated}
              user={user}
              setOpen={() => setOpen(false)}
            />
          </MenuPopover>
        </>
      )}
    </Box>
  );
}
