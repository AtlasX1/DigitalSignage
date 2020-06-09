import React, { useCallback, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  putPreferenceByEntity,
  getPreferenceByEntity
} from 'actions/preferenceActions'
import useUserRole from 'hooks/tableLibrary/useUserRole'
import { stableSort } from 'utils'

const usePreference = (
  { fetcher, initialColumns, entity, initialPerPage, ...fetcherParams },
  newColumns
) => {
  const [columns, setColumns] = useState(initialColumns)
  const [perPage, setPerPage] = useState(initialPerPage)
  const [isDefault, setIsDefault] = useState(false)
  const role = useUserRole()

  const setColumnsWithSortOrder = useCallback(
    cols =>
      setColumns(
        stableSort(
          cols,
          (lhs, rhs) => (lhs.sortOrder || 0) - (rhs.sortOrder || 0)
        )
      ),
    [setColumns]
  )

  useEffect(() => {
    if (!isEmpty(newColumns)) setColumnsWithSortOrder(newColumns)
  }, [newColumns, setColumnsWithSortOrder])

  const preference = useSelector(
    ({
      preference: {
        [entity]: { response: preference }
      }
    }) => preference
  )

  const status = useSelector(
    ({
      preference: {
        [entity]: { status }
      }
    }) => status
  )

  const dispatch = useDispatch()

  useEffect(() => {
    if (role.system || role.org) {
      dispatch(getPreferenceByEntity(entity))
    }
    // eslint-disable-next-line
  }, [role])

  useEffect(() => {
    if (!isEmpty(preference)) {
      const { gridColumn, recordsPerPage } = preference
      if (gridColumn.length === 0) {
        setIsDefault(true)
      }
      const newColumns = columns.map(column => {
        const gridCol = Array.isArray(gridColumn)
          ? gridColumn.find(gridCol => gridCol.id && gridCol.id === column.id)
          : null
        return gridCol ? { ...column, ...gridCol } : column
      })
      setColumnsWithSortOrder(newColumns)
      setPerPage(recordsPerPage)
      fetcher({
        limit: recordsPerPage,
        ...fetcherParams
      })
    } else if (status === 'empty') {
      fetcher({
        page: 1
      })
    }

    // eslint-disable-next-line
  }, [preference, setColumnsWithSortOrder])

  const changeColumns = useCallback(
    values => {
      setColumnsWithSortOrder(values)

      if (!role.enterprise) {
        dispatch(
          putPreferenceByEntity(entity, {
            recordsPerPage: perPage,
            gridColumn: values
          })
        )
      }
    },
    [dispatch, entity, role, perPage, setColumnsWithSortOrder]
  )

  const changeRecordsPerPage = useCallback(
    limit => {
      setPerPage(limit)
      if (!role.enterprise) {
        dispatch(
          putPreferenceByEntity(entity, {
            recordsPerPage: limit,
            gridColumn: columns
          })
        )
      }
    },
    [columns, dispatch, entity, role]
  )

  const toggleDisplayColumn = useCallback(
    (id, display) => {
      setIsDefault(false)

      const modifiedColumns = columns.map(value =>
        id === value.id
          ? {
              ...value,
              display: display == null ? value.display === false : display
            }
          : value
      )

      if (!role.enterprise) {
        dispatch(
          putPreferenceByEntity(entity, {
            recordsPerPage: perPage,
            gridColumn: modifiedColumns
          })
        )
      }
      setColumnsWithSortOrder(modifiedColumns)
      return modifiedColumns
    },
    [dispatch, entity, role, perPage, columns, setColumnsWithSortOrder]
  )

  return {
    actions: {
      changeColumns,
      changeRecordsPerPage,
      toggleDisplayColumn
    },
    columns,
    perPage,
    isDefault
  }
}

export default usePreference

export const withPreference = mapPropsToPreference => Component => {
  return props => {
    const { actions, columns, perPage } = usePreference(
      mapPropsToPreference(props)
    )
    return (
      <Component
        preferenceActions={actions}
        preferenceColumns={columns}
        preferencePerPage={perPage}
        {...props}
      />
    )
  }
}
