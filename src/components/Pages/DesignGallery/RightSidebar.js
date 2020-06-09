import React, { useEffect, useState } from 'react'
import WebFont from 'webfontloader'

import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { isNull as _isNull } from 'lodash'

import ExpansionPanel from '../Template/CreateTemplate/SettingsSide/ExpansionPanel'
import AlignmentsRotations from './components/rightSidebar/AlignmentsRotations'
import FontStyle from './components/rightSidebar/FontStyle'
import TextAlign from './components/rightSidebar/TextAlign'
import BulletsSpacing from './components/rightSidebar/BulletsSpacing'
import ShadowsOverlays from './components/rightSidebar/ShadowsOverlays'
import CanvasResolutions from './components/rightSidebar/settingsTabs/CanvasResolutions'
import CanvasColor from './components/rightSidebar/settingsTabs/CanvasColors'
import CanvasBgImages from './components/rightSidebar/settingsTabs/CanvasBgImages'
import CanvasBgPattern from './components/rightSidebar/settingsTabs/CanvasBgPattern'
import { useCanvasState } from './components/canvas/CanvasProvider'

import { Scrollbars } from 'components/Scrollbars'

import {
  setOpenLeftSidebar,
  setOpenRightSidebar
} from 'actions/designGalleryActions'

import './styles/_rightSidebar.scss'

const styles = theme => {
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
    settings: {
      flexGrow: 1
    }
  }
}

const RightSidebar = props => {
  const { classes } = props

  const dispatch = useDispatch()
  const [isOpenRightSidebar] = useSelector(state => [
    state.editor.designGallery.isOpenRightSidebar
  ])

  const [{ canvasHandlers, activeObject }] = useCanvasState()
  const [isCanvasSettings, setCanvasSettings] = useState(true)

  const toggleSidebar = () => {
    dispatch(setOpenRightSidebar(!isOpenRightSidebar))
    dispatch(setOpenLeftSidebar(false))
  }

  const handleFontFamilyChange = val => {
    val &&
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

  const handleOverlayChange = overlay => {
    canvasHandlers.setObjectsOverlay(overlay)
  }

  const handleListChange = value => {
    canvasHandlers.setListStyle(value)
  }

  const handleResolutionChange = value => {
    canvasHandlers.setFrameSize(value)
  }

  const handleCanvasColorChange = value => {
    canvasHandlers.setFrameColor(value)
  }

  const handleCanvasGradientChange = value => {
    canvasHandlers.setFrameGradient(value)
  }

  const handleChangeBackground = value => {
    const { id, src, type, selected } = value
    if (selected) {
      canvasHandlers.removeBackground()
    } else {
      const url = src.original ? src.original : src.small
      canvasHandlers.setBackground({ id, url, type })
    }
  }

  useEffect(
    () => {
      if (activeObject && !_isNull(activeObject)) {
        setCanvasSettings(false)
        dispatch(setOpenRightSidebar(true))
        dispatch(setOpenLeftSidebar(false))
      } else {
        setCanvasSettings(true)
        dispatch(setOpenRightSidebar(false))
        dispatch(setOpenLeftSidebar(false))
      }
    },
    // eslint-disable-next-line
    [activeObject]
  )

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
          onTextStyleChange={handleTextBoxChange}
        />
      )
    },
    {
      label: 'Shadows & Overlays',
      component: (
        <ShadowsOverlays
          onShadowChange={handleShadowChange}
          onOverlayChange={handleOverlayChange}
        />
      )
    }
  ]

  const CanvasSettingsPanels = [
    {
      label: 'Canvas Settings',
      component: (
        <CanvasResolutions onChangeResolution={handleResolutionChange} />
      )
    },
    {
      label: 'Color',
      component: (
        <CanvasColor
          onChangeColor={handleCanvasColorChange}
          onChangeGradient={handleCanvasGradientChange}
        />
      )
    },
    {
      label: 'Images',
      component: <CanvasBgImages onChangeBackground={handleChangeBackground} />
    },
    {
      label: 'Patterns',
      component: <CanvasBgPattern onChangeBackground={handleChangeBackground} />
    }
  ]

  return (
    <div
      className={['right-sidebar', isOpenRightSidebar ? '' : 'closed'].join(
        ' '
      )}
    >
      <div className="toggle-button" onClick={toggleSidebar}>
        {isOpenRightSidebar ? (
          <i className="fa fa-chevron-right" />
        ) : (
          <i className="fa fa-chevron-left" />
        )}
      </div>
      <div className={classes.settings}>
        <Scrollbars>
          {isCanvasSettings
            ? CanvasSettingsPanels.map((panel, key) => (
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
              ))
            : ExpansionPanels.map((panel, key) => (
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
    </div>
  )
}
export default compose(
  translate('translations'),
  withStyles(styles)
)(RightSidebar)
