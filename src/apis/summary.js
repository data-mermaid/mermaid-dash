import axios from 'axios';

export default axios.create({
  baseURL: 'https://summary-api.datamermaid.org/v1'
});
