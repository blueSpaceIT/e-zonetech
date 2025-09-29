// mui
import { Badge, IconButton } from '@mui/material';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

// react
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// next
import { useRouter } from 'next-nprogress-bar';

// lodash
import { sum } from 'lodash';

export default function CartWidget({ ...props }) {
  const { checkout } = props;
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const totalItems = sum(cart.map((item) => item.quantity));

  useEffect(() => {
    setCart(checkout.cart);
  }, [checkout]);

  return (
    <IconButton onClick={() => router.push('/cart')} color="default" name="cart">
      <Badge badgeContent={totalItems} color="primary" showZero>
        <HiOutlineShoppingBag />
      </Badge>
    </IconButton>
  );
}
CartWidget.propTypes = {
  checkout: PropTypes.object.isRequired
};
