import { Select, Group } from '@mantine/core';
import { IconFilter, IconArrowsSort } from '@tabler/icons-react';

interface TodoFiltersProps {
  filter: string;
  setFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

export function TodoFilters({ filter, setFilter, sortBy, setSortBy }: TodoFiltersProps) {
  return (
    <Group gap="md" mb="md" grow>
      <Select
        leftSection={<IconFilter size={16} />}
        placeholder="필터: 모두 보기"
        value={filter}
        onChange={(value) => setFilter(value || 'all')}
        data={[
          { value: 'all', label: '모두 보기' },
          { value: 'active', label: '활성 항목만' },
          { value: 'completed', label: '완료 항목만' }
        ]}
        data-testid="todo-filter"
      />
      <Select
        leftSection={<IconArrowsSort size={16} />}
        placeholder="정렬: 우선순위"
        value={sortBy}
        onChange={(value) => setSortBy(value || 'priority')}
        data={[
          { value: 'priority', label: '우선순위' },
          { value: 'title', label: '제목' },
          { value: 'date', label: '생성일' }
        ]}
        data-testid="todo-sort"
      />
    </Group>
  );
}
