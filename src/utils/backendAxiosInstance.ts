import axios from 'axios';

const backendAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://novel-angelina-widaputri-262ba12a.koyeb.app',
});

// Add the same token interceptor
backendAxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      console.log(token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backendAxiosInstance;