import { useState } from 'react';
import { TextInput, Button, Group, Box, Select } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { useTodoDispatch } from '../contexts/TodoContext';
import { TodoActionType } from '../contexts/TodoContext';
import { TodoPriority } from '@vibecoding-demo/shared/src/types/todo';

export function TodoInput() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<string>(TodoPriority.MEDIUM);
  const dispatch = useTodoDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      dispatch({
        type: TodoActionType.ADD_TODO,
        payload: {
          title: title.trim(),
          priority: priority as TodoPriority
        }
      });
      setTitle('');
      setPriority(TodoPriority.MEDIUM);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} mb="md">
      <Group align="flex-end" gap="sm">
        <TextInput
          leftSection={<IconPencil size={16} />}
          placeholder="새 할일 추가"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flex: 1 }}
          data-testid="todo-input"
        />
        <Select
          placeholder="우선순위"
          value={priority}
          onChange={(value) => setPriority(value || TodoPriority.MEDIUM)}
          data={[
            { value: TodoPriority.HIGH, label: '높음' },
            { value: TodoPriority.MEDIUM, label: '중간' },
            { value: TodoPriority.LOW, label: '낮음' }
          ]}
          style={{ width: '120px' }}
          data-testid="todo-priority-select"
        />
        <Button 
          type="submit" 
          leftSection={<IconPlus size={16} />}
          disabled={!title.trim()}
          data-testid="add-todo-button"
        >
          추가
        </Button>
      </Group>
    </Box>
  );
}
