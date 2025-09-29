// react
import { useState, useEffect, useCallback } from 'react';
// mui ui
import { styled } from '@mui/material/styles';
import { Box, OutlinedInput, InputAdornment } from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
// next js
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const RootStyle = styled(Box)(({ theme }) => ({
  maxHeight: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(0, 1)
  }
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 190,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),

  '&.Mui-focused': { width: 230, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`
  },
  [theme.breakpoints.down('sm')]: {
    width: 150,
    '&.Mui-focused': { width: 150 }
  }
}));

export default function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usedSearch = searchParams.get('search');
  const [search, setSearch] = useState(usedSearch || '');
  const onChange = (e) => {
    const val = e.target.value;
    setSearch(val);
  };

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      params.delete('page');

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (Boolean(search)) {
        router.push(`${pathname}?${createQueryString('search', search)}`);
      } else {
        router.push(`${pathname}`);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <RootStyle>
      <SearchStyle
        size="small"
        value={search}
        onChange={onChange}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <IoIosSearch size={20} style={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />
    </RootStyle>
  );
}
