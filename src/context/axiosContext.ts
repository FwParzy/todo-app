import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'prod'
    ? 'https://server-v63qf.ondigitalocean.app/'  // Production URL
    : 'http://localhost:8081/';                  // Development URL

const axiosInstance = axios.create({ baseURL });

export default axiosInstance;
