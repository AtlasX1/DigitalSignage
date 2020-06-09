import update from 'immutability-helper'

export default (inObj, fromObj, excepts) => {
  const tmpObj = {}

  excepts.forEach(ex => {
    tmpObj[ex] = inObj[ex]
  })

  return update(fromObj, {
    $merge: tmpObj
  })
}
