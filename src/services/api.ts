import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333', // ip do docker 192.168.99.100
});
export default api;
