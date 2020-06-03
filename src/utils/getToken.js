import getTokenName from 'utils/getTokenName'

const getToken = () => localStorage.getItem(getTokenName())

export default getToken
