export function isTruthy(...args) {
  return args.every(arg => !!arg)
}

export function isFalsy(...args) {
  return args.every(arg => !arg)
}

export function isSomeTruthy(...args) {
  return args.some(arg => !!arg)
}

export function isEmpty(arg) {
  if (Object.prototype.toString.call(arg) === '[object Object]') {
    return Object.keys(arg).length === 0
  }
  return arg.length === 0
}

export function takeTruth(...args) {
  return args.find(arg => !!arg)
}

export function isNumber(arg) {
  return typeof arg === 'number'
}

export function isEqual(value, other) {
  const type = Object.prototype.toString.call(value)
  if (type !== Object.prototype.toString.call(other)) return false
  if (['[object String]', '[object Number]', '[object Boolean]'].includes(type))
    return value === other
  if (type === '[object Function]') return toString(value) === toString(other)
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false
  const valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length
  const otherLen =
    type === '[object Array]' ? other.length : Object.keys(other).length
  if (valueLen !== otherLen) return false

  const compare = function (item1, item2) {
    const itemType = Object.prototype.toString.call(item1)
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false
      if (itemType === '[object Function]') {
        if (toString(item1) !== toString(item2)) return false
      } else {
        if (item1 !== item2) return false
      }
    }
  }
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false
    }
  } else {
    for (const key in value) {
      // eslint-disable-next-line
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false
      }
    }
  }
  return true
}
