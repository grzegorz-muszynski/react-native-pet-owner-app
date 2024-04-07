import axios from 'axios';

const client = axios.create({
  baseURL: 'http://192.168.29.140:8989',
});

export default client;
