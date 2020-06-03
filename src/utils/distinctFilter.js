import _get from 'lodash/get'
import _isEqual from 'lodash/isEqual'

export const filterBySelector = (arr, selector = null) => {
  const prevValues = []
  return arr.filter(item => {
    const value = selector ? selector(item) : item
    if (prevValues.some(prev => _isEqual(prev, value))) {
      return false
    }
    prevValues.push(value)
    return true
  })
}
export const filterByField = (arr, field = null) => {
  const selector = field ? item => _get(item, field) : null
  return filterBySelector(arr, selector)
}
