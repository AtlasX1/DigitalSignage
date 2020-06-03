import mockApi2 from './mockApi2'

export const getRSSFeedsLibraryItems = async () => {
  try {
    const response = await mockApi2({
      method: 'GET',
      url: '/rss-feeds'
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
