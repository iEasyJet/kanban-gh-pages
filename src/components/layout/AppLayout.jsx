import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authUtils } from '../../utils/utils';
import Loading from '../common/Loading';
import { Box } from '@mui/material';
import Sidebar from '../common/Sidebar';
import { setUser } from '../../redux/Slices/userSlice';

function AppLayout({ component }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.warn = console.error = () => {};
    const checkAuth = async () => {
      const user = await authUtils.isAuth();
      if (!user) {
        navigate('/login');
      } else {
        setLoading(false);
        dispatch(setUser(user));
      }
    };

    checkAuth();
  }, [navigate, dispatch]);
  return loading ? (
    <Loading fullHeight />
  ) : (
    <Box
      sx={{
        display: 'flex',
      }}
    >
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          p: 1,
          width: 'max-content',
        }}
      >
        {component}
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;
