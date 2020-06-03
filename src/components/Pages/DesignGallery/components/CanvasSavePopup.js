import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Typography, Button } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import { translate } from 'react-i18next'

import Popup from '../../../Popup'
import { BlueButton } from '../../../Buttons'
import CanvasSaveForm from './forms/CanvasSaveForm'
import { useCanvasState } from './canvas/CanvasProvider'
import { addTemplate } from '../../../../actions/signageEditorActions'

const useStyles = makeStyles({
  root: {
    fontFamily: 'Nunito Sans'
  },
  content: {
    padding: '20px 16px'
  },
  contentHeader: {
    padding: '10px 0 23px',
    '& .h6': {
      fontSize: 12,
      lineHeight: '15px',
      letterSpacing: '-0.01px',
      fontWeight: 'bold',
      fontFamily: 'inherit',
      color: '#0F2147'
    }
  }
})
const CanvasSavePopup = ({
  t,
  triggerCustomClass,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [{ canvas, canvasHandlers }] = useCanvasState()
  const [isShowPopup, setShowPopup] = useState(false)

  const handleSubmit = event => {
    const { getCanvasConfig, getFrameLayer } = canvasHandlers
    const { width, height, left, top } = getFrameLayer()

    const transform = canvas.viewportTransform.slice()
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0]
    const preview = canvas.toDataURL({
      format: 'png',
      top,
      left,
      width,
      height
    })
    canvas.viewportTransform = transform

    const parseConfig = JSON.parse(getCanvasConfig())
    const config = {
      ...event,
      canvas: parseConfig,
      preview
    }

    dispatch(addTemplate(config))
    enqueueSnackbar(t('Successfully export'), {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  return (
    <>
      <Popup
        on="click"
        open={isShowPopup}
        onOpen={() => setShowPopup(true)}
        position={'bottom right'}
        trigger={<BlueButton className={triggerCustomClass}>Save</BlueButton>}
        contentStyle={{
          width: '314px',
          borderRadius: '6px'
        }}
      >
        <div className={classes.content}>
          <div className={classes.contentHeader}>
            <Typography className={'h6'} variant="h6">
              Media Information
            </Typography>
          </div>
          <CanvasSaveForm
            onSubmit={handleSubmit}
            onCancel={() => setShowPopup(false)}
          />
        </div>
      </Popup>
    </>
  )
}

export default translate('translations')(withSnackbar(CanvasSavePopup))
