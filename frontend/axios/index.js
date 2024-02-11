import axios from 'axios';

const axiosWithAuth = () => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  return axios.create({
    baseURL: 'http://localhost:9000/api',
    headers: {
      Authorization: token, // Set the Authorization header with the token
    },
  });
};


export default axiosWithAuth;
