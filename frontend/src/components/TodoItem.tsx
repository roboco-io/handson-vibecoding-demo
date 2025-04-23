import { Checkbox, Badge, ActionIcon, Group, Text, Box } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { Todo, TodoPriority, TodoStatus } from '@vibecoding-demo/shared/src/types/todo';
import { useTodoDispatch } from '../contexts/TodoContext';
import { TodoActionType } from '../contexts/TodoContext';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useTodoDispatch();
  
  const handleToggle = () => {
    dispatch({
      type: TodoActionType.TOGGLE_TODO_STATUS,
      payload: { id: todo.id }
    });
  };

  // 우선순위에 따른 배지 색상 및 텍스트
  const priorityConfig = {
    [TodoPriority.HIGH]: { color: 'red', label: '높음' },
    [TodoPriority.MEDIUM]: { color: 'yellow', label: '중간' },
    [TodoPriority.LOW]: { color: 'blue', label: '낮음' }
  };

  return (
    <Box
      py="xs"
      style={{ 
        borderBottom: '1px solid var(--mantine-color-gray-3)',
        opacity: todo.status === TodoStatus.COMPLETED ? 0.6 : 1
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
          <Checkbox
            checked={todo.status === TodoStatus.COMPLETED}
            onChange={handleToggle}
            aria-label={`할일 ${todo.status === TodoStatus.COMPLETED ? '완료 취소' : '완료'}`}
            data-testid={`todo-checkbox-${todo.id}`}
          />
          <Text 
            style={{ 
              textDecoration: todo.status === TodoStatus.COMPLETED ? 'line-through' : 'none',
              flex: 1,
              wordBreak: 'break-word'
            }}
            data-testid={`todo-title-${todo.id}`}
          >
            {todo.title}
          </Text>
        </Group>
        
        <Group gap="xs" wrap="nowrap">
          <Badge 
            color={priorityConfig[todo.priority].color}
            variant="filled"
            size="sm"
            data-testid={`todo-priority-${todo.id}`}
          >
            {priorityConfig[todo.priority].label}
          </Badge>
          <ActionIcon 
            variant="subtle" 
            color="gray" 
            aria-label="할일 메뉴"
            data-testid={`todo-menu-${todo.id}`}
          >
            <IconDotsVertical size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}
