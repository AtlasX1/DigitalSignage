import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { isBoolean as _isBoolean } from 'lodash'

import {
  FormControlSelect,
  FormControlInput,
  FormControlSketchColorPicker
} from 'components/Form'
import { getSavedFonts } from 'actions/fontsActions'
import TextBoldIcon from '../icons/TextBoldIcon'
import TextItalicIcon from '../icons/TextItalicIcon'
import TextUnderlineIcon from '../icons/TextUnderlineIcon'
import TextThroughIcon from '../icons/TextThroughIcon'
import TextCapsIcon from '../icons/TextCapsIcon'
import { useCanvasState } from '../canvas/CanvasProvider'

const styles = theme => ({
  selectInput: {
    width: '100%',
    minWidth: '125px',
    height: '28px',
    padding: '0 12px',
    lineHeight: '28px',
    color: '#010101',
    fontSize: 12
  },
  selectContainerClass: {
    flex: 2,
    marginRight: '13px'
  },
  formControlInputClass: {
    textAlign: 'right',
    width: '100%',
    height: '28px',
    padding: '0',
    fontSize: '14px !important',
    fontFamily: 'inherit',
    fontWeight: '600',
    color: '#4c5057'
  },
  colorPickerRoot: {
    width: '150px !important'
  },
  colorPickerInput: {
    padding: '9px !important',
    height: '28px !important',
    fontSize: '10px !important'
  }
})

const fontStylesControls = [
  {
    label: 'Bold',
    value: 'bold',
    propName: 'fontWeight',
    icon: <TextBoldIcon />
  },
  {
    label: 'Underline',
    value: 'underline',
    propName: 'underline',
    icon: <TextUnderlineIcon />
  },
  {
    label: 'Italic',
    value: 'italic',
    propName: 'fontStyle',
    icon: <TextItalicIcon />
  },
  {
    label: 'Through',
    value: 'through',
    propName: 'linethrough',
    icon: <TextThroughIcon />
  },
  {
    label: 'All Caps',
    value: 'caps',
    propName: 'fontUppercase',
    icon: <TextCapsIcon />
  }
]

const FontStyle = props => {
  const dispatch = useDispatch()
  const { fontLabels } = useSelector(({ fonts }) => fonts)
  const [selectedFont, setSelectedFont] = useState()
  const [{ canvasHandlers, canvasUtils }] = useCanvasState()
  const {
    getObjectsStyleValue,
    isTextBoxObjects,
    getTextBoxStyleValue
  } = canvasHandlers
  const {
    classes,
    activeObject,
    onTextStyleChange,
    onFontFamilyChange,
    onFontStyleChange
  } = props

  useEffect(() => {
    if (!fontLabels) return

    if (fontLabels.length) {
      setSelectedFont('')
    } else {
      dispatch(getSavedFonts())
    }
    // eslint-disable-next-line
  }, [fontLabels])

  const getActiveClass = (value, propName) => {
    if (!activeObject) return false

    if (activeObject.isType('textbox')) {
      const propValue = getTextBoxStyleValue(activeObject, propName)
      switch (value) {
        case 'bold':
        case 'italic':
          return propValue === value
        case 'underline':
        case 'through':
        case 'caps':
          return _isBoolean(propValue) && !!propValue
        default:
          return false
      }
    }
    if (activeObject.isType('activeSelection')) {
      const { checkTextProp } = canvasUtils
      const { _objects } = activeObject
      const styledObjects = _objects.filter(obj => {
        return obj.isType('textbox') && checkTextProp(obj, value)
      })
      return _objects.length === styledObjects.length
    }
  }

  return useMemo(() => {
    return (
      <>
        <div
          className={classNames('sidebar-row sidebar-row__border', {
            'is-disabled': !isTextBoxObjects()
          })}
        >
          <FormControlSelect
            value={getObjectsStyleValue('fontFamily') || selectedFont}
            marginBottom={false}
            formControlContainerClass={classes.selectContainerClass}
            inputClasses={{ input: classes.selectInput }}
            options={fontLabels}
            handleChange={e => onFontFamilyChange(e.target.value)}
            placeholder={'Select font'}
          />
          <FormControlInput
            custom
            type="number"
            value={getObjectsStyleValue('fontSize') || 0}
            formControlContainerClass={'numeric-input sm-size'}
            formControlInputClass={'form-control'}
            name={'key'}
            handleChange={value => onTextStyleChange('fontSize', value)}
          />
        </div>
        <div
          className={classNames('sidebar-row sidebar-row__border', {
            'is-disabled': !isTextBoxObjects()
          })}
        >
          {fontStylesControls.map(({ value, propName, icon, label }, key) => (
            <div
              key={key}
              onClick={() => onFontStyleChange(propName, value)}
              className={classNames('item item-column item__fill', {
                item__active: getActiveClass(value, propName),
                item__disable: !isTextBoxObjects()
              })}
            >
              <div className={'item-icon'}>{icon}</div>
              <div className={'item-label'}>{label}</div>
            </div>
          ))}
        </div>
        <div
          className={classNames('sidebar-row sidebar-row__border', {
            'is-disabled': !isTextBoxObjects()
          })}
        >
          <span>Color</span>
          <FormControlSketchColorPicker
            rootClass={`${classes.colorPickerRoot} ml-auto`}
            formControlInputRootClass={classes.colorPickerInputRoot}
            formControlInputClass={classes.colorPickerInput}
            hexColorClass={classes.colorPickerHexColor}
            pickerWrapClass={classes.colorPickerWrap}
            color={getObjectsStyleValue('fill') || '#000'}
            withBorder={true}
            onColorChange={value => onTextStyleChange('fill', value)}
          />
        </div>
        <div
          className={classNames('sidebar-row sidebar-row__border', {
            'is-disabled': !isTextBoxObjects()
          })}
        >
          <span>Letter spacing</span>
          <FormControlInput
            custom
            type="number"
            value={getObjectsStyleValue('charSpacing') || 0}
            formControlContainerClass={'numeric-input ml-auto'}
            formControlInputClass={'form-control'}
            name={'key'}
            handleChange={value => onTextStyleChange('charSpacing', value)}
          />
        </div>
      </>
    )
    // eslint-disable-next-line
  }, [props, activeObject, fontLabels, selectedFont])
}

export default withStyles(styles)(FontStyle)
