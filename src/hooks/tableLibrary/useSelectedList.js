import { useCallback, useEffect, useMemo, useState } from 'react'
import { transformerSelectedItems, unselectItems } from 'utils/tableUtils'

const useSelectedList = rowsIds => {
  const [selectedList, changeSelectedList] = useState({})
  const [error, setError] = useState(null)
  const [wasValidate, toggleWasValidate] = useState(false)

  const count = useMemo(() => Object.keys(selectedList).length, [selectedList])

  const isSelect = useCallback(id => !!selectedList[id], [selectedList])

  const isPageSelect = useMemo(() => {
    return rowsIds.every(id => isSelect(id))
  }, [isSelect, rowsIds])

  const toggle = useCallback(
    id => {
      isSelect(id)
        ? changeSelectedList(values => ({
            ...unselectItems(values, [id])
          }))
        : changeSelectedList(values => ({
            ...values,
            [id]: true
          }))
    },
    [changeSelectedList, isSelect]
  )

  const select = useCallback(
    id => {
      changeSelectedList(values => ({
        ...values,
        [id]: true
      }))
    },
    [changeSelectedList]
  )

  const unselect = useCallback(id => {
    changeSelectedList(values => ({
      ...unselectItems(values, [id])
    }))
  }, [])

  const clear = useCallback(() => changeSelectedList({}), [])

  const pageSelect = useCallback(() => {
    !isPageSelect
      ? changeSelectedList({
          ...transformerSelectedItems(selectedList, rowsIds)
        })
      : changeSelectedList({
          ...unselectItems(selectedList, rowsIds)
        })
  }, [isPageSelect, rowsIds, selectedList])

  const selectedIds = useMemo(() => Object.keys(selectedList), [selectedList])

  const selectIds = useCallback(
    ids => {
      clear()
      return ids.forEach(id => select(id))
    },
    [clear, select]
  )

  useEffect(() => {
    if (wasValidate && count > 0) {
      setError(null)
      toggleWasValidate(false)
    }
  }, [count, wasValidate])

  const validate = useCallback(
    (msg = 'Please select items') => {
      if (count < 1) {
        setError(msg)
        toggleWasValidate(true)
        return false
      }
      return true
    },
    [count]
  )

  const isValid = useMemo(() => count > 0 && wasValidate === false, [
    count,
    wasValidate
  ])

  return {
    count,
    isSelect,
    toggle,
    unselect,
    pageSelect,
    isPageSelect,
    clear,
    selectedIds,
    selectIds,
    validate,
    error,
    isValid
  }
}

export default useSelectedList
