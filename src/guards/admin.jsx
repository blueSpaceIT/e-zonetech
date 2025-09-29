'use client';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// redux
import { useSelector } from 'src/lib/redux';
import { toast } from 'react-hot-toast';
import Loading from 'src/components/loading';
// next
import { useRouter } from 'next-nprogress-bar';

export default function Guest({ children }) {
  const router = useRouter();
  const [isAdmin, setAdmin] = useState(true);
  const { isAuthenticated, user } = useSelector(({ user }) => user);

  useEffect(() => {
    // allowed admin roles for dashboard access
    const allowedRoles = ['admin', 'manager', 'accountant', 'super admin'];

    // if not authenticated, deny access
    if (!isAuthenticated) {
      setAdmin(false);
      toast.error("You're not allowed to access dashboard");
      router.push('/');
      return;
    }

    // if user object not yet available, wait (avoid premature redirect)
    if (!user) return;

    // check role against allowed list
    if (!allowedRoles.includes(user.role)) {
      setAdmin(false);
      toast.error("You're not allowed to access dashboard");
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAdmin) {
    return <Loading />;
  }

  return children;
}

Guest.propTypes = {
  children: PropTypes.node.isRequired
};
