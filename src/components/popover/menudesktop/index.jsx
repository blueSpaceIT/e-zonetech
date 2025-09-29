import React from 'react';
import PropTypes from 'prop-types';
// mui
import { Grid, Box, ListSubheader, ListItem } from '@mui/material';

// components
import MenuDesktopList from 'src/components/lists/menuDesktopList';
import MenuPopover from 'src/components/popover/popover';
import RootStyled from 'src/components/lists/menuDesktopList/styled';
import NextLink from 'next/link';

export default function MenuDesktop({ ...props }) {
  const { isOpen, onClose, isLoading, data, anchorEl, onMouseEnter, onMouseLeave } = props;

  return (
    <MenuPopover
      open={isOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorReference={anchorEl ? 'anchorEl' : 'anchorPosition'}
      anchorPosition={!anchorEl ? { top: 150, left: 0 } : undefined}
      isDesktop
      sx={{ display: 'block!important' }}
      PaperProps={{
        onMouseEnter: onMouseEnter,
        onMouseLeave: onMouseLeave
      }}
    >
      <Grid container spacing={3}>
        {data?.map((parent) => {
          // If parent looks like a category (has subCategories), render the MenuDesktopList
          if (parent?.subCategories) {
            return (
              <Grid item lg={2} key={parent.slug || parent.name}>
                <MenuDesktopList parent={parent} isLoading={isLoading} onClose={onClose} />
              </Grid>
            );
          }

          // If parent has subMenus (header menus), render each first-level submenu as its own column
          if (parent?.subMenus) {
            function IconBullet({ type = 'item' }) {
              return (
                <Box className="icon-bullet-main">
                  <Box component="span" className={`icon-bullet-inner ${type !== 'item' && 'active'}`} />
                </Box>
              );
            }

            return (
              <>
                {(parent.subMenus || []).map((child, ci) => (
                  <Grid item lg={2} key={`${parent.name || 'parent'}-${child.name || ci}`}>
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
                            <IconBullet type="sub" />
                            <Box sx={{ ml: 1 }}>{s.name}</Box>
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
    </MenuPopover>
  );
}
MenuDesktop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array
};
