import { forwardRef } from 'react';
import PropTypes from 'prop-types';
// mui
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
// next
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';

export const LogoMain = () => {
  const theme = useTheme();

  const { push } = useRouter();
  return (
    <Box
      sx={{
        cursor: 'pointer',
        tspan: {
          whiteSpace: 'pre'
        },
        position: 'relative',
          height: 64,
          width: { xs: 116, md: 146 },
      }}
      onClick={() => push('/')}
    >
      <Image
        src={theme.palette.mode === 'light' ? '/logo-light.png' : '/logo-dark.png'}
        alt="logo"
        placeholder="blur"
        objectFit="contain"
        layout="fill"
        blurDataURL="/logo-light.png"
      />
    </Box>
  );
};
const Logo = forwardRef(({ sx, isMobile, noText }, ref) => {
  const theme = useTheme();
  const { push } = useRouter();
  const PRIMARY_MAIN = theme.palette.primary.main;
  const TEXT_PRIMARY = theme.palette.text.primary;

  return (
    <Button variant="text" sx={{ ml: '-8px' }} onClick={() => push('/')}>
      <Box
        component="svg"
        ref={ref}
        sx={{
          cursor: 'pointer',
          tspan: {
            whiteSpace: 'pre'
          },
          width: 56,
          height: 'auto',
          ...sx
        }}
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        width="279.000000pt"
        height="279.000000pt"
        viewBox="0 0 270.000000 279.000000"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform="translate(0.000000,279.000000) scale(0.100000,-0.100000)" fill={TEXT_PRIMARY} stroke="none">
          <path
            d="M1306 2650 c-471 -60 -874 -387 -1034 -842 -123 -346 -84 -739 103
-1058 125 -212 302 -378 525 -490 279 -140 576 -172 878 -96 235 60 437 178
603 353 103 108 230 299 212 317 -4 3 -19 6 -34 6 -15 0 -56 9 -91 20 -60 19
-64 19 -76 3 -7 -10 -39 -54 -71 -98 -383 -527 -1147 -583 -1607 -118 -272
275 -372 684 -259 1060 98 323 361 593 680 696 197 64 404 70 609 17 92 -23
238 -90 327 -150 87 -58 213 -188 278 -285 30 -44 59 -79 65 -78 21 5 181 48
185 50 2 1 -9 24 -24 50 -191 331 -496 552 -862 628 -92 19 -311 27 -407 15z"
          />
          <path
            fill={PRIMARY_MAIN}
            d="M1317 2225 c-664 -126 -923 -927 -458 -1419 211 -222 536 -311 836
-229 208 57 400 204 505 388 l23 41 -46 62 c-72 98 -92 170 -92 332 0 156 14
204 92 317 l44 65 -33 56 c-46 77 -168 204 -249 258 -77 51 -186 98 -274 120
-92 22 -257 26 -348 9z m328 -292 c83 -21 182 -75 238 -130 26 -25 47 -49 47
-52 0 -7 -119 -116 -167 -154 -23 -19 -24 -19 -63 17 -72 65 -114 81 -215 81
-74 0 -98 -4 -138 -24 -104 -51 -161 -146 -161 -271 -1 -89 21 -160 65 -213
106 -129 319 -135 453 -12 l38 35 94 -87 c52 -47 94 -89 94 -94 0 -17 -116
-111 -173 -139 -118 -57 -295 -76 -440 -45 -248 52 -424 252 -444 503 -27 356
261 630 637 605 41 -2 102 -11 135 -20z"
          />

          <path
            d="M2575 1682 c-77 -33 -77 -33 -66 -83 19 -80 24 -239 11 -334 -7 -49
-13 -99 -14 -109 -1 -26 75 -64 139 -68 l49 -3 14 55 c19 75 22 390 4 488
l-14 72 -41 -1 c-23 0 -60 -8 -82 -17z"
          />
        </g>
      </Box>
      {!noText && (
        <Box
          sx={{
            ml: 0.8,
            '& h5, p': {
              textTransform: 'uppercase'
            },

            ...(isMobile && {
              display: { sm: 'block', xs: 'none' }
            })
          }}
        >
          <Typography variant="h5" color="text.primary" lineHeight={1}>
            Ezone
          </Typography>
          <Typography color="text.primary" fontSize={8.7} ml={0.1}>
            Reactjs ecommerce script you need
          </Typography>
        </Box>
      )}
    </Button>
  );
});

Logo.displayName = 'Logo';

Logo.propTypes = {
  sx: PropTypes.object,
  isMobile: PropTypes.bool,
  noText: PropTypes.bool
};
export default LogoMain;
