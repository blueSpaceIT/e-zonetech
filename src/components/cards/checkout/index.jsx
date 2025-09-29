import React from 'react';
import PropTypes from 'prop-types';
// next
import dynamic from 'next/dynamic';
// mui
import { Typography, Card, Stack, Box, IconButton } from '@mui/material';
// icons
import { MdDeleteOutline } from 'react-icons/md';
import { styled } from '@mui/material/styles';
// components
import { fCurrency } from 'src/utils/formatNumber';
import BlurImage from 'src/components/blurImage';
const RootStyled = dynamic(() => import('./styled'));
const Incrementer = dynamic(() => import('src/components/incrementer'));

const ThumbImgStyle = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  minWidth: 40,
  objectFit: 'cover',
  marginRight: theme.spacing(2),
  // borderRadius: theme.shape.borderRadiusSm,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  overflow: 'hidden'
}));

// const formatNumbers = (number, unitRate) => {
//   const converted = (number * unitRate).toLocaleString(undefined, {
//     maximumFractionDigits: 1
//   });
//   return converted;
// };

export default function CheckoutCard({ ...props }) {
  const { onDelete, onIncreaseQuantity, onDecreaseQuantity, cart } = props;

  return (
    <RootStyled>
      {cart.map((product) => {
        const { sku, name, brand, priceSale, color, size, image, quantity, available } = product;

        return (
          <Card className="card-main" key={Math.random()}>
            <Stack direction="row" alignItems="center">
              <ThumbImgStyle>
                <BlurImage priority fill alt="product image" src={image} />
              </ThumbImgStyle>
              <Box sx={{ display: 'contents' }}>
                <Typography variant="h5" color="text.primary" noWrap textOverflow="ellipsis">
                  {name}
                </Typography>
                <Typography variant="body2" color="text.primary" mb={0.5}>
                  {brand?.name}
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Box mt={1}>
                {/* <Typography variant="body2" color="text.primary" mb={0.5}>
                  {name}
                </Typography> */}
                <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>Color:</b> {color}
                  {/* { formatNumbers(Number(priceSale), Number(unitRate))} */}
                </Typography>
                <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>Size:</b>
                  {size}
                </Typography>
                <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>subtotal:</b> {fCurrency(priceSale * quantity)}
                  {/* { formatNumbers(Number(priceSale), Number(unitRate))} */}
                </Typography>
                {/* <Typography variant="body2" color="text.primary" mb={0.5}>
                  <b>Total:</b> $ {priceSale * quantity}
                 
                </Typography> */}
              </Box>
              <Box textAlign="right">
                <Incrementer
                  quantity={quantity}
                  available={available}
                  onDecrease={() => onDecreaseQuantity(sku)}
                  onIncrease={() => onIncreaseQuantity(sku)}
                />
                <IconButton color="primary" onClick={() => onDelete(sku)} sx={{ mt: 1 }}>
                  <MdDeleteOutline className="delete-icon" />
                </IconButton>
              </Box>
            </Stack>
          </Card>
        );
      })}
    </RootStyled>
  );
}
CheckoutCard.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onIncreaseQuantity: PropTypes.func.isRequired,
  onDecreaseQuantity: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(PropTypes.object).isRequired
};
