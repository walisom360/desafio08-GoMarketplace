import axios from 'axios';

// 'http://10.0.2.2:3333'
// 192.168.15.1

const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export default api;
