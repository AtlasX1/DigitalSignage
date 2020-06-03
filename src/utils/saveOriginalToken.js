import getTokenName from 'utils/getTokenName'

export default () => {
  const tokenName = getTokenName()

  const authInfo = {
    type: tokenName,
    token: localStorage.getItem(tokenName),
    expiresIn: localStorage.getItem('expiresIn')
  }

  const originalUsersList =
    JSON.parse(localStorage.getItem('originalUsers')) || []
  const updatedOriginalUsersList = [...originalUsersList, authInfo]
  localStorage.setItem(
    'originalUsers',
    JSON.stringify(updatedOriginalUsersList)
  )
}
