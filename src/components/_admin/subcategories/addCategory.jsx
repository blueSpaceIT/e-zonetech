import React from 'react';
import SubCategoryForm from 'src/components/forms/subCategory';
import PropTypes from 'prop-types';

AddCategory.propTypes = {
  categories: PropTypes.array.isRequired
};

export default function AddCategory({ categories }) {
  return (
    <div>
      <SubCategoryForm categories={categories} />
    </div>
  );
}
