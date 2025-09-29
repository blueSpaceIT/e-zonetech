import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  Typography
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { toggleSidebar } from 'src/lib/redux/slices/settings';
import navConfig from 'src/components/layout/_main/config.json';
import { useQuery } from 'react-query';
import * as api from 'src/services';
import NextLink from 'next/link';

export default function MobileMenuDrawer() {
  const dispatch = useDispatch();
  const { openSidebar } = useSelector((state) => state.settings);

  const handleClose = () => dispatch(toggleSidebar(false));

  // fetch categories and public header menus
  // use public endpoint (same as desktop) to get hierarchical categories
  const { data: categoriesData } = useQuery(['get-all-categories-for-mobile'], () => api.getAllCategories(), { enabled: true });
  const categories = categoriesData?.data || [];

  const { data: headerData } = useQuery(['public-header-menus'], () => api.getPublicHeaderMenus(), { enabled: true });
  const headerMenus = headerData?.data || [];

  // local open state per menu
  const [openKeys, setOpenKeys] = useState({});

  const toggleKey = (key) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderCategories = () => (
    <>
      <ListItemButton onClick={() => toggleKey('categories')}>
        <ListItemText primary={navConfig.menu.find((m) => m.isDropdown && (m.title || '').toLowerCase().includes('category'))?.title || 'Browse Categories'} />
        {openKeys['categories'] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={!!openKeys['categories']} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {categories.map((cat) => {
            const key = `cat-${cat._id || cat.slug || cat.name}`;
            const hasSubs = Array.isArray(cat.subCategories) && cat.subCategories.length > 0;
            return (
              <React.Fragment key={key}>
                {hasSubs ? (
                  <>
                    <ListItemButton sx={{ pl: 4 }} onClick={() => toggleKey(key)}>
                      <ListItemText primary={cat.name} />
                      {openKeys[key] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={!!openKeys[key]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {cat.subCategories.map((sub) => (
                          <ListItemButton
                            key={sub._id || sub.slug || sub.name}
                            sx={{ pl: 8 }}
                            component={NextLink}
                            href={`/products/${cat.slug}/${sub.slug}`}
                            onClick={handleClose}
                          >
                            <ListItemText primary={sub.name} />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItemButton sx={{ pl: 4 }} component={NextLink} href={`/products/${cat.slug}`} onClick={handleClose}>
                    <ListItemText primary={cat.name} />
                  </ListItemButton>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Collapse>
    </>
  );

  // Recursive renderer for menus with arbitrary-depth `subMenus`
  const renderMenuList = (items, parentKey = 'menu', level = 0) => (
    items.map((item) => {
      const key = `${parentKey}-${item._id || item.url || item.name}`;
      const hasSubs = Array.isArray(item.subMenus) && item.subMenus.length > 0;
      const isOpen = !!openKeys[key];
      // indent nested levels (first nested level uses pl:4)
      const sx = level > 0 ? { pl: 4 * level } : undefined;

      // compute a safe href for NextLink (avoid passing undefined)
      const safeHref = item.url || item.path || (hasSubs ? undefined : '/');
      const Component = hasSubs ? 'button' : NextLink;

      return (
        <React.Fragment key={key}>
          <ListItemButton
            onClick={() => (hasSubs ? toggleKey(key) : handleClose())}
            component={Component}
            href={hasSubs ? undefined : safeHref}
            sx={sx}
          >
            <ListItemText primary={item.name || item.title} />
            {hasSubs ? (isOpen ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItemButton>

          {hasSubs ? (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuList(item.subMenus, key, level + 1)}
              </List>
            </Collapse>
          ) : null}
        </React.Fragment>
      );
    })
  );

  // Fallback: when headerMenus empty, use navConfig (static config.json)
  const staticHeader = navConfig.menu.filter((m) => !(m.isDropdown && (m.title || '').toLowerCase().includes('category')));

  return (
    <Drawer
      anchor="right"
      open={openSidebar}
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
  sx={{ '& .MuiDrawer-paper': { width: 320, borderRadius: 0 } }}
    >
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" sx={{ px: 2, py: 1 }}>
          Menu
        </Typography>
        <Divider />
        <List>
          {renderCategories()}

          <Divider sx={{ my: 1 }} />

          {headerMenus.length > 0 && renderMenuList(headerMenus, 'header')}
        </List>
      </Box>
    </Drawer>
  );
}

