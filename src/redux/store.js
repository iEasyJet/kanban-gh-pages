import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import boardReducer from './Slices/boardSlice';
import favoriteReduser from './Slices/favoriteSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    board: boardReducer,
    favorite: favoriteReduser,
  },
});
