import React from 'react';
import BrandsForm from 'src/components/forms/brands';

export default function addBrand({ data, isLoading }) {
  return (
    <div>
      <BrandsForm data={data} isLoading={isLoading} />
    </div>
  );
}
