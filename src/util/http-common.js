import axios from 'axios';

const HTTP  = axios.create({
  baseURL: process.env.VUE_APP_ROOT_API
})

export default HTTP