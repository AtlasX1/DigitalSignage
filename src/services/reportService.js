import mockApi from './mockApi'

import { errorHandler } from '../utils'

export const getItems = async params => {
  try {
    const response = await mockApi({
      method: 'GET',
      url: '/reports',
      params
    })

    return {
      data: response.data,
      meta: {
        currentPage: 1,
        from: 1,
        lastPage: 1,
        perPage: '10',
        to: 10,
        total: 9,
        count: 10
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteSelectedReports = async ids => {
  try {
    await mockApi({
      method: 'DELETE',
      url: `/reports/bulk`,
      params: {
        ids: ids.join(',')
      }
    })
  } catch (e) {
    throw errorHandler(e)
  }
}
