import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core'

import { last as _last, get as _get, isNull as _isNull } from 'lodash'

import {
  FormControlSketchColorPicker,
  FormControlInput,
  SliderInputRange
} from 'components/Form'

import { useCanvasState } from '../canvas/CanvasProvider'
import { rgbaToHex } from '../../utils'

const initialShadowState = {
  offsetX: 0,
  offsetY: 0,
  blur: 0,
  color: '#0378ba',
  transparency: 1
}

const initialOverlayState = {
  color: '#0378ba',
  transparency: 1
}

const styles = theme => {
  return {
    colorPickerRoot: {
      width: '81px !important'
    },
    colorPickerInputWrap: {
      width: '100%'
    },
    colorPickerInput: {
      padding: '5px !important',
      height: '28px !important',
      fontSize: '10px !important'
    },
    rangeContainerClass: {
      display: 'flex',
      alignItems: 'center'
    }
  }
}

const ShadowsOverlays = ({ classes, onShadowChange, onOverlayChange }) => {
  const [{ activeObject = {}, canvasHandlers }] = useCanvasState()
  const { getObjectsStyleValue } = canvasHandlers

  const [isDisabledShadow, setDisabledShadow] = useState(false)
  const [isDisabledOverlay, setDisabledOverlay] = useState(false)
  const [shadow, setShadow] = useState(initialShadowState)
  const [overlay, setOverlay] = useState(initialOverlayState)

  const inputRangeSliderStyles = {
    height: '26px',
    textAlign: 'right',
    fontSize: '13px',
    paddingRight: '3px',
    margin: '0'
  }

  const handleShadowChange = (name, val) => {
    onShadowChange({ ...shadow, [name]: val })
    setShadow(state => ({
      ...state,
      [name]: val
    }))
  }

  const handleOverlayChange = (name, val) => {
    onOverlayChange({ ...overlay, [name]: val })
    setOverlay(state => ({
      ...state,
      [name]: val
    }))
  }

  useEffect(() => {
    const activeObjectShadow = getObjectsStyleValue('shadow')
    const activeObjectOverlay = getObjectsStyleValue('overlay')

    const toDisableShadow =
      _get(activeObject, 'type') === 'activeSelection' ||
      activeObjectShadow === 'mix' ||
      !activeObject ||
      _isNull(activeObject)
    const toDisableOverlay =
      _get(activeObject, 'type') === 'activeSelection' ||
      activeObjectOverlay === 'mix' ||
      !activeObject ||
      _isNull(activeObject)

    setDisabledShadow(toDisableShadow)
    setDisabledOverlay(toDisableOverlay)

    if (!toDisableShadow) {
      setShadow(
        activeObjectShadow
          ? {
              ...activeObjectShadow,
              color: rgbaToHex(activeObjectShadow.color),
              transparency: _last(
                activeObjectShadow.color.replace(')', '').split(',')
              )
            }
          : initialShadowState
      )
    }
    if (!toDisableOverlay) {
      setOverlay(
        activeObjectOverlay ? activeObjectOverlay : initialOverlayState
      )
    }
    // eslint-disable-next-line
  }, [activeObject])

  return (
    <>
      <div
        className={classNames(
          'sidebar-row sidebar-row__border shadow-options',
          {
            'is-disabled': isDisabledShadow
          }
        )}
      >
        <div className="item item-column item__fill item-input-wrap">
          <FormControlInput
            custom
            type="number"
            value={shadow.offsetX}
            formControlContainerClass={'numeric-input'}
            formControlInputClass={'form-control'}
            name={'key'}
            handleChange={val => handleShadowChange('offsetX', val)}
          />
          <div className="item-input-label">
            <span>Shadow-X</span>
          </div>
        </div>
        <div className="item item-column item__fill item-input-wrap">
          <FormControlInput
            custom
            type="number"
            value={shadow.offsetY}
            formControlContainerClass={'numeric-input'}
            formControlInputClass={'form-control'}
            name={'key'}
            handleChange={val => handleShadowChange('offsetY', val)}
          />
          <div className="item-input-label">
            <span>Shadow-Y</span>
          </div>
        </div>
        <div className="item item-column item__fill item-input-wrap">
          <FormControlInput
            custom
            type="number"
            value={shadow.blur}
            formControlContainerClass={'numeric-input'}
            name={'key'}
            handleChange={val => handleShadowChange('blur', val)}
            formControlInputClass={'form-control'}
          />
          <div className="item-input-label">
            <span>Shadow-B</span>
          </div>
        </div>
        <div className="item item-column item__fill item-input-wrap">
          <FormControlSketchColorPicker
            position={'top right'}
            rootClass={`${classes.colorPickerRoot}`}
            formControlInputRootClass={classes.colorPickerInputRoot}
            formControlInputClass={classes.colorPickerInput}
            formControlInputWrapClass={classes.colorPickerInputWrap}
            hexColorClass={classes.colorPickerHexColor}
            pickerWrapClass={classes.colorPickerWrap}
            color={shadow.color}
            withBorder={true}
            marginBottom={false}
            isHex={true}
            onColorChange={val => handleShadowChange('color', val)}
            colorPickerProps={{
              width: 250
            }}
            width={250}
          />
          <div className="item-input-label">
            <span>Shadow Color</span>
          </div>
        </div>
        <div
          className="item item-column item__fill item-input-wrap"
          style={{ flexGrow: 1, marginTop: 10 }}
        >
          <SliderInputRange
            maxValue={1}
            minValue={0}
            step={0.1}
            value={shadow.transparency}
            label={false}
            rootClass={[classes.sliderRoot, classes.sliderRootSmall].join(' ')}
            inputRangeContainerClass={classes.rangeContainerClass}
            inputRangeContainerSASS="CreateTemplateSettings__slider--Wrap CreateTemplateSettings__slider-big"
            inputContainerClass={'numeric-input'}
            numberWraperStyles={inputRangeSliderStyles}
            labelClass={classes.sliderLabel}
            customInput={true}
            precision={2}
            onChange={val => handleShadowChange('transparency', val)}
          />
          <div className="item-input-label">
            <span>Shadow transparency</span>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          'sidebar-row sidebar-row__border shadow-options',
          {
            'is-disabled': isDisabledOverlay
          }
        )}
      >
        {/*<div className="item item-column item__fill item-input-wrap">*/}
        {/*  <FormControlInput*/}
        {/*    custom*/}
        {/*    type="number"*/}
        {/*    value={overlay.offsetX}*/}
        {/*    formControlContainerClass={'numeric-input'}*/}
        {/*    formControlInputClass={'form-control'}*/}
        {/*    name={'key'}*/}
        {/*    handleChange={val => handleOverlayChange('offsetX', val)}*/}
        {/*  />*/}
        {/*  <div className="item-input-label">*/}
        {/*    <span>Overlay-X</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="item item-column item__fill item-input-wrap">*/}
        {/*  <FormControlInput*/}
        {/*    custom*/}
        {/*    type="number"*/}
        {/*    value={overlay.offsetY}*/}
        {/*    formControlContainerClass={'numeric-input'}*/}
        {/*    formControlInputClass={'form-control'}*/}
        {/*    name={'key'}*/}
        {/*    handleChange={val => handleOverlayChange('offsetY', val)}*/}
        {/*  />*/}
        {/*  <div className="item-input-label">*/}
        {/*    <span>Overlay-Y</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="item item-column item__fill item-input-wrap">*/}
        {/*  <FormControlInput*/}
        {/*    custom*/}
        {/*    type="number"*/}
        {/*    value={overlay.blur}*/}
        {/*    formControlContainerClass={'numeric-input'}*/}
        {/*    name={'key'}*/}
        {/*    handleChange={val => handleOverlayChange('blur', val)}*/}
        {/*    formControlInputClass={'form-control'}*/}
        {/*  />*/}
        {/*  <div className="item-input-label">*/}
        {/*    <span>Overlay-B</span>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="item item-column item__fill item-input-wrap">
          <FormControlSketchColorPicker
            position={'top left'}
            rootClass={`${classes.colorPickerRoot}`}
            formControlInputRootClass={classes.colorPickerInputRoot}
            formControlInputClass={classes.colorPickerInput}
            formControlInputWrapClass={classes.colorPickerInputWrap}
            hexColorClass={classes.colorPickerHexColor}
            pickerWrapClass={classes.colorPickerWrap}
            color={overlay.color}
            withBorder={true}
            marginBottom={false}
            isHex={true}
            onColorChange={val => handleOverlayChange('color', val)}
            colorPickerProps={{
              width: 250
            }}
            width={250}
          />
          <div className="item-input-label">
            <span>Overlay Color</span>
          </div>
        </div>
        <div className="item item-column item__fill item-input-wrap">
          <SliderInputRange
            maxValue={1}
            minValue={0}
            step={0.1}
            value={overlay.transparency}
            label={false}
            rootClass={classes.sliderRoot}
            inputRangeContainerClass={classes.rangeContainerClass}
            inputRangeContainerSASS="CreateTemplateSettings__slider--Wrap CreateTemplateSettings__slider--Wrap-overlay"
            inputContainerClass={'numeric-input'}
            numberWraperStyles={inputRangeSliderStyles}
            labelClass={classes.sliderLabel}
            customInput={true}
            precision={2}
            onChange={val => handleOverlayChange('transparency', val)}
          />
          <div className="item-input-label">
            <span>Overlay transparency</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default withStyles(styles)(ShadowsOverlays)
