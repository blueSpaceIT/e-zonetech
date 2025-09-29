// mui
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton } from '@mui/material';
import { IoIosRemove } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io';

// Incrementer Style
const IncrementerStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${theme.palette.divider}`
}));

function Incrementer({ ...props }) {
  const { available, quantity, onIncrease, onDecrease } = props;

  return (
    <Box sx={{ width: 96, textAlign: 'right', mb: 0 }}>
      <IncrementerStyle>
        <IconButton size="small" color="inherit" onClick={onDecrease} disabled={quantity <= 1}>
          <IoIosRemove size={16} />
        </IconButton>
        {quantity}
        <IconButton size="small" color="inherit" onClick={onIncrease} disabled={quantity >= available}>
          <IoIosAdd size={16} />
        </IconButton>
      </IncrementerStyle>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Available: {available}
      </Typography>
    </Box>
  );
}

export default Incrementer;
Incrementer.propTypes = {
  available: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  onIncrease: PropTypes.func.isRequired,
  onDecrease: PropTypes.func.isRequired
};
