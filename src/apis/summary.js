import axios from 'axios'

export default axios.create({
  baseURL: `${process.env.REACT_APP_MERMAID_API_URL}/v1/`,
})
