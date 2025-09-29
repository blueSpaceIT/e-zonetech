'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
// redux
import { Provider } from 'react-redux';
import { reduxStore, persistor } from 'src/lib/redux';
// react
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
// components
import ThemeRegistry from 'src/theme';
import GlobalStyles from 'src/theme/globalStyles';
import { LinearProgress, Stack } from '@mui/material';
import AuthProvider from './auth';
import dynamic from 'next/dynamic';

const ProgressBar = dynamic(() => import('src/components/ProgressBar'), {
  ssr: false
});

export default function Providers(props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false // default: true
          }
        }
      })
  );

  return (
    <Provider store={reduxStore}>
      <AuthProvider isAuth={props.isAuth}>
        <ThemeRegistry>
          <GlobalStyles />
          <QueryClientProvider client={queryClient}>
            <Toaster position={'top-center'} />
            <PersistGate
              loading={
                <Stack
                  sx={{
                    position: 'fixed',
                    top: 'calc(50vh - 2px)',
                    width: '300px',
                    left: 'calc(50vw - 150px)',
                    zIndex: 11
                  }}
                >
                  <LinearProgress />
                </Stack>
              }
              persistor={persistor}
            >
              {props.children}
            </PersistGate>
          </QueryClientProvider>
          <ProgressBar />
        </ThemeRegistry>
      </AuthProvider>
    </Provider>
  );
}

Providers.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};
