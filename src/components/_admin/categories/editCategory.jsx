import React from 'react';
import CategoryForm from 'src/components/forms/category';
import PropTypes from 'prop-types';

EditCategory.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCategory({ data, isLoading }) {
  return (
    <div>
      <CategoryForm data={data} isLoading={isLoading} />
    </div>
  );
}
