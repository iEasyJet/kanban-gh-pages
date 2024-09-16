import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { authUtils } from '../../utils/utils';
import Loading from '../common/Loading';
import { Box, Container } from '@mui/material';
import logo from '../../images/logo.svg';

function AuthLayout({ component }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authUtils.isAuth();
      if (!isAuth) {
        setLoading(false);
      } else {
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return loading ? (
    <Loading fullHeight />
  ) : (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="Логотип" style={{ width: '100px' }} />
        {component}
        <Outlet />
      </Box>
    </Container>
  );
}

export default AuthLayout;
