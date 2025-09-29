import React from 'react';
import CouponCodeForm from 'src/components/forms/couponCode';

import PropTypes from 'prop-types';

EditCategory.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCategory({ data, isLoading }) {
  return (
    <div>
      <CouponCodeForm data={data} isLoading={isLoading} />
    </div>
  );
}
