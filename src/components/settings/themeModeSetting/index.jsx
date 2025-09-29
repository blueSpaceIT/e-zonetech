import React from 'react';
// redux
import { useDispatch, useSelector } from 'react-redux';
// icons
import { setThemeMode } from 'src/lib/redux/slices/settings';
import { IoSunny } from 'react-icons/io5';
import { IoMoonOutline } from 'react-icons/io5';
// mui
import { IconButton } from '@mui/material';
export default function SettingMode() {
  const { themeMode } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  return (
    <IconButton
      name="setting-mode"
      onClick={() => dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))}
      size="medium"
    >
      {themeMode === 'dark' ? <IoSunny size={24} /> : <IoMoonOutline size={24} />}
    </IconButton>
  );
}
