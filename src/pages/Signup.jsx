import { Box, TextField, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/Api';

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usernameErrText, setUsernameErrText] = useState('');
  const [passwordErrText, setPasswordErrText] = useState('');
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setUsernameErrText('');
    setPasswordErrText('');
    setConfirmPasswordErrText('');

    const data = new FormData(e.target);

    const username = data.get('username').trim();
    const password = data.get('password').trim();
    const confirmPassword = data.get('confirmPassword').trim();

    let err = false;

    if (username === '') {
      err = true;
      setUsernameErrText('Пожалуйста, заполните данное поле!');
    }

    if (password === '') {
      err = true;
      setPasswordErrText('Пожалуйста, заполните данное поле!');
    }

    if (confirmPassword === '') {
      err = true;
      setConfirmPasswordErrText('Пожалуйста, заполните данное поле!');
    }

    if (confirmPassword !== password) {
      err = true;
      setConfirmPasswordErrText(
        'Поле "Пароль" и "Подтвердите пароль" должны совпадать!'
      );
    }

    if (err) return;

    setLoading(true);

    try {
      const res = await api.signup({ username, password, confirmPassword });
      setLoading(false);
      localStorage.setItem('token', res.token);
      navigate('/');
    } catch (err) {
      err.then((err) => {
        const errors = err.errors;

        errors.forEach((el) => {
          if (el.path === 'username') {
            setUsernameErrText(el.msg);
          }
          if (el.path === 'password') {
            setPasswordErrText(el.msg);
          }
          if (el.path === 'confirmPassword') {
            setConfirmPasswordErrText(el.msg);
          }
        });
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
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Подтвердите пароль"
          name="confirmPassword"
          type="password"
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Зарегистрироваться
        </LoadingButton>
      </Box>
      <Button LinkComponent={Link} to="/login" sx={{ textTransform: 'none' }}>
        Есть аккаунт? Войти.
      </Button>
    </>
  );
}

export default Signup;
