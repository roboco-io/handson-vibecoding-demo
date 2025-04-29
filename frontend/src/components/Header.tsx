import { Box, Group, Title, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';

export function Header() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box py="md" bg="blue.6" style={{ color: 'white', width: '100%' }}>
      <Box style={{ width: '100%', padding: '0 1rem' }}>
        <Group justify="space-between" style={{ width: '100%' }}>
          <Title order={1} size="h2">TODO APP</Title>
          <ActionIcon 
            variant="transparent" 
            color="white" 
            onClick={toggleColorScheme}
            aria-label="테마 전환"
          >
            {colorScheme === 'dark' ? <IconSun size={24} /> : <IconMoon size={24} />}
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
}
