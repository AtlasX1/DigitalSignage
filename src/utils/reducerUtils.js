import * as R from 'ramda'

import { isNotEmpty } from 'utils/index'

function parse(
  reducer,
  onResponse = f => f,
  onError = f => f,
  spinnerFn = f => f
) {
  function parseResponse(response) {
    spinnerFn()
    return R.apply(
      R.ifElse(isNotEmpty, onResponse, () => {}),
      [response]
    )
  }

  function parseError(error) {
    spinnerFn()
    return R.apply(
      R.ifElse(isNotEmpty, onError, () => {}),
      [error]
    )
  }

  function parseNotEmpty(reducer) {
    return R.apply(
      R.ifElse(
        R.has('response'),
        R.partial(parseResponse, [R.prop('response', reducer)]),
        R.partial(parseError, [R.prop('error', reducer)])
      ),
      [reducer]
    )
  }

  function parse(reducer) {
    return R.apply(
      R.ifElse(isNotEmpty, parseNotEmpty, () => {}),
      [reducer]
    )
  }

  return parse(reducer)
}

function checkReducer(reducer, actionFn, args = []) {
  return R.apply(
    R.ifElse(R.isEmpty, R.partial(actionFn, args), () => {}),
    [reducer]
  )
}

export default { parse, checkReducer }
