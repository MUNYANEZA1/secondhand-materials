
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setTheme } from '@/store/slices/uiSlice';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useAppSelector(state => state.ui.theme);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return <>{children}</>;
};
