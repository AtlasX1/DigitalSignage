export const truncateWithEllipsis = (str, maxLength, ellipsis = '...') => {
  if (typeof str !== 'string') {
    return null
  }
  return str.length > maxLength ? str.substr(0, maxLength) + ellipsis : str
}
