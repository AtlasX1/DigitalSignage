import * as R from 'ramda'

const getTabName = R.compose(R.last, R.split('/'))

export default {
  getTabName
}
