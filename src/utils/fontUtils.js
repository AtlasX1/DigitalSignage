const splitVariant = str => {
  let array = str.match(/[\d.]+|\D+/g)
  let weight = 400
  let style = 'regular'
  if (array.length === 2) {
    array[0] = Number.parseInt(array[0])
    weight = array[0]
    style = array[1]
  }
  if (array.length === 1 && array[0] !== 'regular' && array[0] !== 'italic') {
    array[0] = Number.parseInt(array[0])
    weight = array[0]
  } else if (array.length === 1) {
    style = array[0]
  }
  return {
    weight,
    style,
    variant: str
  }
}
export default splitVariant
