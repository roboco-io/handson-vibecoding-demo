import { useMemo, useState } from 'react';
import { Box, Table, Text, Paper, Pagination, Group, Stack, Checkbox, Badge, ActionIcon } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';
import { useTodoState, useTodoDispatch, TodoActionType } from '../contexts/TodoContext';
import { TodoStatus, TodoPriority } from '@vibecoding-demo/shared/src/types/todo';

const priorityConfig = {
  [TodoPriority.HIGH]: { color: 'red', label: '높음' },
  [TodoPriority.MEDIUM]: { color: 'yellow', label: '중간' },
  [TodoPriority.LOW]: { color: 'green', label: '낮음' },
};

export function TodoList() {
  const todos = useTodoState();
  const dispatch = useTodoDispatch();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 필터링 및 정렬된 Todo 목록
  const filteredAndSortedTodos = useMemo(() => {
    // 필터링
    let result = [...todos];
    if (filter === 'active') {
      result = result.filter(todo => todo.status === TodoStatus.ACTIVE);
    } else if (filter === 'completed') {
      result = result.filter(todo => todo.status === TodoStatus.COMPLETED);
    }

    // 정렬
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        // 우선순위 정렬 (높음 > 중간 > 낮음)
        const priorityOrder = {
          [TodoPriority.HIGH]: 0,
          [TodoPriority.MEDIUM]: 1,
          [TodoPriority.LOW]: 2
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'title') {
        // 제목 정렬
        return a.title.localeCompare(b.title);
      } else {
        // 생성일 정렬 (최신순)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [todos, filter, sortBy]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAndSortedTodos.length / itemsPerPage);
  const paginatedTodos = filteredAndSortedTodos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 화면 크기에 따라 테이블 또는 리스트 형태로 표시
  return (
    <Stack style={{ width: '100%' }}>
      <TodoFilters 
        filter={filter} 
        setFilter={setFilter} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
      />

      <Paper withBorder p={0} style={{ width: '100%', overflow: 'auto' }}>
        {/* 데스크톱 뷰 - 테이블 형태 (md 이상 화면에서만 표시) */}
        <Box visibleFrom="md" style={{ width: '100%' }}>
          <Table striped highlightOnHover style={{ width: '100%', tableLayout: 'fixed' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 50 }}>상태</Table.Th>
                <Table.Th>할일</Table.Th>
                <Table.Th style={{ width: 100 }}>우선순위</Table.Th>
                <Table.Th style={{ width: 50 }}>작업</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedTodos.length > 0 ? (
                paginatedTodos.map(todo => (
                  <Table.Tr key={todo.id} data-testid={`todo-row-${todo.id}`}>
                    <Table.Td>
                      <Checkbox
                        checked={todo.status === TodoStatus.COMPLETED}
                        onChange={() => {
                          dispatch({
                            type: TodoActionType.TOGGLE_TODO_STATUS,
                            payload: { id: todo.id }
                          });
                        }}
                        aria-label={`할일 ${todo.status === TodoStatus.COMPLETED ? '완료 취소' : '완료'}`}
                      />
                    </Table.Td>
                    <Table.Td>
                      <Text 
                        style={{ 
                          textDecoration: todo.status === TodoStatus.COMPLETED ? 'line-through' : 'none',
                          wordBreak: 'break-word'
                        }}
                      >
                        {todo.title}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge 
                        color={priorityConfig[todo.priority].color}
                        variant="filled"
                        size="sm"
                      >
                        {priorityConfig[todo.priority].label}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon 
                        variant="subtle" 
                        color="gray" 
                        aria-label="할일 메뉴"
                      >
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text ta="center" py="lg" c="dimmed">
                      할일이 없습니다. 새로운 할일을 추가해보세요!
                    </Text>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Box>

        {/* 모바일 뷰 - 리스트 형태 (sm 이하 화면에서만 표시) */}
        <Box hiddenFrom="md">
          {paginatedTodos.length > 0 ? (
            paginatedTodos.map(todo => (
              <TodoItem key={todo.id} todo={todo} />
            ))
          ) : (
            <Text ta="center" py="lg" c="dimmed">
              할일이 없습니다. 새로운 할일을 추가해보세요!
            </Text>
          )}
        </Box>
      </Paper>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Group justify="center" mt="sm">
          <Pagination 
            total={totalPages} 
            value={currentPage} 
            onChange={setCurrentPage} 
            size="sm" 
          />
        </Group>
      )}
    </Stack>
  );
}
