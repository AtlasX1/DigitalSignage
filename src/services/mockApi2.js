import axios from 'axios'

import * as config from '../config'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios.create({
  baseURL: config.MOCK_API_URL_2,
  responseType: 'json'
})
