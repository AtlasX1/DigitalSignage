import * as R from 'ramda'

const sortByTitle = R.sortBy(R.prop('title'))
const sortByName = R.sortBy(R.prop('name'))
const sortByFirstName = R.sortBy(R.prop('firstName'))

export default {
  sortByTitle,
  sortByName,
  sortByFirstName
}
