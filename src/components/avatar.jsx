import { useState } from 'react';
import PropTypes from 'prop-types';
// mui
import { Box } from '@mui/material';
// next
import Image from 'next/image';

export default function BlurImageAvatar({ ...props }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Box
      sx={{
        position: 'relative',
        height: 40,
        width: 40,
        borderRadius: '50px',
        ...props
      }}
    >
      <Image
        {...props}
        src={props.src}
        alt={props.alt}
        style={{
          borderRadius: '50px',
          ...(isLoading
            ? {
                filter: 'blur(15px)'
              }
            : {
                filter: 'blur(0px)'
              })
        }}
        onLoad={() => setLoading(false)}
      />
    </Box>
  );
}
BlurImageAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};
