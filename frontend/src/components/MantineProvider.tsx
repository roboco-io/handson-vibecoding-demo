import { MantineProvider as BaseMantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { ReactNode } from 'react';

// 테마 설정
const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif',
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Container: {
      defaultProps: {
        sizes: {
          xs: '100%',
          sm: '100%',
          md: '100%',
          lg: '100%',
          xl: '100%',
        },
      },
    },
  },
});

interface MantineProviderProps {
  children: ReactNode;
}

export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </BaseMantineProvider>
  );
}
