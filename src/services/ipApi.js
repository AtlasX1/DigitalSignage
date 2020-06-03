import axios from 'axios'

import * as config from '../config'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios.create({
  baseURL: config.IP_API_URL,
  responseType: 'json'
})
