import React from 'react';
import EditUserForm from 'src/components/_admin/users/editUserForm';

export default function EditUser({ id }) {
  return (
    <div>
      <EditUserForm id={id} />
    </div>
  );
}
