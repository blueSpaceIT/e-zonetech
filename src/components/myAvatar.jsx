// mui
import { MAvatar } from './@material-extend';
import { Typography } from '@mui/material';

import PropTypes from 'prop-types';

MyAvatar.propTypes = {
  data: PropTypes.shape({
    cover: PropTypes.string,
    fullName: PropTypes.string
  })
};

export default function MyAvatar({ ...props }) {
  const { data, ...other } = props;
  return (
    <MAvatar src={data?.cover} alt={data?.fullName + ' cover'} color={'default'} {...other}>
      <Typography variant="h1">{data?.fullName?.slice(0, 1).toUpperCase()}</Typography>
    </MAvatar>
  );
}
