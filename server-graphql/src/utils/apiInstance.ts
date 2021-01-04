import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.BACKEND_ENDPOINT,
  validateStatus: (status) => status >= 200 && status < 400,
});

export default axios;
