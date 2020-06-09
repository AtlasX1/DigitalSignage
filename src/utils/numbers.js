const isEven = n => n % 2 === 0

export const numberToString = n => (n < 10 ? `0${n}` : `${n}`)

export const stringToNumber = n => (n[0] === '0' ? +n.slice(1) : +n)

export const parseLocaleNumberValue = num =>
  parseFloat(
    typeof num === 'string'
      ? num.includes('.')
        ? num.replace(/,/g, '')
        : num.replace(/,/g, '.')
      : num || 0
  )

export default isEven
