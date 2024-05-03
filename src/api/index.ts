import axios from 'axios';

const login = async ({ email, role_type, password }: { email: string; role_type: string; password: string; }) => {
  try {
    const body = { email, role_type, password };
    return await axios.post(`${process.env.REACT_APP_API}/login`, body);
  } catch (error) {
    throw error;
  }
};

export const API = {
  login,
};
