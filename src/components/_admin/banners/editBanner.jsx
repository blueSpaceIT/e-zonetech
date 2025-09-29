import React from 'react';
import BannerForm from 'src/components/forms/banner';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import toast from 'react-hot-toast';

EditBanner.propTypes = {
  id: PropTypes.string.isRequired
};

export default function EditBanner({ id }) {
  const { data, isLoading } = useQuery(
    ['banner', id],
    () => api.getBannerByAdmin(id),
    {
      enabled: Boolean(id),
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  return (
    <div>
      <BannerForm data={data?.data} isLoading={isLoading} />
    </div>
  );
}
