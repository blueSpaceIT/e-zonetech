import React from 'react';
import ProductForm from 'src/components/forms/product';

export default function addProduct({ brands, categories, subCategories }) {
  return (
    <div>
      <ProductForm brands={brands} categories={categories} subCategories={subCategories} />
    </div>
  );
}
