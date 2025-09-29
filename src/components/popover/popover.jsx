import { useTheme } from '@mui/material';
// styled
import RootStyled from './styled';
import PropTypes from 'prop-types';

MenuPopover.propTypes = {
  open: PropTypes.bool.isRequired,
  sx: PropTypes.object,
  isDesktop: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

// ----------------------------------------------------------------------
export default function MenuPopover({ ...props }) {
  const theme = useTheme();
  const { children, open, sx, isDesktop, PaperProps: incomingPaperProps, ...other } = props;

  const mergedClassName = [incomingPaperProps?.className, isDesktop && 'is-desktop']
    .filter(Boolean)
    .join(' ');

  const mergedPaperProps = {
    ...incomingPaperProps,
    className: mergedClassName || undefined,
    sx: {
      ...(incomingPaperProps?.sx || {}),
      ...sx,
      border: `1px solid ${theme.palette.divider}`
    }
  };

  return (
    <RootStyled
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: isDesktop ? 'center' : 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: isDesktop ? 'center' : 'right'
      }}
      open={open}
      {...other}
      PaperProps={mergedPaperProps}
    >
      {children}
    </RootStyled>
  );
}
