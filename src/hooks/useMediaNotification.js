import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearAddedMedia,
  clearMediaPut,
  getMediaItemsAction
} from 'actions/mediaActions'
import { get as _get } from 'lodash'

const useMediaNotification = ({
  mediaName,
  tabName,
  form,
  t,
  showSnackbar,
  closeModal
}) => {
  const [mode, setMode] = useState('save')
  const { mediaNameLowerCase, tabNameLowerCase } = useMemo(() => {
    return {
      mediaNameLowerCase: mediaName.toLowerCase(),
      tabNameLowerCase: tabName.toLowerCase()
    }
  }, [mediaName, tabName])

  const addMediaReducer = useSelector(
    ({ addMedia }) => addMedia[mediaNameLowerCase][tabNameLowerCase]
  )
  const put = useSelector(({ media }) => media.put)
  const dispatchAction = useDispatch()

  useEffect(
    () => {
      const { response, error } = addMediaReducer
      if (response !== null) {
        form.resetForm()
        showSnackbar(t(`Media ${mediaName} ${tabName} successfully added`))

        dispatchAction(
          clearAddedMedia({
            mediaName: mediaNameLowerCase,
            tabName: tabNameLowerCase
          })
        )
        dispatchAction(getMediaItemsAction())
        if (mode === 'saveAndClose') {
          closeModal()
        }
      }

      if (error !== null) {
        const errors = _get(error, 'errorFields', [])
        handleBackendErrors(errors)
        if (errors)
          dispatchAction(
            clearAddedMedia({
              mediaName: mediaNameLowerCase,
              tabName: tabNameLowerCase
            })
          )
        showSnackbar(`Media ${mediaName} ${tabName} ${error.message}`)
      }
    },
    // eslint-disable-next-line
    [addMediaReducer]
  )

  useEffect(() => {
    const { response, error } = put
    if (response !== null) {
      // showSnackbar(t(`Media ${mediaName} ${tabName} successfully changed`))
      dispatchAction(getMediaItemsAction())
      dispatchAction(clearMediaPut())
      if (mode === 'saveAndClose') {
        closeModal()
      }
    }
    if (error !== null) {
      const errors = _get(error, 'errorFields', [])
      handleBackendErrors(errors)
      // showSnackbar(`Media ${mediaName} ${tabName} ${error.message}`)
      dispatchAction(clearMediaPut())
    }
    // eslint-disable-next-line
  }, [put])

  const handleBackendErrors = useCallback(
    errors => {
      errors.forEach(error => {
        if (error.name === 'title') {
          form.setFieldError('mediaInfo.title', error.value[0])
        }
      })
    },
    [form]
  )

  return useCallback(mode => {
    setMode(mode)
  }, [])
}

export default useMediaNotification
