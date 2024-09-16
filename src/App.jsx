import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '../src/components/layout/AppLayout';
import AuthLayout from '../src/components/layout/AuthLayout';
import Home from '../src/pages/Home';
import Board from '../src/pages/Board';
import Login from '../src/pages/Login';
import Signup from '../src/pages/Signup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout component={<Home />} />,
  },
  {
    path: '/login',
    element: <AuthLayout component={<Login />} />,
  },
  {
    path: '/signup',
    element: <AuthLayout component={<Signup />} />,
  },
  {
    path: '/boards',
    element: <AppLayout component={<Home />} />,
  },
  {
    path: '/boards/:boardId',
    element: <AppLayout component={<Board />} />,
  },
]);

function App() {
  const theme = createTheme({
    palette: { mode: 'dark' },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;

