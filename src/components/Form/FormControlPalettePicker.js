import React, { useState } from 'react'
import { SketchPicker } from 'react-color'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Popup from '../Popup'
import Tooltip from '@material-ui/core/Tooltip'
import { rgbaToString } from '../Pages/DesignGallery/utils'
import { isEmpty } from 'lodash'

const styles = () => ({
  paletteContainer: {
    display: 'inline-flex',
    flexFlow: 'row nowrap',
    justifyContent: 'center',
    height: '15px',
    marginBottom: '15px',
    paddingLeft: '23px',
    position: 'relative',
    cursor: 'pointer',
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '50%',
      left: '0',
      transform: 'translate(0, -50%)',
      height: '14px',
      width: '14px',
      border: '6px solid #535d73',
      borderRadius: '50%',
      background: '#d3d6dd'
    },
    '&:hover': {
      '&:before': {
        borderColor: '#41cb71'
      }
    }
  },
  activePaletteContainer: {
    '&:before': {
      borderColor: '#41cb71'
    }
  },
  paletteSection: {
    width: '34px'
  }
})

const FormControlPalettePicker = ({
  id,
  preset = {},
  classes,
  colorPickerProps = {},
  selected,
  onColorChange = () => {},
  onSelectPalette = () => {},
  allowChangeColor = false,
  position = 'top right',
  className,
  forceColors
}) => {
  const [colors, setColors] = useState(preset)

  const handleColorChange = (color, key) => {
    const newPreset = { ...colors }
    newPreset.palette[key].value = rgbaToString(color)
    onSelectPalette(newPreset)
    setColors(newPreset)
    if (!isEmpty(forceColors)) {
      onColorChange(color, key)
    } else {
      onSelectPalette(newPreset)
    }
  }

  const handleSelectPalette = () => {
    onSelectPalette(preset)
  }

  const { palette } = preset

  return (
    <Grid
      className={classNames(className, classes.paletteContainer, {
        [classes.activePaletteContainer]: selected.id === id
      })}
      onClick={handleSelectPalette}
    >
      {Object.keys(palette).map(key => (
        <Popup
          on="click"
          position={position}
          disabled={!allowChangeColor}
          key={key}
          trigger={
            <Tooltip
              title={`${palette[key].tooltip}: ${
                !isEmpty(forceColors)
                  ? forceColors.palette[key].value
                  : palette[key].value
              }`}
            >
              <div
                key={palette[key]}
                className={classes.paletteSection}
                style={{
                  backgroundColor: !isEmpty(forceColors)
                    ? forceColors.palette[key].value
                    : palette[key].value
                }}
              />
            </Tooltip>
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
          <div className={classes.sketchPickerWrap}>
            <SketchPicker
              color={
                !isEmpty(forceColors)
                  ? forceColors.palette[key].value
                  : palette[key].value
              }
              onChangeComplete={({ rgb }) => handleColorChange(rgb, key)}
              {...colorPickerProps}
            />
          </div>
        </Popup>
      ))}
    </Grid>
  )
}

export default withStyles(styles)(FormControlPalettePicker)
