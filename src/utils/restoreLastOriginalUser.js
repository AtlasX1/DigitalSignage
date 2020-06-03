import clearStorage from 'utils/clearStorage'

export default () => {
  clearStorage()
  const originalUsersList = JSON.parse(localStorage.getItem('originalUsers'))
  const { type, token, expiresIn } = originalUsersList.pop()

  localStorage.setItem(type, token)
  localStorage.setItem('expiresIn', expiresIn)

  if (originalUsersList.length > 0) {
    localStorage.setItem('originalUsers', JSON.stringify(originalUsersList))
  } else {
    localStorage.removeItem('originalUsers')
  }
}
