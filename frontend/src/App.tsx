import { Stack, Box } from '@mantine/core';
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
          <Box style={{ flex: 1, width: '100%', padding: '1rem 1rem 0' }}>
            <Stack style={{ maxWidth: '100%' }}>
              <TodoInput />
              <TodoList />
            </Stack>
          </Box>
          <MobileNavbar />
        </Box>
      </TodoProvider>
    </MantineProvider>
  );
}

export default App;
