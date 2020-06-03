import moment from 'moment'

const identifyEndOfWord = (n, textForms) => {
  if (Number.isNaN(n)) return textForms[0]
  return n < 2 ? textForms[0] : textForms[1]
}

const identifyEndOfWordForDayOfMonth = dayOfMonth => {
  switch (dayOfMonth) {
    case 1:
      return `${dayOfMonth}st day`
    case 2:
      return `${dayOfMonth}nd day`
    case 3:
      return `${dayOfMonth}rd day`
    case 4:
      return `${dayOfMonth}th day`
    case 21:
      return `${dayOfMonth}st`
    case 22:
      return `${dayOfMonth}nd`
    case 23:
      return `${dayOfMonth}rd`
    case 31:
      return `${dayOfMonth}st`
    default:
      return `${dayOfMonth}th`
  }
}

const identifyNumberDayOfWeekInMonth = date => {
  let number
  if (moment(date).format('DD') <= 7) {
    number = 'first'
  }
  if (moment(date).format('DD') >= 8 && moment(date).format('DD') <= 14) {
    number = 'second'
  }
  if (moment(date).format('DD') >= 15 && moment(date).format('DD') <= 21) {
    number = 'third'
  }
  if (moment(date).format('DD') >= 22 && moment(date).format('DD') <= 28) {
    number = 'fourth'
  }
  if (moment(date).format('DD') >= 29 && moment(date).format('DD') <= 31) {
    number = 'fifth'
  }
  return `${number} ${moment(date).format('dddd')}`
}

const ucFirst = str => {
  if (!str) return str

  return str[0].toUpperCase() + str.slice(1)
}

export {
  identifyEndOfWord,
  identifyNumberDayOfWeekInMonth,
  identifyEndOfWordForDayOfMonth,
  ucFirst
}
