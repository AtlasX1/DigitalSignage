import * as R from 'ramda'

export const sortByTitle = R.compose(R.sortBy(R.prop('title')), R.defaultTo([]))
export const sortByName = R.compose(R.sortBy(R.prop('name')), R.defaultTo([]))
export const sortByFirstName = R.compose(
  R.sortBy(R.prop('firstName')),
  R.defaultTo([])
)
export const sortBySortOrder = R.compose(
  R.sortBy(R.prop('sortOrder')),
  R.defaultTo([])
)
export const sortByFullName = R.compose(
  R.sortBy(R.compose(R.join(' '), R.props(['firstName', 'lastName']))),
  R.defaultTo([])
)

export default {
  sortByTitle,
  sortByName,
  sortByFirstName,
  sortBySortOrder,
  sortByFullName
}
