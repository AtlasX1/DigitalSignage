import axios from 'axios'

import { apiConstants } from '../constants'

export const getDummyUserPicture = async (
  resultsCount = apiConstants.DEFAULT_RESULT_COUNT
) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://randomuser.me/api/?inc=picture&results=${resultsCount}`
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
