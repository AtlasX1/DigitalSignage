import React from 'react'
import InputRange from 'react-input-range'
import classNames from 'classnames'
import { withStyles, Grid, Typography } from '@material-ui/core'
import 'react-input-range/lib/bundle/react-input-range.css'
import 'styles/forms/_slider-input-range.scss'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import Tooltip from 'components/Tooltip'

const styles = ({ palette, type, formControls }) => ({
  label: {
    color: palette[type].formControls.label.color,
    ...formControls.mediaApps.refreshEverySlider.label
  },
  mainLabel: {
    lineHeight: 1,
    marginBottom: 7,
    marginLeft: -2
  },
  labelRightContainer: {
    // add 2px insted of border width
    width: formControls.mediaApps.refreshEverySlider.input.width + 2,
    textAlign: 'center'
  },
  labelLeftContainer: {
    margin: '0 auto',
    textAlign: 'center'
  }
})

const FormControlSpeedInput = ({ t, classes, ...props }) => {
  const {
    maxValue = 20,
    minValue = 1,
    step = 1,
    label = `${t('Speed')}:`,
    labelLeft = t('Slow'),
    labelRight = t('Fast'),
    tooltipLeft = '',
    tooltipRight = '',
    rootClass = '',
    inputRangeContainerClass = '',
    inputRangeContainerSASS = '',
    labelLeftContainerClass,
    labelRightContainerClass,
    labelClass = '',
    labelRightClass = '',
    labelLeftClass = '',
    tooltip = '',
    formatLabel = () => '',
    value = 0,
    disabled = false,
    onChange = () => {},
    inputContainerProps
  } = props

  return (
    <Grid container className={rootClass}>
      <Grid container>
        <Typography
          className={classNames(classes.label, classes.mainLabel, labelClass)}
        >
          {label}
        </Typography>
      </Grid>
      <Grid
        container
        item
        wrap="nowrap"
        justify="space-between"
        {...inputContainerProps}
      >
        <Grid
          item
          className={classNames(
            classes.labelLeftContainer,
            labelLeftContainerClass
          )}
        >
          {tooltip ? (
            <Tooltip title={tooltipLeft} placement="top">
              <Typography className={classNames(classes.label, labelLeftClass)}>
                {labelLeft}
              </Typography>
            </Tooltip>
          ) : (
            <Typography className={classNames(classes.label, labelLeftClass)}>
              {labelLeft}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          className={classNames(
            inputRangeContainerClass,
            inputRangeContainerSASS
          )}
        >
          <InputRange
            formatLabel={formatLabel}
            maxValue={maxValue}
            minValue={minValue}
            value={value}
            step={step}
            onChange={onChange}
            onChangeComplete={onChange}
            disabled={disabled}
          />
        </Grid>
        <Grid
          item
          className={classNames(
            classes.labelRightContainer,
            labelRightContainerClass
          )}
        >
          {tooltip ? (
            <Tooltip title={tooltipRight} placement="top">
              <Typography
                className={classNames(classes.label, labelRightClass)}
              >
                {labelRight}
              </Typography>
            </Tooltip>
          ) : (
            <Typography className={classNames(classes.label, labelRightClass)}>
              {labelRight}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(FormControlSpeedInput)
