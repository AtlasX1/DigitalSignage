import { useCallback, useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  putPreferenceByEntity,
  getPreferenceByEntity
} from 'actions/preferenceActions'
import useUserRole from 'hooks/tableLibrary/useUserRole'

const usePreference = (
  { fetcher, initialColumns, entity, perPage },
  newColumns
) => {
  const [columns, setColumns] = useState(initialColumns)
  const role = useUserRole()

  useEffect(() => {
    if (!isEmpty(newColumns)) setColumns(newColumns)
  }, [newColumns])

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

      if (Array.isArray(gridColumn)) {
        // add newly created columns not set in the preferences to the end of column list
        const localColumns = columns.filter(
          col =>
            !gridColumn.some(gridCol => gridCol.id && gridCol.id === col.id)
        )

        setColumns([...gridColumn, ...localColumns])
      }

      fetcher({
        limit: recordsPerPage
      })
    } else if (status === 'empty') {
      fetcher({
        page: 1
      })
    }

    // eslint-disable-next-line
  }, [preference])

  const changeColumns = useCallback(
    values => {
      setColumns(values)

      if (!role.enterprise) {
        dispatch(
          putPreferenceByEntity(entity, {
            recordsPerPage: perPage,
            gridColumn: values
          })
        )
      }
    },
    [dispatch, entity, role, perPage]
  )

  const changeRecordsPerPage = useCallback(
    limit => {
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
    index => {
      setColumns(values => {
        const modifiedColumns = values.map((value, ind) =>
          ind === index ? { ...value, display: !value.display } : value
        )

        if (!role.enterprise) {
          dispatch(
            putPreferenceByEntity(entity, {
              recordsPerPage: perPage,
              gridColumn: modifiedColumns
            })
          )
        }

        return modifiedColumns
      })
    },
    [dispatch, entity, role, perPage]
  )

  return {
    actions: {
      changeColumns,
      changeRecordsPerPage,
      toggleDisplayColumn
    },
    columns
  }
}

export default usePreference
