import { Container, Stack, Box } from '@mantine/core';
import { MantineProvider } from './components/MantineProvider';
import { TodoProvider } from './contexts/TodoContext';
import { Header } from './components/Header';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { MobileNavbar } from './components/MobileNavbar';

function App() {
  return (
    <MantineProvider>
      <TodoProvider>
        <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Container size="md" py="md" style={{ flex: 1 }}>
            <Stack>
              <TodoInput />
              <TodoList />
            </Stack>
          </Container>
          <MobileNavbar />
        </Box>
      </TodoProvider>
    </MantineProvider>
  );
}

export default App;
