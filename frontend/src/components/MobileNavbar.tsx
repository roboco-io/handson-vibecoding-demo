import { Group, ActionIcon, Box } from '@mantine/core';
import { IconHome, IconUser, IconSettings } from '@tabler/icons-react';

export function MobileNavbar() {
  return (
    <Box
      py="xs"
      bg="white"
      style={{
        borderTop: '1px solid var(--mantine-color-gray-3)',
        position: 'sticky',
        bottom: 0,
        width: '100%',
      }}
      hiddenFrom="md"
    >
      <Group justify="space-around">
        <ActionIcon
          variant="transparent"
          color="blue"
          size="lg"
          aria-label="홈"
        >
          <IconHome size={24} />
        </ActionIcon>
        <ActionIcon
          variant="transparent"
          color="gray"
          size="lg"
          aria-label="프로필"
        >
          <IconUser size={24} />
        </ActionIcon>
        <ActionIcon
          variant="transparent"
          color="gray"
          size="lg"
          aria-label="설정"
        >
          <IconSettings size={24} />
        </ActionIcon>
      </Group>
    </Box>
  );
}
