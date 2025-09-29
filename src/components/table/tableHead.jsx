import PropTypes from 'prop-types';
// mui
import { TableRow, TableCell, TableHead, useTheme, Checkbox } from '@mui/material';
import { createGradient } from 'src/theme/palette';

TableHeadMain.propTypes = {
  headData: PropTypes.array,
  selectedOrders: PropTypes.array,
  selectAll: PropTypes.bool,
  onSelectAll: PropTypes.func,
  totalRows: PropTypes.number
};

export default function TableHeadMain({ ...props }) {
  const { headData, selectedOrders = [], selectAll = false, onSelectAll, totalRows = 0 } = props;
  const theme = useTheme();
  
  const handleSelectAllChange = (event) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked);
    }
  };

  return (
    <TableHead>
      <TableRow
        sx={{
          background: createGradient(theme.palette.primary.main, theme.palette.primary.dark)
        }}
      >
        {headData.map((headCell) => (
          <TableCell
            key={headCell.id || Math.random()}
            align={headCell.alignRight ? 'right' : 'left'}
            sx={{
              color: 'common.white',
              bgcolor: 'transparent',
              fontSize: 16,
              py: 2,
              textTransform: 'capitalize',
              width: headCell.width || 'auto'
            }}
          >
            {headCell.id === 'select' && onSelectAll ? (
              <Checkbox
                indeterminate={selectedOrders.length > 0 && selectedOrders.length < totalRows}
                checked={selectAll}
                onChange={handleSelectAllChange}
                sx={{
                  color: 'common.white',
                  '&.Mui-checked': {
                    color: 'common.white',
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: 'common.white',
                  },
                }}
              />
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
