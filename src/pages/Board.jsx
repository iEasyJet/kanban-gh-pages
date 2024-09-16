import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/Api';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Box, IconButton, TextField } from '@mui/material';
import EmojiPicker from '../components/common/EmojiPicker';
import { useDispatch, useSelector } from 'react-redux';
import { setBoard } from '../redux/Slices/boardSlice';
import { setFavorite } from '../redux/Slices/favoriteSlice';
import Kanban from '../components/common/Kanban';

let timer;
const timeout = 500;

function Board() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state) => state.board.value);
  const favoriteBoards = useSelector((state) => state.favorite.value);
  const { boardId } = useParams();
  const [boardInfo, setBoardInfo] = useState({
    title: '',
    description: '',
    sections: [],
    isFavorite: false,
    icon: '',
  });

  async function onChangeIcon(newIcon) {
    const temp = [...boards];
    const index = temp.findIndex((b) => b._id === boardId);
    temp[index] = { ...temp[index], icon: newIcon };

    try {
      await api.updateBoard(boardId, { icon: newIcon });
      setBoardInfo({ ...boardInfo, icon: newIcon });
      dispatch(setBoard(temp));

      if (boardInfo.isFavorite) {
        const temp = [...favoriteBoards];
        const index = temp.findIndex((b) => b._id === boardId);
        temp[index] = { ...temp[index], icon: newIcon };

        dispatch(setFavorite(temp));
      }
    } catch {
      alert(
        'Произошла ошибка при запросе к серверу при обнолвении иконки доски!'
      );
    }
  }

  function updateTitle(e) {
    clearTimeout(timer);
    const newTitle = e.target.value;

    const temp = [...boards];
    const index = temp.findIndex((b) => b._id === boardId);
    temp[index] = { ...temp[index], title: newTitle };

    setBoardInfo({ ...boardInfo, title: newTitle });
    dispatch(setBoard(temp));

    if (boardInfo.isFavorite) {
      const temp = [...favoriteBoards];
      const index = temp.findIndex((b) => b._id === boardId);
      temp[index] = { ...temp[index], title: newTitle };

      dispatch(setFavorite(temp));
    }

    timer = setTimeout(async () => {
      try {
        await api.updateBoard(boardId, { title: newTitle });
      } catch {
        alert(
          'Произошла ошибка при запросе к серверу при обновления заголовка доски!'
        );
      }
    }, timeout);
  }

  function updateDescription(e) {
    clearTimeout(timer);
    const newDescription = e.target.value;
    setBoardInfo({ ...boardInfo, description: newDescription });

    timer = setTimeout(async () => {
      try {
        await api.updateBoard(boardId, { description: newDescription });
      } catch {
        alert(
          'Произошла ошибка при запросе к серверу при обновления описания доски!'
        );
      }
    }, timeout);
  }

  async function addFavorite() {
    try {
      const board = await api.updateBoard(boardId, {
        favorite: !boardInfo.isFavorite,
      });

      let newFavoriteList = [...favoriteBoards];

      if (!board.favorite) {
        newFavoriteList = newFavoriteList.filter((el) => el._id !== boardId);
      } else {
        newFavoriteList.push(board);
      }

      dispatch(setFavorite(newFavoriteList));
      setBoardInfo({ ...boardInfo, isFavorite: !boardInfo.isFavorite });
    } catch {
      alert(
        'Произошла ошибка при запросе к серверу при обновления статуса "Избранное"!'
      );
    }
  }

  async function deleteBoard() {
    try {
      await api.deleteBoard(boardId);

      if (boardInfo.isFavorite) {
        const newFavoriteList = favoriteBoards.filter((el) => {
          return el._id !== boardId;
        });

        dispatch(setFavorite(newFavoriteList));
      }

      const newList = boards.filter((el) => {
        return el._id !== boardId;
      });

      dispatch(setBoard(newList));

      if (newList.length === 0) {
        navigate('/boards');
      } else {
        navigate(`/boards/${newList[0]._id}`);
      }
    } catch {
      alert('Произошла ошибка при запросе к серверу при удалении доски!');
    }
  }

  useEffect(() => {
    const getBoard = async () => {
      try {
        const board = await api.getOneBoard(boardId);
        setBoardInfo({
          title: board.title,
          description: board.description,
          sections: board.sections,
          isFavorite: board.favorite,
          icon: board.icon,
        });
      } catch {
        alert(
          'Произошла ошибка при запросе к серверу за данными выбранной доски!'
        );
      }
    };

    getBoard();
  }, [boardId]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <IconButton variant="outlined" onClick={addFavorite}>
          {boardInfo.isFavorite ? (
            <StarOutlinedIcon color="warning" />
          ) : (
            <StarBorderOutlinedIcon />
          )}
        </IconButton>
        <IconButton variant="outlined" color="error" onClick={deleteBoard}>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          <EmojiPicker icon={boardInfo.icon} onChange={onChangeIcon} />
          <TextField
            variant="outlined"
            placeholder="Заголовок доски"
            value={boardInfo.title}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': {
                fontSize: '2rem',
                fontWeight: '700',
              },
            }}
            onChange={updateTitle}
          />
          <TextField
            variant="outlined"
            placeholder="Описание доски"
            value={boardInfo.description}
            fullWidth
            multiline
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' },
            }}
            onChange={updateDescription}
          />
        </Box>

        <Box>
          <Kanban sections={boardInfo.sections} boardId={boardId} />
        </Box>
      </Box>
    </>
  );
}

export default Board;
