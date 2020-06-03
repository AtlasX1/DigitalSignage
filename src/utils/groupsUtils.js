import * as R from 'ramda'

const sortByTitle = R.sortBy(R.compose(R.toLower, R.prop('title')))

export default {
  sortByTitle
}
