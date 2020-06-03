import React from 'react'
import WebFont from 'webfontloader'

import { compose } from 'redux'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'

import ExpansionPanel from '../Template/CreateTemplate/SettingsSide/ExpansionPanel'
import AlignmentsRotations from './components/rightSidebar/AlignmentsRotations'
import FontStyle from './components/rightSidebar/FontStyle'
import TextAlign from './components/rightSidebar/TextAlign'
import BulletsSpacing from './components/rightSidebar/BulletsSpacing'
import TextShadow from './components/rightSidebar/TextShadow'
import { useCanvasState } from './components/canvas/CanvasProvider'

import { Scrollbars } from 'components/Scrollbars'
import { BlueButton, WhiteButton } from 'components/Buttons'

import './styles/_rightSidebar.scss'

const styles = theme => {
  const { palette, type } = theme

  return {
    rootClass: {
      border: 'none'
    },
    summaryClass: {
      height: '30px',
      paddingLeft: '22px',
      backgroundImage: 'linear-gradient(270deg, #F5F6FA 0%, #E3E9F4 100%)',
      borderBottom: 'none',
      minHeight: 'auto !important'
    },
    summaryIconClass: {
      right: '6px',
      color: '#4C5057',
      '& svg': {
        color: 'inherit',
        fontSize: '20px'
      }
    },
    labelClass: {
      fontSize: 'inherit',
      lineHeight: 'inherit',
      letterSpacing: 'inherit',
      font: 'inherit',
      color: '#808B9C'
    },
    colorPickerRoot: {
      width: '102px',
      height: '28px',
      marginBottom: '0'
    },
    colorPickerInputRoot: {
      height: '28px'
    },
    colorPickerInput: {
      height: '28px',
      fontSize: '12px'
    },
    colorPickerHexColor: {
      width: '28px',
      height: '24px'
    },
    colorPickerWrap: {
      zIndex: '1',
      right: '0',
      left: 'auto'
    },
    buttonWrapper: {
      height: 50,
      padding: '0 10px'
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
    },
    settings: {
      flexGrow: 1
    }
  }
}

const RightSidebar = props => {
  const { t, classes, onSave, onSaveAs, onReset, edit } = props
  const [{ canvasHandlers, activeObject }] = useCanvasState()

  const handleFontFamilyChange = val => {
    WebFont.load({
      google: {
        families: [val]
      },
      active: () => {
        canvasHandlers.setTextBoxProps({ fontFamily: val })
      }
    })
  }

  const handleAlignmentChange = (val, gap) => {
    canvasHandlers.setObjectAlign(val, gap)
  }

  const handleTextStyleChange = (propName, value) => {
    canvasHandlers.setTextBoxStyle(propName, value)
  }

  const handleRotateChange = (direction, deg) => {
    canvasHandlers.setObjectRotate(direction, deg)
  }

  const handleTextBoxChange = (propName, value) => {
    canvasHandlers.setTextBoxProps({ [propName]: value })
  }

  const handleShadowChange = shadow => {
    canvasHandlers.setObjectsShadow(shadow)
  }

  const handleListChange = value => {
    canvasHandlers.setListStyle(value)
  }

  const ExpansionPanels = [
    {
      label: 'Alignments & Rotations',
      component: (
        <AlignmentsRotations
          activeObject={activeObject}
          onRotateChange={handleRotateChange}
          onAlignmentChange={handleAlignmentChange}
        />
      )
    },
    {
      label: 'Font Style',
      component: (
        <FontStyle
          activeObject={activeObject}
          onTextStyleChange={handleTextBoxChange}
          onFontStyleChange={handleTextStyleChange}
          onFontFamilyChange={handleFontFamilyChange}
        />
      )
    },
    {
      label: 'Text Alignment',
      component: (
        <TextAlign
          activeObject={activeObject}
          onTextStyleChange={handleTextBoxChange}
        />
      )
    },
    {
      label: 'Bullets & Spacing',
      component: (
        <BulletsSpacing
          activeObject={activeObject}
          onListChange={handleListChange}
        />
      )
    },
    {
      label: 'Text Shadow',
      component: <TextShadow onShadowChange={handleShadowChange} />
    }
  ]

  return (
    <div className={'right-sidebar scroll-container'}>
      <div className={classes.settings}>
        <Scrollbars>
          {ExpansionPanels.map((panel, key) => (
            <ExpansionPanel
              key={key}
              expanded={true}
              title={panel.label}
              children={panel.component}
              rootClass={classes.rootClass}
              summaryClass={classes.summaryClass}
              summaryIconClass={classes.summaryIconClass}
              formControlLabelClass={classes.labelClass}
            />
          ))}
        </Scrollbars>
      </div>
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
export default compose(
  translate('translations'),
  withStyles(styles)
)(RightSidebar)
