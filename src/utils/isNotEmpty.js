import * as R from 'ramda'

function isNotEmpty(arg) {
  return R.apply(R.compose(R.not, R.isEmpty), [arg])
}

export default isNotEmpty
