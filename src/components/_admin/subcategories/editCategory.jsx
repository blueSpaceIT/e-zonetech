import React from 'react';
import SubCategoryForm from 'src/components/forms/subCategory';
import PropTypes from 'prop-types';

EditCategory.propTypes = {
  data: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default function EditCategory({ data, categories, isLoading }) {
  return (
    <div>
      <SubCategoryForm data={data} categories={categories} isLoading={isLoading} />
    </div>
  );
}
