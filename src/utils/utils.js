import api from '../api/Api';

export const authUtils = {
  isAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const res = await api.verifyToken();
      return res.user;
    } catch {
      return false;
    }
  },
};
