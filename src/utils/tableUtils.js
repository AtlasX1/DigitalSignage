import { isEmpty } from 'lodash'

const transformerSelectedItems = (initAccum = {}, ids) =>
  ids.reduce(
    (accum, id) => ({
      ...accum,
      [id]: true
    }),
    { ...initAccum }
  )

const unselectItems = (list, ids) => {
  const modifiedList = { ...list }
  ids.forEach(id => {
    delete modifiedList[id]
  })
  return modifiedList
}

const checkData = (data, fallback = 'No data') => {
  return !isEmpty(data) || data ? data : fallback
}

const transformMeta = meta => ({
  ...meta,
  isLoading: false,
  perPage: Number.parseInt(meta.perPage)
})

export { unselectItems, transformerSelectedItems, checkData, transformMeta }
