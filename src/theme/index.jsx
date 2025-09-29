'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { useSelector } from 'src/lib/redux';
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import shape from './shape';
import shadows, { customShadows } from './shadows';
import componentsOverride from './overrides';

ThemeRegistry.propTypes = {
  children: PropTypes.node.isRequired
};

export default function ThemeRegistry({ children }) {
  const { themeMode } = useSelector((state) => state.settings);

  const customTheme = React.useMemo(
    () =>
      createTheme({
        palette: themeMode === 'dark' ? { ...palette.dark, mode: 'dark' } : { ...palette.light, mode: 'light' },
        direction: 'ltr',
        typography: typography,
        shadows: themeMode === 'dark' ? shadows.dark : shadows.light,
        shape,
        breakpoints,
        customShadows: themeMode === 'dark' ? customShadows.light : customShadows.dark
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [themeMode]
  );
  customTheme.components = componentsOverride(customTheme);
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <main>{children}</main>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
