import axios from 'axios';

export default axios.create({
  baseURL: `${process.env.REACT_APP_DEV_API_URL}/v1/`
});
