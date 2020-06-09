import React, { useState, useEffect } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import * as Yup from 'yup'

import { withRouter } from 'react-router'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { withSnackbar } from 'notistack'
import { translate } from 'react-i18next'

import { CanvasProvider } from './components/canvas/CanvasProvider'
import CanvasReady from './components/HOC/CanvasReady'
import SaveDialog from './components/modals/SaveDialog'
import Content from './Content'
import Footer from './Footer'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'

import { mediaConstants as constants } from '../../../constants'

import './styles/_index.scss'

import {
  clearDesignGallery,
  getDesignGallery,
  postDesignGallery,
  putDesignGallery
} from 'actions/designGalleryActions'
import { getMediaItemsAction } from 'actions/mediaActions'

const styles = theme => ({
  root: {}
})

const validationSchema = Yup.object().shape({
  mediaInfo: Yup.object().shape({
    title: Yup.string().required('Enter design title')
  })
})

const DesignGallery = props => {
  const { t, classes, match } = props

  const dispatchAction = useDispatch()
  const [designGalleryReducer] = useSelector(state => [
    state.editor.designGallery.designGalleryItem
  ])

  const id = match.params.id
  const mode = id ? 'edit' : 'add'

  const [formSubmitting, setFormSubmitting] = useState(false)
  const [isSaveDialog, setSaveDialog] = useState(false)

  const form = useFormik({
    initialValues: {
      mediaInfo: { ...constants.mediaInfoInitvalue }
    },
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: values => {
      const { mediaInfo } = values

      const requestData = {
        ...mediaInfo
      }

      try {
        if (mode === 'add') {
          dispatchAction(postDesignGallery(requestData))
        } else {
          dispatchAction(putDesignGallery({ id, data: requestData }))
        }

        setFormSubmitting(true)

        setSaveDialog(false)
      } catch (e) {
        form.setFieldValue('mediaInfo.title', mediaInfo.title)
        console.log('error', e)
      }
    }
  })

  // ---- methods

  const showSnackbar = title => {
    props.enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => props.closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  // ---- effects

  useEffect(
    () => {
      if (id && mode === 'edit') {
        dispatchAction(getDesignGallery(id))
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (designGalleryReducer.response && id) {
        //TODO: Set data from BE
      }
    },
    // eslint-disable-next-line
    [designGalleryReducer.response]
  )

  useEffect(
    () => {
      if (!!designGalleryReducer.status) {
        if (designGalleryReducer.status === 'successfully') {
          showSnackbar(
            id
              ? `Design ${id} successfully edited`
              : 'Design successfully added'
          )

          dispatchAction(clearDesignGallery())

          dispatchAction(
            getMediaItemsAction({
              page: 1,
              limit: 10
            })
          )

          //TODO: add reset canvas
          form.resetForm()
        } else if (designGalleryReducer.status === 'error') {
          showSnackbar(designGalleryReducer.error.message)
        }
      }
    },
    // eslint-disable-next-line
    [designGalleryReducer.status]
  )

  return (
    <div className={`${classes.root} design-gallery`}>
      <CanvasProvider>
        <DndProvider backend={HTML5Backend}>
          <CanvasReady>
            <LeftSidebar />
            <RightSidebar />
          </CanvasReady>

          <Content />
        </DndProvider>

        <Footer
          onSave={() => setSaveDialog(true)} // if edit do not open save dialog
          onSaveAs={() => setSaveDialog(true)}
        />
      </CanvasProvider>

      <SaveDialog
        isShow={isSaveDialog}
        form={form}
        disable={formSubmitting} // TODO: add is form submit value
        mode={mode} //TODO: add mode
        onSave={form.handleSubmit}
        onSaveAndClose={() => {
          form.handleSubmit()
        }}
        onClose={() => setSaveDialog(false)}
      />
    </div>
  )
}

export default compose(
  translate('translations'),
  withRouter,
  withSnackbar,
  withStyles(styles)
)(DesignGallery)
