import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core'

import { FormControlSketchColorPicker, FormControlInput } from 'components/Form'

import { useCanvasState } from '../canvas/CanvasProvider'

const initialShadowState = {
  offsetX: 0,
  offsetY: 0,
  blur: 0,
  color: 'rgba(0,0,0,1)'
}

const styles = theme => {
  return {
    colorPickerRoot: {
      width: '150px !important'
    },
    colorPickerInput: {
      padding: '9px !important',
      height: '28px !important',
      fontSize: '10px !important'
    }
  }
}

const TextShadow = ({ classes, onShadowChange }) => {
  const [{ activeObject = {}, canvasHandlers }] = useCanvasState()
  const { getObjectsStyleValue } = canvasHandlers

  const [isDisabled, setDisabled] = useState(false)
  const [shadow, setShadow] = useState(initialShadowState)
  const { offsetX, offsetY, blur, color } = shadow

  const handleShadowChange = (name, val) => {
    onShadowChange({ ...shadow, [name]: val })
    setShadow(state => ({
      ...state,
      [name]: val
    }))
  }

  useEffect(() => {
    const activeObjectShadow = getObjectsStyleValue('shadow')
    const toDisable = activeObjectShadow === 'mix' || !activeObject
    setDisabled(toDisable)
    if (!toDisable) {
      setShadow(activeObjectShadow || initialShadowState)
    }
    // eslint-disable-next-line
  }, [activeObject])

  return (
    <>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': isDisabled
        })}
      >
        <span>Shadow-X</span>
        <FormControlInput
          custom
          type="number"
          value={offsetX}
          formControlContainerClass={'numeric-input ml-auto'}
          formControlInputClass={'form-control'}
          name={'key'}
          handleChange={val => handleShadowChange('offsetX', val)}
        />
      </div>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': isDisabled
        })}
      >
        <span>Shadow-Y</span>
        <FormControlInput
          custom
          type="number"
          value={offsetY}
          formControlContainerClass={'numeric-input ml-auto'}
          formControlInputClass={'form-control'}
          name={'key'}
          handleChange={val => handleShadowChange('offsetY', val)}
        />
      </div>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': isDisabled
        })}
      >
        <span>Shadow-B</span>
        <FormControlInput
          custom
          type="number"
          value={blur}
          formControlContainerClass={'numeric-input ml-auto'}
          name={'key'}
          handleChange={val => handleShadowChange('blur', val)}
          formControlInputClass={'form-control'}
        />
      </div>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': isDisabled
        })}
      >
        <span>Shadow Color</span>
        <FormControlSketchColorPicker
          position={'top right'}
          rootClass={`${classes.colorPickerRoot} ml-auto`}
          formControlInputRootClass={classes.colorPickerInputRoot}
          formControlInputClass={classes.colorPickerInput}
          hexColorClass={classes.colorPickerHexColor}
          pickerWrapClass={classes.colorPickerWrap}
          color={color}
          withBorder={true}
          onColorChange={val => handleShadowChange('color', val)}
        />
      </div>
    </>
  )
}

export default withStyles(styles)(TextShadow)
