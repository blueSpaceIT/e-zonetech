import React from 'react';
import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import MenuIcon from '@mui/icons-material/Menu';
// next
import { useRouter } from 'next-nprogress-bar';
import { useQuery } from 'react-query';
import * as api from 'src/services';
// material
import typography from 'src/theme/typography';
import { Link, Stack, Box, Grid, ListSubheader, ListItem, Paper } from '@mui/material';
import NextLink from 'next/link';
// components
import RootStyled from 'src/components/lists/menuDesktopList/styled';
import MenuDesktopList from 'src/components/lists/menuDesktopList';
import CategoryDropdown from './CategoryDropdown';

// ----------------------------------------------------------------------

// Custom Dropdown Component
function CustomDropdown({ data, isOpen, onClose, isLoading, onMouseEnter, onMouseLeave }) {
  if (!isOpen) return null;

  function IconBullet({ type = 'item' }) {
    return (
      <Box className="icon-bullet-main">
        <Box component="span" className={`icon-bullet-inner ${type !== 'item' && 'active'}`} />
      </Box>
    );
  }

  return (
    <Paper
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: 'fixed',
        top: '156px',
        left: '50vw',
        transform: 'translateX(-50%)',
        mt: 0,
        zIndex: 1300,
        width: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'background.paper'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {data?.map((parent) => {
            // If parent looks like a category (has subCategories), render the MenuDesktopList
            if (parent?.subCategories) {
              return (
                <Grid item lg={1.4} key={parent.slug || parent.name}>
                  <MenuDesktopList parent={parent} isLoading={isLoading} onClose={onClose} />
                </Grid>
              );
            }

            // If parent has subMenus (header menus), render each first-level submenu as its own column
            if (parent?.subMenus) {
              return (
                <>
                  {(parent.subMenus || []).map((child, ci) => (
                    <Grid item lg={1.4} key={`${parent.name || 'parent'}-${child.name || ci}`}>
                      <RootStyled disablePadding>
                        <>
                          {/* Show the first-level submenu as the column header (link) */}
                          <ListSubheader
                            disableSticky
                            disableGutters
                            className="list-subheader"
                            component={NextLink}
                            href={child.url || '#'}
                            onClick={() => onClose()}
                          >
                            {child.name}
                          </ListSubheader>

                          {/* Render nested subMenus (second-level) as bullet list under the header */}
                          {(child.subMenus || []).map((s, i) => (
                            <ListItem
                              key={`${s._id || s.name || i}`}
                              className="list-item"
                              component={NextLink}
                              href={s.url || '#'}
                              onClick={() => onClose()}
                            >
                              <Box>{s.name}</Box>
                            </ListItem>
                          ))}
                        </>
                      </RootStyled>
                    </Grid>
                  ))}
                </>
              );
            }

            // fallback: render as simple list
            return (
              <Grid item lg={2} key={parent.name || Math.random()}>
                <div style={{ padding: 8 }}>{parent.name}</div>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
}

CustomDropdown.propTypes = {
  data: PropTypes.array,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
};

// ----------------------------------------------------------------------

MenuDesktopItem.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  item: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  isHome: PropTypes.bool,
  isOffset: PropTypes.bool.isRequired,
  scrollPosition: PropTypes.any,
  leftIcon: PropTypes.node,
  bgColor: PropTypes.string,
  data: PropTypes.array.isRequired,
  buttonRef: PropTypes.object
};

function MenuDesktopItem({ ...props }) {
  const { item, pathname, isHome, isOpen, isOffset, onOpen, scrollPosition, onClose, isLoading, data, leftIcon, bgColor, buttonRef } = props;
  const { title, path, isDropdown } = item;
  const isActive = pathname === path;

  const handleMouseEnter = () => {
    onOpen();
  };

  const handleMouseLeave = (e) => {
    // Only close if we're not moving to the dropdown
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget;
    
    // Check if the mouse is moving to a child element (like the dropdown)
    if (relatedTarget && currentTarget.contains(relatedTarget)) {
      return;
    }
    
    onClose();
  };

  if (isDropdown) {
    return (
      <Box
        sx={{ 
          display: 'inline-block'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          ref={buttonRef}
          className={` ${isOffset && isHome && 'offset'}`}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            ...typography.subtitle2,
            color: 'text.primary',
            textDecoration: 'none',
            fontWeight: 500,
            transition: '.2s ease-in',
            cursor: 'pointer',
            backgroundColor: bgColor || 'transparent',
            px: 1,
            py: 1,
            borderRadius: 1,
            '&:hover': {
              color: 'primary.main',
              textDecoration: 'none'
            },
            '&.offset': {
              color: 'text.primary'
            },
            '&.active': {
              color: 'primary.main'
            },
            '& .link-icon': {
              ml: 0.5,
              fontSize: 16
            }
          }}
        >
          <>
            {leftIcon && (
              <Box sx={{ display: 'inline-flex', mr: 1, alignItems: 'center' }}>{leftIcon}</Box>
            )}
            {title}

            {isOpen ? (
              <KeyboardArrowUpRoundedIcon className="link-icon" />
            ) : (
              <KeyboardArrowDownRoundedIcon className="link-icon" />
            )}
          </>
        </Link>
      </Box>
    );
  }

  return (
    <Link
      component={NextLink}
      key={title}
      href={path}
      name={title}
      className={` ${isActive && 'active'}`}
      sx={{
        ...typography.subtitle2,
        color: 'text.primary',
        textDecoration: 'none',
        fontWeight: 500,
        transition: '.2s ease-in',
        py: 1,
        cursor: 'pointer',
        '&:hover': {
          color: 'primary.main',
          textDecoration: 'none'
        },
        '&.offset': {
          color: 'text.primary'
        },
        '&.active': {
          color: 'primary.main'
        },
        '& .link-icon': {
          ml: 0.5,
          fontSize: 16
        }
      }}
    >
      {title}
    </Link>
  );
}

export default function MenuDesktop({ ...props }) {
  const { isOffset, isHome, navConfig, isLeft, categories } = props;

  const { pathname } = useRouter();

  // fetch public header menus; fallback to navConfig when empty
  const { data: headerData, isLoading: isMenusLoading } = useQuery(
    ['public-header-menus'],
    () => api.getPublicHeaderMenus(),
    { enabled: true }
  );
  const headerMenus = headerData?.data || [];

  const [openKey, setOpenKey] = useState(null);
  const router = useRouter();
  const closeTimeoutRef = useRef(null);
  const categoriesButtonRef = useRef(null);

  const [scrollPosition, setPosition] = useState(0);
  React.useLayoutEffect(() => {
    function updatePosition() {
      setPosition(window.pageYOffset);
    }
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  useEffect(() => {
    if (openKey) {
      setOpenKey(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpen = (key) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenKey(key);
  };

  const handleClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenKey(null);
    }, 150); // Increased timeout for better UX when switching
  };

  const handleImmediateClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenKey(null);
  };

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // determine categories dropdown once so we can skip it when rendering header menus
  const categoriesItemFromNav = navConfig.find((n) => n.isDropdown && (n.title || '').toLowerCase().includes('category'));
  const allCategoriesItem = categoriesItemFromNav || { title: 'Browse Categories', path: '/categories', isDropdown: true };

  const handleGlobalMouseLeave = (e) => {
    // Only close if mouse is leaving the entire menu area
    const relatedTarget = e.relatedTarget;
    const currentTarget = e.currentTarget;
    
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      handleImmediateClose();
    }
  };

  return (
    <Box
      sx={{
        position: 'relative'
      }}
      onMouseLeave={handleGlobalMouseLeave}
    >
      <Stack
        gap={2}
        direction="row"
        sx={{
          ...(isLeft && {
            ml: 0
          }),
          ml: -3,
          position: 'relative'
        }}
      >
      {/* Always show 'All categories' dropdown first */}
      {(() => {
        const categoriesKey = 'categories-dropdown';
        return (
          <MenuDesktopItem
            scrollPosition={scrollPosition}
            key={allCategoriesItem.title}
            data={categories}
            item={allCategoriesItem}
            isLoading={false}
            pathname={pathname}
            isOpen={openKey === categoriesKey}
            onOpen={() => handleOpen(categoriesKey)}
            onClose={handleClose}
            isOffset={isOffset}
            isHome={isHome}
            router={router}
            leftIcon={<MenuIcon fontSize="small" />}
            bgColor="#F1F3F7"
            buttonRef={categoriesButtonRef}
          />
        );
      })()}

      {/* Render dynamic header menus (or navConfig items if API empty) after 'All categories' */}
      {(headerMenus.length > 0 ? headerMenus : navConfig).map((links) => {
        // when using headerMenus from API, convert shape { name, url, subMenus } -> { title, path, isDropdown }
        let item;
        if (links.name && links.url) {
          item = { title: links.name, path: links.url, isDropdown: Array.isArray(links.subMenus) && links.subMenus.length > 0 };
        } else {
          item = { ...(links || {}) };
          item.isDropdown = item.isDropdown || (Array.isArray(item.subMenus) && item.subMenus.length > 0);
        }

        // skip only the categories dropdown we already rendered
        const isCategoriesDropdown = (item.title || '').toLowerCase() === (allCategoriesItem.title || '').toLowerCase();
        if (isCategoriesDropdown) return null;

        const key = links._id || links.title || Math.random();
        // if this item has subMenus, pass them as data so the popover can render
        const dataProp = item.isDropdown && Array.isArray(links.subMenus)
          ? [{ name: item.title, subMenus: links.subMenus }]
          : categories;
          return (
            <MenuDesktopItem
              scrollPosition={scrollPosition}
              key={key}
              data={dataProp}
              item={item}
              isLoading={isMenusLoading}
              pathname={pathname}
              isOpen={openKey === key}  // Corrected to use openKey
              onOpen={() => handleOpen(key)}  // Corrected to pass the key
              onClose={handleClose}
              isOffset={isOffset}
              isHome={isHome}
              router={router}
            />
          );
      })}
    </Stack>
    
    {/* Centralized dropdown that appears in the same position for all menu items */}
    {openKey && (() => {
      // For categories dropdown, use the new CategoryDropdown component
      if (openKey === 'categories-dropdown') {
        return (
          <CategoryDropdown
            categories={categories}
            isOpen={true}
            onClose={handleClose}
            buttonRef={categoriesButtonRef}
            onMouseEnter={() => {
              if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
                closeTimeoutRef.current = null;
              }
            }}
            onMouseLeave={handleClose}
          />
        );
      }
      
      // For other dropdowns, use the original CustomDropdown
      let dropdownData = categories;
      
      // Find the menu item data for other dropdowns
      const allMenus = headerMenus.length > 0 ? headerMenus : navConfig;
      const menuItem = allMenus.find(item => (item._id || item.title) === openKey);
      if (menuItem && Array.isArray(menuItem.subMenus)) {
        dropdownData = [{ name: menuItem.name || menuItem.title, subMenus: menuItem.subMenus }];
      }
      
      return (
        <CustomDropdown
          isOpen={true}
          onClose={handleClose}
          isLoading={isMenusLoading}
          data={dropdownData}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
              closeTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleClose}
        />
      );
    })()}
    </Box>
  );
}

MenuDesktop.propTypes = {
  isLeft: PropTypes.bool,
  isHome: PropTypes.bool,
  categories: PropTypes.array.isRequired,
  isOffset: PropTypes.bool.isRequired,
  navConfig: PropTypes.array.isRequired
};
