import React from 'react';
import PropTypes from 'prop-types';
// materil ui + styling components
import { styled, useTheme, alpha, useMediaQuery, Fab, Box } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// icons
// icons
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FaRegBuilding } from 'react-icons/fa';
import { TbCategory2 } from 'react-icons/tb';
import { BsShop } from 'react-icons/bs';
import { BsCart3 } from 'react-icons/bs';
import { LuUsers } from 'react-icons/lu';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { IoSettingsOutline } from 'react-icons/io5';
import { RiCoupon5Line } from 'react-icons/ri';
// next
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
// redux
import { useSelector } from 'react-redux';
import Scrollbar from 'src/components/Scrollbar';
import { Analytics, AnalyticsOutlined, Dashboard } from '@mui/icons-material';
// Dashboard Side NevLinks
export const navlinks = [
  {
    id: 1,
    title: 'Dashboard',
    slug: '',
    icon: <LuLayoutDashboard />
  },
  {
    id: 2,
    title: 'Banners',
    slug: '/banners',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 2,
    title: 'Categories',
    slug: '/categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 3,
    title: 'Sub Categories',
    slug: '/sub-categories',
    icon: <TbCategory2 />,
    isSearch: true
  },
  {
    id: 3,
    title: 'Brands',
    slug: '/brands',
    icon: <FaRegBuilding />,
    isSearch: true
  },
  {
    id: 4,
    title: 'Products',
    slug: '/products',
    icon: <BsShop />,
    isSearch: true
  },

  {
    id: 5,
    title: 'Orders',
    slug: '/orders',
    icon: <BsCart3 />,
    isSearch: true
  },
  {
    id: 6,
    title: 'Customers',
    slug: '/users',
    icon: <LuUsers />,
    isSearch: true
  },
  {
    id: 7,
    title: 'Coupon codes',
    slug: '/coupon-codes',
    icon: <RiCoupon5Line />,
    isSearch: true
  },

  {
    id: 10,
    title: 'Admin',
    slug: '/admin',
    icon: <IoSettingsOutline />,
    isSearch: false
  },

  {
    id: 11,
    title: 'Accounts',
    slug: '/accounts',
    icon: <AnalyticsOutlined />,
    isSearch: false
  },

  {
    id: 8,
    title: 'Newsletter',
    slug: '/newsletter',
    icon: <SlEnvolopeLetter />,
    isSearch: false
  },
  {
    id: 9,
    title: 'Settings',
    slug: '/settings',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 12,
    title: 'Menus',
    slug: '/menus',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 13,
    title: 'Delivery Cities',
    slug: '/delivery-cities',
    icon: <IoSettingsOutline />,
    isSearch: false
  },
  {
    id: 14,
    title: 'Payment Features',
    slug: '/payment-features',
    icon: <IoSettingsOutline />,
    isSearch: false
  }
];

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  borderRadius: 0,
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `0px`,
  borderRadius: 0,
  [theme.breakpoints.up('md')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 11,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

export default function Sidebar({ handleDrawerClose, handleDrawerOpen, open }) {
  const { user } = useSelector(({ user }) => user);
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState('/dashboard');
  const [initial, setInitial] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  React.useEffect(() => {
    setActive(pathname);
    setInitial(true);
  }, [pathname]);
  // Role based nav filtering
  const role = user?.role;
  // Map titles to a stable key in navlinks; if 'Accounts' doesn't exist, map to 'Accounts' slug '/accounts'
  // Define exclusions per role
  const exclusions = {
    'super admin': [],
    admin: ['Admin'],
    manager: ['Users', 'Admin', 'Settings'],
    accountant: [] // handled separately
  };

  // For accountant, only allow Dashboard and Accounts (we'll treat 'Accounts' as slug '/accounts')
  const accountantAllowed = ['Dashboard', 'Accounts'];

  // Build filtered links
  const filteredNavlinks = React.useMemo(() => {
    if (!role) return navlinks;
    const r = role.toLowerCase();
    if (r === 'super admin') return navlinks;
    if (r === 'accountant') {
      // ensure Accounts entry exists; if not, create one
      const accountsEntry = navlinks.find((n) => n.title.toLowerCase() === 'accounts');
      let base = navlinks.filter((n) => accountantAllowed.includes(n.title));
      if (!accountsEntry) {
        base = [
          navlinks.find((n) => n.title === 'Dashboard'),
          { id: 999, title: 'Accounts', slug: '/accounts', icon: <FaRegBuilding />, isSearch: false }
        ];
      }
      return base.filter(Boolean);
    }
    // default: apply exclusions if found
    const exclude = exclusions[r] || [];
    return navlinks.filter((n) => !exclude.includes(n.title));
  }, [role]);
  console.log('/dashboard/' + pathname.split('/')[2], "'/dashboard/' + pathname.split('/')[1]");
  return (
    <div>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '&.MuiDrawer-root': {
            '.MuiPaper-root': {
              overflow: { xs: 'hidden', md: 'unset' },
              zIndex: 998 + '!important'
            }
          }
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            position: 'absolute',
            right: -15,
            top: 85,
            zIndex: 9999999,
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Fab
            size="small"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: '1px solid' + theme.palette.divider,
              boxShadow: 'none',
              height: 25,
              minHeight: 25,
              width: 25,
              ':hover': {
                bgcolor: theme.palette.background.paper
              },
              svg: {
                color: theme.palette.text.primary
              }
            }}
          >
            {open ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </Fab>
        </Box>
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <List
            sx={{
              px: 1.5,
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
              py: 2
            }}
          >
            {filteredNavlinks.map((item) => (
              <ListItem
                key={item.id}
                disablePadding
                sx={{
                  display: 'block',
                  borderRadius: '8px',
                  border: `1px solid transparent`,
                  ...((pathname.split('/')?.length > 3 ? '/dashboard/' + pathname.split('/')[2] : active) ===
                    '/dashboard' + item.slug &&
                    initial && {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                      border: (theme) => `1px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                      '& .MuiTypography-root': {
                        fontWeight: 600
                      }
                    })
                }}
              >
                <Tooltip title={open ? '' : item.title} placement="left" arrow leaveDelay={200}>
                  <ListItemButton
                    onClick={() => {
                      setActive('/dashboard' + item.slug);
                      router.push('/dashboard' + item.slug);
                      isMobile && handleDrawerClose();
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: '8px'
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.title}
                      sx={{
                        overflow: 'hidden',
                        height: open ? 'auto' : 0,
                        textTransform: 'capitalize'
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </div>
  );
}
Sidebar.propTypes = {
  handleDrawerClose: PropTypes.func.isRequired,
  handleDrawerOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};
