import axios from 'axios';
import Cookies from "js-cookie";



//https://warcat2024-qy2v.onrender.com
const baseURL = `${process.env.REACT_APP_HOSTNAME}/api`;
const authToken = localStorage.getItem('token');
console.log(authToken)

const ApiConfig = {
  requestData: async (method, endpoint, params, data) => {
    try {
      const response = await axios.request({
        method: method,
        url: baseURL + endpoint,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
        params: params,
        data: data
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ApiConfig;