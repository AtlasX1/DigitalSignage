import React, { useState, useEffect } from 'react'

import classNames from 'classnames'

import { useDispatch, useSelector } from 'react-redux'

import { isBoolean as _isBoolean } from 'lodash'

import { withStyles } from '@material-ui/core'

import update from 'immutability-helper'

import {
  FormControlInput,
  FormControlSketchColorPicker,
  FormControlAutocompleteSync
} from 'components/Form'

import TextBoldIcon from '../icons/TextBoldIcon'
import TextItalicIcon from '../icons/TextItalicIcon'
import TextUnderlineIcon from '../icons/TextUnderlineIcon'
import TextThroughIcon from '../icons/TextThroughIcon'
import TextCapsIcon from '../icons/TextCapsIcon'
import { useCanvasState } from '../canvas/CanvasProvider'

import { getSavedFonts, mergeWebFontConfig } from 'actions/fontsActions'

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
    width: '90px !important'
  },
  colorPickerInputWrap: {
    width: '100%'
  },
  colorPickerInput: {
    padding: '9px !important',
    height: '28px !important',
    fontSize: '10px !important'
  },
  formControlAutocompleteClass: {
    flexGrow: 1,
    marginRight: 10
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

  const [fontPage, setFontPage] = useState(1)
  const [fontList, setFontList] = useState([])
  const [searchVal, setSearchVal] = useState('')

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
      setFontList(
        fontLabels
          .map(f => ({
            label: <span style={{ fontFamily: f }}>{f}</span>,
            value: f
          }))
          .slice(0, 20)
      )
    } else {
      dispatch(getSavedFonts())
    }
    // eslint-disable-next-line
  }, [fontLabels])

  useEffect(
    () => {
      if (fontPage > 1) {
        const updatedValues = fontLabels
          .map(f => ({
            label: <span style={{ fontFamily: f }}>{f}</span>,
            value: f
          }))
          .slice(fontList.length - 1, fontPage * 20)

        !!searchVal && updatedValues.filter(i => i.value.includes(searchVal))

        setFontList(
          update(fontList, {
            $push: [...updatedValues]
          })
        )
      }
    },
    // eslint-disable-next-line
    [fontPage]
  )

  useEffect(
    () => {
      dispatch(mergeWebFontConfig(fontList.map(i => i.value)))
    },
    // eslint-disable-next-line
    [fontList]
  )

  useEffect(
    () => {
      if (searchVal) {
        setFontPage(1)

        setFontList(
          update(fontList, {
            $set: fontLabels
              .map(f => ({
                label: <span style={{ fontFamily: f }}>{f}</span>,
                value: f
              }))
              .filter(i => i.value.includes(searchVal))
              .slice(0, 20)
          })
        )
      }
    },
    // eslint-disable-next-line
    [searchVal]
  )

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

  const changeFontFamily = val => {
    onFontFamilyChange(val)

    setFontPage(1)

    setFontList(
      update(fontList, {
        $set: fontLabels
          .map(f => ({
            label: <span style={{ fontFamily: f }}>{f}</span>,
            value: f
          }))
          .slice(0, 20)
      })
    )
  }

  return (
    <>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': !isTextBoxObjects()
        })}
      >
        <FormControlAutocompleteSync
          marginBottom={0}
          formControlContainerClass={classes.formControlAutocompleteClass}
          label={null}
          value={getObjectsStyleValue('fontFamily') || selectedFont}
          handleChange={e => changeFontFamily(e.target.value)}
          options={fontList}
          isClearable
          handleInputChange={val => setSearchVal(val)}
          handleMenuScrollToBottom={() => setFontPage(fontPage + 1)}
        />
        <FormControlInput
          custom
          type="number"
          value={getObjectsStyleValue('fontSize') || 0}
          formControlContainerClass={'numeric-input'}
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
        <div className={'item item-column item__fill item-input-wrap'}>
          <div>
            <FormControlSketchColorPicker
              rootClass={`${classes.colorPickerRoot}`}
              formControlInputRootClass={classes.colorPickerInputRoot}
              formControlInputClass={classes.colorPickerInput}
              formControlInputWrapClass={classes.colorPickerInputWrap}
              hexColorClass={classes.colorPickerHexColor}
              pickerWrapClass={classes.colorPickerWrap}
              color={getObjectsStyleValue('fill') || '#0378ba'}
              withBorder={true}
              marginBottom={false}
              isHex={true}
              position={'bottom left'}
              onColorChange={value => onTextStyleChange('fill', value)}
              colorPickerProps={{
                width: 250
              }}
              width={250}
            />
          </div>
          <div className={'item-input-label'}>
            <span>Color</span>
          </div>
        </div>
        <div className="item item-column item__fill item-input-wrap">
          <FormControlInput
            custom
            type="number"
            value={getObjectsStyleValue('charSpacing') || 0}
            formControlContainerClass={'numeric-input'}
            formControlInputClass={'form-control'}
            name={'key'}
            handleChange={value => onTextStyleChange('charSpacing', value)}
          />
          <div className="item-input-label">
            <span>Padding</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default withStyles(styles)(FontStyle)
