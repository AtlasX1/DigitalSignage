import React, { useEffect, useState } from 'react'

import { Grid, withStyles, Tooltip } from '@material-ui/core'

import ConfirmModal from '../../modals/ConfirmModal'
import { useCanvasState } from '../../canvas/CanvasProvider'

import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'
import { FormControlSketchColorPicker } from 'components/Form'
import { WhiteButton } from 'components/Buttons'

const StyledTooltip = withStyles({
  tooltip: {
    margin: '3px 0 0 0'
  }
})(Tooltip)

const styles = theme => ({
  colorWrapper: {
    padding: '10px 21px 10px 10px'
  },
  colorPalette: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 10
  },
  colorItem: {
    height: 23,
    width: 'calc(10% - 4px)',
    margin: 2,
    borderRadius: 4,
    cursor: 'pointer',

    '&.selected': {
      border: '1px solid blue'
    }
  },
  tabToggleButtonContainer: {
    justifyContent: 'center'
  },
  colorPickerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
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
  angleButton: {
    margin: 2,
    width: 'calc(33% - 4px)'
  }
})

// Color palette from https://yeun.github.io/open-color/

const colors = [
  '#f8f9fa',
  '#f1f3f5',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#868e96',
  '#495057',
  '#343a40',
  '#212529',
  '#fff5f5',
  '#ffe3e3',
  '#ffc9c9',
  '#ffa8a8',
  '#ff8787',
  '#ff6b6b',
  '#fa5252',
  '#f03e3e',
  '#e03131',
  '#c92a2a',
  '#fff0f6',
  '#ffdeeb',
  '#fcc2d7',
  '#faa2c1',
  '#f783ac',
  '#f06595',
  '#e64980',
  '#d6336c',
  '#c2255c',
  '#a61e4d',
  '#f8f0fc',
  '#f3d9fa',
  '#eebefa',
  '#e599f7',
  '#da77f2',
  '#cc5de8',
  '#be4bdb',
  '#ae3ec9',
  '#9c36b5',
  '#862e9c',
  '#f3f0ff',
  '#e5dbff',
  '#d0bfff',
  '#b197fc',
  '#9775fa',
  '#845ef7',
  '#7950f2',
  '#7048e8',
  '#6741d9',
  '#5f3dc4',
  '#edf2ff',
  '#dbe4ff',
  '#bac8ff',
  '#91a7ff',
  '#748ffc',
  '#5c7cfa',
  '#4c6ef5',
  '#4263eb',
  '#3b5bdb',
  '#364fc7',
  '#e7f5ff',
  '#d0ebff',
  '#a5d8ff',
  '#74c0fc',
  '#4dabf7',
  '#339af0',
  '#228be6',
  '#1c7ed6',
  '#1971c2',
  '#1864ab',
  '#e3fafc',
  '#c5f6fa',
  '#99e9f2',
  '#66d9e8',
  '#3bc9db',
  '#22b8cf',
  '#15aabf',
  '#1098ad',
  '#0c8599',
  '#0b7285',
  '#e6fcf5',
  '#c3fae8',
  '#96f2d7',
  '#63e6be',
  '#38d9a9',
  '#20c997',
  '#12b886',
  '#0ca678',
  '#099268',
  '#087f5b',
  '#ebfbee',
  '#d3f9d8',
  '#b2f2bb',
  '#8ce99a',
  '#69db7c',
  '#51cf66',
  '#40c057',
  '#37b24d',
  '#2f9e44',
  '#2b8a3e',
  '#f4fce3',
  '#e9fac8',
  '#d8f5a2',
  '#c0eb75',
  '#a9e34b',
  '#94d82d',
  '#82c91e',
  '#74b816',
  '#66a80f',
  '#5c940d',
  '#fff9db',
  '#fff3bf',
  '#ffec99',
  '#ffe066',
  '#ffd43b',
  '#fcc419',
  '#fab005',
  '#f59f00',
  '#f08c00',
  '#e67700',
  '#fff4e6',
  '#ffe8cc',
  '#ffd8a8',
  '#ffc078',
  '#ffa94d',
  '#ff922b',
  '#fd7e14',
  '#f76707',
  '#e8590c',
  '#d9480f'
]

const directions = [315, 0, 45, 270, null, 90, 225, 180, 135]

const CanvasColor = ({ classes, onChangeColor, onChangeGradient }) => {
  const [color, setColor] = useState(undefined)
  const [gradient, setGradient] = useState({
    angle: 0,
    color1: '#fff',
    color2: '#fff'
  })
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [tab, setTab] = useState('color')

  const [{ canvasHandlers }] = useCanvasState()

  const handleGradientChange = gradient => {
    if (!canvasHandlers.isEmptyFrame()) {
      setGradient(gradient)
      setConfirmDialogOpen(true)
    } else {
      setGradient(gradient)
      onChangeGradient(gradient)
    }
  }

  const handleColorClick = val => {
    if (val === color) val = '#fff'

    if (!canvasHandlers.isEmptyFrame()) {
      setColor(val)
      setConfirmDialogOpen(true)
    } else {
      setColor(val)
      onChangeColor(val)
    }
  }

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false)
    if (tab === 'color') {
      onChangeColor(color)
    } else onChangeGradient(gradient)
  }

  useEffect(() => {
    if (canvasHandlers) {
      const frame = canvasHandlers.getFrameLayer()

      setColor(frame.get('fill'))
    }
  }, [canvasHandlers])

  return (
    <>
      <Grid container className={classes.colorWrapper}>
        <Grid item xs={12} justify={'center'}>
          <TabToggleButtonGroup
            className={classes.tabToggleButtonContainer}
            value={tab}
            exclusive
            onChange={(e, v) => v && setTab(v)}
          >
            <TabToggleButton
              className={classes.tabToggleButton}
              value={'color'}
            >
              Colors
            </TabToggleButton>
            <TabToggleButton
              className={classes.tabToggleButton}
              value={'gradient'}
            >
              Gradient
            </TabToggleButton>
          </TabToggleButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {tab === 'color' ? (
            <Grid container>
              <Grid item xs={12} className={classes.colorPalette}>
                {colors.map(val => (
                  <StyledTooltip title={val} key={val}>
                    <div
                      className={[
                        classes.colorItem,
                        val === color ? 'selected' : ''
                      ].join(' ')}
                      style={{ background: val }}
                      onClick={() => handleColorClick(val)}
                    />
                  </StyledTooltip>
                ))}
              </Grid>
              <Grid item xs={12}>
                <div
                  className={[
                    'item item-inline item__fill item-input-wrap',
                    classes.colorPickerWrapper
                  ].join(' ')}
                >
                  <div className={'item-input-label'}>
                    <span>Background Color</span>
                  </div>
                  <div>
                    <FormControlSketchColorPicker
                      rootClass={`${classes.colorPickerRoot}`}
                      formControlInputRootClass={classes.colorPickerInputRoot}
                      formControlInputClass={classes.colorPickerInput}
                      formControlInputWrapClass={classes.colorPickerInputWrap}
                      hexColorClass={classes.colorPickerHexColor}
                      pickerWrapClass={classes.colorPickerWrap}
                      color={color || '#ffffff'}
                      withBorder={true}
                      marginBottom={false}
                      isHex={true}
                      position={'top right'}
                      onColorChange={value => handleColorClick(value)}
                      colorPickerProps={{
                        width: 250
                      }}
                      width={250}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          ) : (
            <Grid container>
              <Grid
                item
                xs={12}
                justify={'space-between'}
                style={{
                  padding: '10px 20px 0',
                  display: 'flex',
                  flexWrap: 'wrap'
                }}
              >
                {directions.map(angle => {
                  if (angle === null) {
                    return <div className={classes.angleButton} />
                  } else {
                    return (
                      <WhiteButton
                        className={classes.angleButton}
                        key={angle + '_a'}
                        onClick={() =>
                          handleGradientChange({
                            ...gradient,
                            angle: angle - 90
                          })
                        }
                      >
                        <i
                          className="fa fa-arrow-up"
                          style={{ transform: `rotate(${angle}deg)` }}
                        />
                      </WhiteButton>
                    )
                  }
                })}
              </Grid>
              <Grid item xs={12}>
                <div
                  className={[
                    'item item-inline item__fill item-input-wrap',
                    classes.colorPickerWrapper
                  ].join(' ')}
                >
                  <div className={'item-input-label'}>
                    <span>Color 1</span>
                  </div>
                  <div>
                    <FormControlSketchColorPicker
                      rootClass={`${classes.colorPickerRoot}`}
                      formControlInputRootClass={classes.colorPickerInputRoot}
                      formControlInputClass={classes.colorPickerInput}
                      formControlInputWrapClass={classes.colorPickerInputWrap}
                      hexColorClass={classes.colorPickerHexColor}
                      pickerWrapClass={classes.colorPickerWrap}
                      color={color || '#ffffff'}
                      withBorder={true}
                      marginBottom={false}
                      isHex={true}
                      position={'top right'}
                      onColorChange={value =>
                        handleGradientChange({ ...gradient, color1: value })
                      }
                      colorPickerProps={{
                        width: 250
                      }}
                      width={250}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div
                  className={[
                    'item item-inline item__fill item-input-wrap',
                    classes.colorPickerWrapper
                  ].join(' ')}
                >
                  <div className={'item-input-label'}>
                    <span>Color 2</span>
                  </div>
                  <div>
                    <FormControlSketchColorPicker
                      rootClass={`${classes.colorPickerRoot}`}
                      formControlInputRootClass={classes.colorPickerInputRoot}
                      formControlInputClass={classes.colorPickerInput}
                      formControlInputWrapClass={classes.colorPickerInputWrap}
                      hexColorClass={classes.colorPickerHexColor}
                      pickerWrapClass={classes.colorPickerWrap}
                      color={gradient.color2 || '#ffffff'}
                      withBorder={true}
                      marginBottom={false}
                      isHex={true}
                      position={'top right'}
                      onColorChange={value =>
                        handleGradientChange({ ...gradient, color2: value })
                      }
                      colorPickerProps={{
                        width: 250
                      }}
                      width={250}
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>

      <ConfirmModal
        isShow={isConfirmDialogOpen}
        title={'Apply a template to your design'}
        contentText={
          'By applying a template you will lose your existing design. To restore, click Undo button.'
        }
        onApply={handleCloseDialog}
        onCancel={() => setConfirmDialogOpen(false)}
        onClose={() => setConfirmDialogOpen(false)}
      />
    </>
  )
}
export default withStyles(styles)(CanvasColor)
