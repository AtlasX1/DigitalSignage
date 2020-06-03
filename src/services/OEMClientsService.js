import mockApi2 from './mockApi2'

const getOEMClientsLibraryItems = async () => {
  try {
    const response = await mockApi2({
      method: 'GET',
      url: '/oem-clients'
    })

    return response.data
  } catch (error) {
    throw new Error(error)
  }
}

export default {
  getOEMClientsLibraryItems
}
