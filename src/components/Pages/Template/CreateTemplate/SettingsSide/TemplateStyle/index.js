import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { has } from 'lodash'

import { Grid, withStyles, Typography } from '@material-ui/core'
import { Info } from '@material-ui/icons'

import Popup from 'components/Popup'
import {
  SliderInputRange,
  FormControlInput,
  FormControlSketchColorPicker
} from 'components/Form'
import { CheckboxSwitcher } from 'components/Checkboxes'

import ExpansionPanel from '../ExpansionPanel'
import ZoomToFit from './ZoomToFit'

import { updateCurrentTemplateItem } from 'actions/createTemplateActions'

import { shadeColor } from 'utils'

import { createTemplateConstants } from '../../../../../../constants'

const styles = theme => {
  const { palette, type } = theme
  return {
    expansionPanelRoot: {
      borderBottom: 'none'
    },
    expandedContainer: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      paddingBottom: '10px'
    },
    itemContainer: {
      width: '100%',
      height: '45px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 10px 0 19px'
    },
    label: {
      fontSize: 12,
      marginRight: '10px',
      whiteSpace: 'nowrap',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color
    },
    fieldsContainer: {
      display: 'flex'
    },
    sliderRoot: {
      display: 'flex',
      justifyContent: 'space-between',
      height: '28px',
      paddingLeft: '8px',
      alignItems: 'center'
    },
    sliderInputContainer: {
      transform: 'translateX(-18px)',
      maxWidth: '50px',
      height: '28px'
    },
    sliderInputRoot: {
      width: '100%',
      height: '100%',
      margin: '0'
    },
    sliderInput: {
      width: '100%',
      height: '28px !important',
      padding: '0',
      textAlign: 'right',
      fontSize: '12px !important',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      background: palette[type].formControls.input.background,
      paddingRight: '22px !important'
    },
    sliderInputRangeContainer: {
      width: 'calc(100% - 75px)',
      '& > div': {
        width: '100% !important'
      }
    },
    sliderLabel: {
      width: '20px',
      height: '21px',
      lineHeight: '21px',
      fontStyle: 'normal'
    },
    formControlRootClass: {
      width: '48px',
      height: '28px',
      marginBottom: '0',
      marginRight: '10px',
      transform: 'translateX(-20px)'
    },
    formControlInputClass: {
      textAlign: 'right',
      width: '100%',
      height: '28px',
      padding: '0',
      fontSize: '12px !important',
      color: '#4c5057',
      paddingRight: '22px !important'
    },
    colorPickerRoot: {
      width: '112px',
      height: '28px',
      marginBottom: '0',
      transform: 'translateX(-8px)',
      zIndex: 1
    },
    colorPickerInputRoot: {
      height: '28px',
      '&:after': {
        content: '""',
        height: '100%',
        width: '1px',
        background: '#ced4da',
        right: '41px',
        position: 'absolute'
      }
    },
    colorPickerInput: {
      paddingLeft: '5px !important',
      height: '28px !important',
      fontSize: '12px !important'
    },
    colorPickerWrap: {
      zIndex: '1',
      right: '0',
      left: 'auto'
    },
    switcherContainer: {
      width: '100%'
    },
    switcherRoot: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between'
    },
    switcherLabel: {
      fontSize: 12,
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color
    },
    switchRoot: {
      transform: 'translateX(20px)'
    },
    iconContainer: {
      height: '20px'
    },
    infoIcon: {
      color: '#0983c7',
      width: '20px',
      height: '20px',
      marginLeft: '5px'
    }
  }
}

const TemplateStyle = ({
  t,
  classes,
  styles = {},
  locked,
  theme,
  isExpanded,
  onExpanded,
  ...props
}) => {
  const inputRangeSliderStyles = useMemo(
    () => ({
      width: '100%',
      height: '28px',
      textAlign: 'right',
      fontSize: '12px',
      paddingRight: '3px',
      color:
        theme &&
        theme.palette[theme.type].pages.createTemplate.settings.expansion.body
          .formControl.color,
      background:
        theme && theme.palette[theme.type].formControls.input.background
    }),
    [theme]
  )

  const radiusControls = [
    { label: 'TL Radius', key: createTemplateConstants.TL_RADIUS },
    { label: 'TR Radius', key: createTemplateConstants.TR_RADIUS },
    { label: 'BL Radius', key: createTemplateConstants.BL_RADIUS },
    { label: 'BR Radius', key: createTemplateConstants.BR_RADIUS }
  ]

  const handleRadiusChange = (value, key) => {
    if (styles[key] !== value)
      props.updateCurrentTemplateItem(createTemplateConstants.STYLES, {
        [key]: value
      })
  }

  const handleBorderWidthChange = e => {
    let value = typeof e === 'number' ? e : +e.target.value
    if (value < 0) value = 0
    props.updateCurrentTemplateItem(createTemplateConstants.STYLES, {
      borderWidth: value
    })
  }

  const handleBorderColorChange = color => {
    props.updateCurrentTemplateItem(createTemplateConstants.STYLES, {
      borderColor: color
    })
  }

  const handleChangeTouchZone = value => {
    props.updateCurrentTemplateItem(createTemplateConstants.STYLES, {
      isTouchZone: value
    })
  }

  return (
    <ExpansionPanel
      isExpanded={isExpanded}
      onChange={onExpanded}
      expanded={false}
      title={t('Template Style')}
      rootClass={classes.expansionPanelRoot}
      children={
        <Grid item className={classes.expandedContainer}>
          {radiusControls.map((control, index) => (
            <Grid
              item
              className={classes.itemContainer}
              key={`create-template-radius-${index}`}
            >
              <Typography className={classes.label}>
                {t(control.label)}
              </Typography>
              <SliderInputRange
                id={`create-template-radius-${index}`}
                maxValue={100}
                minValue={0}
                step={1}
                value={styles[control.key]}
                label={false}
                rootClass={classes.sliderRoot}
                inputRangeContainerClass={classes.sliderInputRangeContainer}
                inputRangeContainerSASS="CreateTemplateSettings__slider--Wrap"
                inputContainerClass={classes.sliderInputContainer}
                inputRootClass={classes.sliderInputRoot}
                numberWraperStyles={inputRangeSliderStyles}
                labelClass={classes.sliderLabel}
                name={control.key}
                onChange={value => handleRadiusChange(value, control.key)}
                disabled={locked || !has(styles, control.key)}
                customInput
              />
            </Grid>
          ))}
          <Grid item className={classes.itemContainer}>
            <Typography className={classes.label}>Border</Typography>
            <div className={classes.fieldsContainer}>
              <FormControlInput
                type="number"
                formControlRootClass={classes.formControlRootClass}
                formControlInputClass={classes.formControlInputClass}
                value={styles.borderWidth || 0}
                handleChange={handleBorderWidthChange}
                disabled={locked || !has(styles, 'borderWidth')}
                custom
              />
              <FormControlSketchColorPicker
                rootClass={classes.colorPickerRoot}
                formControlInputRootClass={classes.colorPickerInputRoot}
                formControlInputClass={classes.colorPickerInput}
                pickerWrapClass={classes.colorPickerWrap}
                color={styles.borderColor}
                inputValue={shadeColor(styles.borderColor, 0, true)}
                handleChange={handleBorderColorChange}
                disabled={locked || !has(styles, 'borderColor')}
              />
            </div>
          </Grid>
          <Grid item className={classes.itemContainer}>
            <CheckboxSwitcher
              label={t('Convert to touch zone')}
              switchContainerClass={classes.switcherContainer}
              formControlRootClass={classes.switcherRoot}
              formControlLabelClass={classes.switcherLabel}
              switchRootClass={classes.switchRoot}
              handleChange={handleChangeTouchZone}
              value={styles.isTouchZone}
              disabled={locked || !has(styles, 'isTouchZone')}
            />
          </Grid>
          <Grid item className={classes.itemContainer}>
            <CheckboxSwitcher
              label={
                <>
                  {t('Zoom Content to Fit Zone')}
                  <Popup
                    trigger={<Info className={classes.infoIcon} />}
                    position="top right"
                    contentStyle={{
                      width: '565px',
                      height: '347px',
                      padding: '27px',
                      transform: 'translateX(153px)',
                      animation: 'fade-in 500ms'
                    }}
                    arrowStyle={{
                      left: '400px'
                    }}
                  >
                    <ZoomToFit />
                  </Popup>
                </>
              }
              switchContainerClass={classes.switcherContainer}
              formControlRootClass={classes.switcherRoot}
              formControlLabelClass={classes.switcherLabel}
              switchRootClass={classes.switchRoot}
              disabled={locked || !has(styles, 'borderColor')}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

TemplateStyle.propTypes = {
  classes: PropTypes.object.isRequired,
  styles: PropTypes.object,
  locked: PropTypes.bool
}

const mapDispatchToValues = dispatch =>
  bindActionCreators({ updateCurrentTemplateItem }, dispatch)

export default translate('translations')(
  withStyles(styles, { withTheme: true })(
    connect(null, mapDispatchToValues)(TemplateStyle)
  )
)
