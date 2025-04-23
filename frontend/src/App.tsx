import { Stack, Box, Container } from '@mantine/core';
import { MantineProvider } from './components/MantineProvider';
import { TodoProvider } from './contexts/TodoContext';
import { Header } from './components/Header';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <MantineProvider>
      <TodoProvider>
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container fluid px="md" py="md" style={{ flex: 1 }}>
            <Stack>
              <TodoInput />
              <TodoList />
            </Stack>
          </Container>
        </Box>
      </TodoProvider>
    </MantineProvider>
  );
}

export default App;
