// import { useState } from 'react';
// import { CardElement } from '@stripe/react-stripe-js';
// import CheckoutError from './Error';
// // mui
// import { Card } from '@mui/material';
// import { useTheme } from '@mui/material/styles';

// import PropTypes from 'prop-types';

// const CheckoutForm = ({ error }) => {
//   const theme = useTheme();
//   const [checkoutError, setCheckoutError] = useState(null);

//   const handleCardDetailsChange = (ev) => {
//     ev.error ? setCheckoutError(ev.error.message) : setCheckoutError(null);
//   };

//   const iframeStyles = {
//     base: {
//       color: theme.palette.text.primary,
//       fontSize: '16px',
//       //   backgroundColor: "red",
//       iconColor: theme.palette.text.primary,
//       '::placeholder': {
//         color: theme.palette.text.secondary
//       }
//     },
//     invalid: {
//       iconColor: theme.palette.error.main,
//       color: theme.palette.error.main
//     },
//     complete: {
//       iconColor: theme.palette.success.main,
//       color: theme.palette.text.primary
//     }
//   };

//   const cardElementOpts = {
//     iconStyle: 'solid',
//     style: iframeStyles,
//     hidePostalCode: true
//   };

//   return (
//     <>
//       <Card
//         sx={{
//           height: 40,
//           display: 'flex',
//           alignItems: 'center',
//           '& .StripeElement': {
//             width: '100%',
//             padding: '15px'
//           }
//         }}
//       >
//         <CardElement options={cardElementOpts} onChange={handleCardDetailsChange} />
//       </Card>
//       {error && <CheckoutError>{error}</CheckoutError>}
//     </>
//   );
// };

// CheckoutForm.propTypes = {
//   error: PropTypes.string
// };

// export default CheckoutForm;
import { CardElement } from '@stripe/react-stripe-js';
import CheckoutError from './Error';
import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

const CheckoutForm = ({ error }) => {
  const theme = useTheme();

  const handleCardDetailsChange = (ev) => {
    ev.error ? 'Error' : null;
  };

  const iframeStyles = {
    base: {
      color: theme.palette.text.primary,
      fontSize: '16px',
      iconColor: theme.palette.text.primary,
      '::placeholder': {
        color: theme.palette.text.secondary
      }
    },
    invalid: {
      iconColor: theme.palette.error.main,
      color: theme.palette.error.main
    },
    complete: {
      iconColor: theme.palette.success.main,
      color: theme.palette.text.primary
    }
  };

  const cardElementOpts = {
    iconStyle: 'solid',
    style: iframeStyles,
    hidePostalCode: true
  };

  return (
    <>
      <Card
        sx={{
          height: 40,
          display: 'flex',
          alignItems: 'center',
          '& .StripeElement': {
            width: '100%',
            padding: '15px'
          }
        }}
      >
        <CardElement options={cardElementOpts} onChange={handleCardDetailsChange} />
      </Card>
      {error && <CheckoutError>{error}</CheckoutError>}
    </>
  );
};

CheckoutForm.propTypes = {
  error: PropTypes.string
};

export default CheckoutForm;
