import { Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch } from 'react-redux';
import { setBoard } from '../redux/Slices/boardSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api/Api';
import { useState } from 'react';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function createBoard() {
    setLoading(true);
    try {
      const res = await api.createBoard();
      const boardId = res._id;

      dispatch(setBoard([res]));
      navigate(`/boards/${boardId}`);
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoadingButton
        variant="outlined"
        color="success"
        onClick={createBoard}
        loading={loading}
      >
        Кликни сюда, чтобы создать свою первую доску
      </LoadingButton>
    </Box>
  );
}

export default Home;
