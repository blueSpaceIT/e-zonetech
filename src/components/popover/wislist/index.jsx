// react
import React from 'react';

// next
import { useRouter } from 'next-nprogress-bar';

// mui
import { Badge, IconButton } from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';

WishlistPopover.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

// ----------------------------------------------------------------------
export default function WishlistPopover({ isAuth }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const { wishlist } = useSelector(({ wishlist }) => wishlist);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <IconButton
        name="wishlist"
        color={'default'}
        onClick={() => {
          if (!isAuth) {
            router.push('/auth/login');
          } else {
            router.push('/profile/wishlist');
          }
        }}
      >
        <Badge showZero={true} badgeContent={loading || !isAuth ? 0 : wishlist?.length} color="warning">
          <IoMdHeartEmpty />
        </Badge>
      </IconButton>
    </>
  );
}
