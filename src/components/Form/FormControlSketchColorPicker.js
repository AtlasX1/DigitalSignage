import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import { translate } from 'react-i18next'

import { withStyles, Grid, InputLabel } from '@material-ui/core'

import BootstrapInputBase from './InputBase'
import { RoundedTab, RoundedTabs } from '../Tabs'
import Popup from '../Popup'
import classNames from 'classnames'
import '../../styles/forms/_colorpicker.scss'
import { rgbaToString } from '../Pages/DesignGallery/utils'

const styles = theme => {
  const { formControls } = theme
  return {
    root: {
      position: 'relative'
    },
    margin: {
      marginBottom: theme.spacing.unit * 2
    },
    label: {
      marginBottom: 7,
      ...formControls.mediaApps.colorSelect.label
    },
    inputWrap: {
      position: 'relative'
    },
    bootstrapRoot: {
      width: '100%',
      '& > input': {
        ...formControls.mediaApps.colorSelect.input
      }
    },
    hexColor: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      width: '38px',
      height: 'calc(100% - 4px) !important',
      borderRadius: '2px',
      overflow: 'hidden',
      zIndex: 1,
      '&:before': {
        content: '" "',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        background:
          'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==) left center',
        zIndex: 1
      },
      '&:after': {
        content: '" "',
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        backgroundColor: 'inherit',
        zIndex: 2
      }
    },
    sketchPickerWrap: {
      width: '100%'
    },
    tabsContainer: {
      width: '100%'
    },
    colorPickerBorderWrap: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 45,
      height: '100%',
      borderLeft: '1px solid lightgray',
      '& > .hex-class': {
        width: '93%'
      }
    }
  }
}

const FormControlSketchColorPicker = ({ t, classes, ...props }) => {
  const {
    id,
    label,
    tabs,
    rootClass = '',
    formControlLabelClass = '',
    formControlInputWrapClass = '',
    formControlInputRootClass = '',
    formControlInputClass = '',
    hexColorClass = '',
    pickerWrapClass = '',
    inputProps = {},
    colorPickerProps = {},
    color = '#000',
    handleChange,
    onColorChange = () => {},
    disabled = false,
    position = 'bottom right',
    marginBottom = true,
    inputValue,
    withBorder = false
  } = props

  const [pickerColor, setPickerColor] = useState(color)
  const [currentTab, setCurrentTab] = useState('color')
  const [isColorMixed, setColorMixed] = useState(false)

  useEffect(() => {
    if (handleChange) handleChange(pickerColor)
    //eslint-disable-next-line
  }, [pickerColor])

  useEffect(() => {
    setColorMixed(color === 'mix')
    setPickerColor(color)
  }, [color])

  const onTabChange = (event, tab) => setCurrentTab(tab)
  const handleSketchPicker = val => {
    const color = rgbaToString(val.rgb)
    setPickerColor(color)
    onColorChange(color)
  }

  // In case when passed tabs array
  // Need to find selected tab for correctly display tabInput and tabChildren
  // tabInput cares about input that will replace default input
  // tabChildren cares about node that will replace color picker
  let selectedTab
  if (tabs) selectedTab = tabs.find(tab => tab.value === currentTab)

  return (
    <Grid
      container
      alignItems="center"
      className={[
        classes.root,
        rootClass,
        marginBottom ? classes.margin : ''
      ].join(' ')}
    >
      {label && (
        <InputLabel
          shrink
          className={[classes.label, formControlLabelClass].join(' ')}
        >
          {label}
        </InputLabel>
      )}

      <Popup
        on="click"
        position={position}
        disabled={disabled}
        trigger={
          <div
            className={[classes.inputWrap, formControlInputWrapClass].join(' ')}
          >
            <BootstrapInputBase
              id={id}
              type="text"
              value={
                inputValue || (isColorMixed ? 'mixed' : String(pickerColor))
              }
              placeholder={null}
              classes={{
                root: [classes.bootstrapRoot, formControlInputRootClass].join(
                  ' '
                ),
                input: formControlInputClass
              }}
              disabled={disabled}
              onChange={e => {
                handleChange && handleChange(e.target.value)
              }}
              {...inputProps}
            />

            {!isColorMixed && withBorder ? (
              <div className={classes.colorPickerBorderWrap}>
                <span
                  style={{ backgroundColor: pickerColor }}
                  className={[
                    classes.hexColor,
                    hexColorClass,
                    'hex-class'
                  ].join(' ')}
                />
              </div>
            ) : (
              <span
                style={{ backgroundColor: pickerColor }}
                className={[classes.hexColor, hexColorClass].join(' ')}
              />
            )}
          </div>
        }
        contentStyle={{
          width: 200,
          border: 0,
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 0,
          paddingRight: 0
        }}
        arrowStyle={{
          left: '185px'
        }}
      >
        <div
          className={classNames(classes.sketchPickerWrap, pickerWrapClass, {
            'ColorPicker--with-tabs-SASS': !!tabs
          })}
        >
          {!!tabs && (
            <div className={classes.tabsContainer}>
              <RoundedTabs value={currentTab} onChange={onTabChange}>
                <RoundedTab value="color" label={t('Color')} />
                {tabs.map((tab, index) => (
                  <RoundedTab
                    value={tab.value}
                    label={tab.label}
                    key={`${tab.value}-tab-${index}`}
                  />
                ))}
              </RoundedTabs>
            </div>
          )}
          {currentTab === 'color' ? (
            <SketchPicker
              color={pickerColor}
              onChangeComplete={handleSketchPicker}
              {...colorPickerProps}
            />
          ) : (
            selectedTab.tabChildren
          )}
        </div>
      </Popup>
    </Grid>
  )
}

export default translate('translations')(
  withStyles(styles)(FormControlSketchColorPicker)
)
