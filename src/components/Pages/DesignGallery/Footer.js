import React from 'react'

import { Grid, withStyles } from '@material-ui/core'

import { compose } from 'redux'
import { translate } from 'react-i18next'

import { BlueButton, WhiteButton } from 'components/Buttons'

import FooterControls from './components/FooterControls'
import { useCanvasState } from './components/canvas/CanvasProvider'

import { FOOTER_HEIGHT } from './constans'

import './styles/_footer.scss'

const styles = ({ palette, type }) => ({
  footer: {
    height: FOOTER_HEIGHT
  },
  buttonWrapper: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 300,
    padding: '0 10px',
    height: 50
  },
  buttonClass: {
    paddingLeft: '10px'
  },
  action: {
    paddingTop: '5',
    paddingBottom: '5'
  },
  actionCancel: {
    borderColor: palette[type].sideModal.action.button.border,
    boxShadow: 'none',
    backgroundImage: palette[type].sideModal.action.button.background,
    color: palette[type].sideModal.action.button.color,

    '&:hover': {
      color: '#fff',
      background: '#006198',
      borderColor: '#006198'
    }
  }
})

const Footer = props => {
  const { t, classes, onSave, onSaveAs, edit = false } = props

  const [{ canvasHandlers }] = useCanvasState()

  const onReset = () => {
    canvasHandlers.resetCanvas()
  }

  return (
    <div className={`${classes.footer} footer`}>
      <FooterControls />
      <Grid
        container
        alignItems={'center'}
        justify={'flex-end'}
        className={classes.buttonWrapper}
      >
        <Grid item xs={4} className={classes.buttonClass}>
          <BlueButton
            // disabled={disabled}
            fullWidth={true}
            className={classes.action}
            onClick={onSave}
          >
            Save
          </BlueButton>
        </Grid>
        {edit && (
          <Grid item xs={4} className={classes.buttonClass}>
            <BlueButton
              // disabled={disabled}
              fullWidth={true}
              className={classes.action}
              onClick={onSaveAs}
            >
              Save As
            </BlueButton>
          </Grid>
        )}
        <Grid item xs={4} className={classes.buttonClass}>
          <WhiteButton
            fullWidth={true}
            className={[
              'hvr-radial-out',
              classes.action,
              classes.actionCancel
            ].join(' ')}
            onClick={onReset}
          >
            {t('Reset')}
          </WhiteButton>
        </Grid>
      </Grid>
    </div>
  )
}

export default compose(translate('translations'), withStyles(styles))(Footer)
