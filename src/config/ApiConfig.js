import axios from 'axios';

//https://warcat2024-qy2v.onrender.com
const baseURL = `${process.env.REACT_APP_HOSTNAME}/api`;
const authToken = localStorage.getItem('token');

const ApiConfig = {
  requestData: async (method, endpoint, param, data) => {
    try {
      const response = await axios.request({
        method: method,
        url: baseURL + endpoint,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        params: param,
        data: data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ApiConfig;