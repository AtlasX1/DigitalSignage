import mockApi from './mockApi'

export const getChannelsLibraryItems = async () => {
  try {
    const response = await mockApi({
      method: 'GET',
      url: '/channels'
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}
