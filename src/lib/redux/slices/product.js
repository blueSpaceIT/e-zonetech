import { sum, map, filter, uniqBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const shippingFee = parseInt(process.env.SHIPPING_FEE);
const initialState = {
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: shippingFee,
    billing: null
  }
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;
      console.log('📦 GetCart - Cart data received:', cart);
      console.log('📦 GetCart - Sample product shipping info:', cart.length > 0 ? cart[0] : 'No products');

      const subtotal = sum(cart.map((product) => product.priceSale * product.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      // Calculate shipping cost from products in cart
      const shipping =
        cart.length === 0
          ? 0
          : sum(
              cart.map((product) => {
                console.log(`📦 Product ${product.name || product.sku} shipping:`, product.shipping);
                return (product.shipping || 0) * product.quantity;
              })
            );
      console.log('🚚 Total calculated shipping:', shipping);
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      // no extra tax applied here (invoices only)
      const tax = 0;
      state.checkout.total = subtotal + (parseInt(shipping) || 0) + tax - state.checkout.discount;
    },

    addCart(state, action) {
      const product = action.payload;
      console.log('🛒 AddCart - Product data received:', product);
      console.log('🛒 AddCart - Shipping from payload:', product.shipping);
      const updatedProduct = {
        ...product,
        sku: `${product.sku}-${product.size}-${product.color}`
      };
      console.log('🛒 AddCart - Updated product with SKU:', updatedProduct);
      console.log('🛒 AddCart - Shipping in updated product:', updatedProduct.shipping);
      const isEmptyCart = state.checkout.cart.length === 0;
      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, updatedProduct];
      } else {
        state.checkout.cart = map(state.checkout.cart, (_product) => {
          const isExisted = _product.sku === updatedProduct.sku;
          if (isExisted) {
            return {
              ..._product,
              quantity: _product.quantity + product.quantity
            };
          }
          return _product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, updatedProduct], 'sku');

      console.log('🛒 AddCart - Final cart state:', state.checkout.cart);
      console.log(
        '🛒 AddCart - Cart items with shipping:',
        state.checkout.cart.map((item) => ({
          sku: item.sku,
          shipping: item.shipping,
          quantity: item.quantity
        }))
      );

      // Recalculate totals
      const subtotal = sum(state.checkout.cart.map((prod) => prod.priceSale * prod.quantity));
      const shipping = sum(state.checkout.cart.map((prod) => (prod.shipping || 0) * prod.quantity));
      console.log('🛒 AddCart - Calculated shipping total:', shipping);
      state.checkout.subtotal = subtotal;
      state.checkout.shipping = shipping;
      const tax = 0;
      state.checkout.total = subtotal + shipping + tax - state.checkout.discount;
    },

    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload);

      state.checkout.cart = updateCart;

      // Recalculate totals
      const subtotal = sum(updateCart.map((prod) => prod.priceSale * prod.quantity));
      const shipping = sum(updateCart.map((prod) => (prod.shipping || 0) * prod.quantity));
      state.checkout.subtotal = subtotal;
      state.checkout.shipping = shipping;
      const tax = 0;
      state.checkout.total = subtotal + shipping + tax - state.checkout.discount;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.billing = null;
    },

    increaseQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity + 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;

      // Recalculate totals
      const subtotal = sum(updateCart.map((prod) => prod.priceSale * prod.quantity));
      const shipping = sum(updateCart.map((prod) => (prod.shipping || 0) * prod.quantity));
      state.checkout.subtotal = subtotal;
      state.checkout.shipping = shipping;
      const tax = 0;
      state.checkout.total = subtotal + shipping + tax - state.checkout.discount;
    },

    decreaseQuantity(state, action) {
      const productSku = action.payload;
      const updateCart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku) {
          return {
            ...product,
            quantity: product.quantity - 1
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;

      // Recalculate totals
      const subtotal = sum(updateCart.map((prod) => prod.priceSale * prod.quantity));
      const shipping = sum(updateCart.map((prod) => (prod.shipping || 0) * prod.quantity));
      state.checkout.subtotal = subtotal;
      state.checkout.shipping = shipping;
      const tax = 0;
      state.checkout.total = subtotal + shipping + tax - state.checkout.discount;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      const tax = 0;
      state.checkout.total = state.checkout.subtotal + state.checkout.shipping + tax - discount;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  onGotoStep,
  onBackStep,
  onNextStep,
  deleteCart,
  createBilling,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity
} = slice.actions;
