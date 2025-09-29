import React from 'react';
// guard
import AuthGuard from 'src/guards/auth';
import PropTypes from 'prop-types';
export default function ProfileLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}

ProfileLayout.propTypes = {
  children: PropTypes.node.isRequired
};
