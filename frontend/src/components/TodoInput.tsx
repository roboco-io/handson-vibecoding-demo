import { useState } from 'react';
import { TextInput, Button, Group, Box } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { useTodoDispatch } from '../contexts/TodoContext';
import { TodoActionType } from '../contexts/TodoContext';
import { TodoPriority } from '@vibecoding-demo/shared/src/types/todo';

export function TodoInput() {
  const [title, setTitle] = useState('');
  const dispatch = useTodoDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      dispatch({
        type: TodoActionType.ADD_TODO,
        payload: {
          title: title.trim(),
          priority: TodoPriority.MEDIUM
        }
      });
      setTitle('');
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
