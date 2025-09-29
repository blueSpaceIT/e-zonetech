import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';
import NextLink from 'next/link';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const CategoryDropdown = ({ 
  categories, 
  isOpen, 
  onClose, 
  onMouseEnter, 
  onMouseLeave,
  buttonRef
}) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (isOpen && buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, buttonRef]);

  if (!isOpen) return null;

  const handleCategoryMouseEnter = (category) => {
    if (category.subCategories && category.subCategories.length > 0) {
      setHoveredCategory(category);
    } else {
      setHoveredCategory(null);
    }
  };

  const handleCategoryMouseLeave = () => {
    // Don't clear immediately - allow mouse to move to subcategory area
  };

  const handleSubcategoryAreaMouseLeave = () => {
    setHoveredCategory(null);
  };

  return (
    <Paper
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: 'absolute',
        top: `38px`,
        left: `-22px`,
        mt: 0,
        zIndex: 1300,
        display: 'flex',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: 'background.paper'
      }}
    >
      {/* Main Categories List */}
      <Box sx={{ width: '280px' }}>
        <List sx={{ py: 1 }}>
          {categories?.map((category, index) => (
            <React.Fragment key={category.slug || category.name || index}>
              <ListItem
                component={NextLink}
                href={`/products/${category.slug}`}
                onClick={onClose}
                onMouseEnter={() => handleCategoryMouseEnter(category)}
                onMouseLeave={handleCategoryMouseLeave}
                sx={{
                  py: 1.5,
                  px: 2,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: hoveredCategory?.slug === category.slug ? 'action.hover' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemText 
                  primary={category.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary'
                    }
                  }}
                />
                {category.subCategories && category.subCategories.length > 0 && (
                  <KeyboardArrowRightIcon 
                    sx={{ 
                      fontSize: 16, 
                      color: 'text.secondary',
                      ml: 1
                    }} 
                  />
                )}
              </ListItem>
              {index < categories.length - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Subcategories Panel - Expands to the right */}
      {hoveredCategory && hoveredCategory.subCategories && hoveredCategory.subCategories.length > 0 && (
        <Box 
          onMouseLeave={handleSubcategoryAreaMouseLeave}
          sx={{
            width: '280px',
            borderLeft: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box
              component={NextLink}
              href={`/products/${hoveredCategory.slug}`}
              onClick={onClose}
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'primary.main',
                textDecoration: 'none',
                display: 'block',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {hoveredCategory.name}
            </Box>
          </Box>
          <List sx={{ py: 1 }}>
            {hoveredCategory.subCategories.map((subcategory, index) => (
              <React.Fragment key={subcategory.slug || subcategory.name || index}>
                <ListItem
                  component={NextLink}
                  href={`/products/${hoveredCategory.slug}/${subcategory.slug}`}
                  onClick={onClose}
                  sx={{
                    py: 1,
                    px: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemText 
                    primary={subcategory.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '13px',
                        fontWeight: 400,
                        color: 'text.primary'
                      }
                    }}
                  />
                </ListItem>
                {index < hoveredCategory.subCategories.length - 1 && (
                  <Divider sx={{ mx: 2 }} />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

CategoryDropdown.propTypes = {
  categories: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  buttonRef: PropTypes.object
};

export default CategoryDropdown;
