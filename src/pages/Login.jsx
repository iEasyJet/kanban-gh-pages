import { Box, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/Api';

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');

    const data = new FormData(e.target);

    const username = data.get('username').trim();
    const password = data.get('password').trim();

    let err = false;

    if (username === '') {
      err = true;
      setUsernameErrText('Пожалуйста, заполните данное поле!');
    }

    if (password === '') {
      err = true;
      setPasswordErrText('Пожалуйста, заполните данное поле!');
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await api.login({ username, password });
      setLoading(false);
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      err.then((err) => {
        setUsernameErrText(err);
        setPasswordErrText(err);
        setLoading(false);
      });
    }
  }

  return (
    <>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Имя пользователя"
          name="username"
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Пароль"
          name="password"
          type="password"
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Войти
        </LoadingButton>
      </Box>
      <Button LinkComponent={Link} to="/signup" sx={{ textTransform: 'none' }}>
        Нет аккаунта? Зарегистрироваться.
      </Button>
    </>
  );
}

export default Login;
