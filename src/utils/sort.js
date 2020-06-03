const sortByOrder = (orders, array) => {
  const compare = (a, b) => {
    const aOrder =
      orders[a.id] && orders[a.id].sortOrder !== undefined
        ? orders[a.id].sortOrder
        : array.indexOf(a)
    const bOrder =
      orders[b.id] && orders[b.id].sortOrder !== undefined
        ? orders[b.id].sortOrder
        : array.indexOf(b)

    if (aOrder < bOrder) {
      return -1
    } else if (aOrder > bOrder) {
      return 1
    }
    return 0
  }

  return array.sort(compare)
}

export default sortByOrder
