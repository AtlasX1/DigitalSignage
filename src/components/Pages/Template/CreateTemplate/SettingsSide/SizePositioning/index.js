import React from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash'

import { Grid, withStyles, Typography } from '@material-ui/core'

import { FormControlInput } from 'components/Form'
import ExpansionPanel from '../ExpansionPanel'

import {
  setCurrentTemplateItemSize,
  setCurrentTemplateItemPosition,
  setTemplateContainerSize
} from 'actions/createTemplateActions'

import { createTemplateConstants } from '../../../../../../constants'

const styles = theme => {
  const { palette, type } = theme
  return {
    expandedContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '10px'
    },
    item: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      borderBottom: `1px solid ${palette[type].pages.createTemplate.border}`,
      '&:last-child': {
        borderBottom: '0'
      }
    },
    formControlRootClass: {
      height: '28px',
      marginBottom: '0'
    },
    formControlInputClass: {
      textAlign: 'right',
      width: '100%',
      height: '28px',
      padding: '0',
      fontSize: '12px !important',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      border: '1px solid #ced4da !important',
      borderRadius: '3px !important',
      paddingRight: '22px !important'
    },
    inputLabel: {
      fontWeight: '500',
      color:
        palette[type].pages.createTemplate.settings.expansion.body.formControl
          .color,
      fontSize: 12
    }
  }
}

const SizePositioning = ({
  t,
  classes,
  size = {},
  position = {},
  locked,
  isExpanded,
  onExpanded,
  ...props
}) => {
  const fields = [
    {
      label: 'Width',
      value: size.width || 0,
      key: createTemplateConstants.WIDTH
    },
    {
      label: 'Height',
      value: size.height || 0,
      key: createTemplateConstants.HEIGHT
    },
    {
      label: 'X-Axis',
      value: position.x || 0,
      key: createTemplateConstants.X_AXIS
    },
    {
      label: 'Y-Axis',
      value: position.y || 0,
      key: createTemplateConstants.Y_AXIS
    }
  ]

  const handleChange = (e, key) => {
    let value = typeof e === 'number' ? e : +e.target.value

    if (value <= 0) value = 0

    if (
      [createTemplateConstants.WIDTH, createTemplateConstants.HEIGHT].includes(
        key
      )
    ) {
      props.setCurrentTemplateItemSize(key, value)
    } else if (
      [createTemplateConstants.X_AXIS, createTemplateConstants.Y_AXIS].includes(
        key
      )
    ) {
      props.setCurrentTemplateItemPosition(key, value)
    }
  }

  return (
    <ExpansionPanel
      isExpanded={isExpanded}
      onChange={onExpanded}
      expanded={false}
      title={t('Size & Positioning')}
      children={
        <Grid item className={classes.expandedContainer}>
          {fields.map((field, index) => (
            <Grid
              item
              className={classes.item}
              key={`size-positioning-field-${index}`}
            >
              <Typography className={classes.inputLabel}>
                {t(field.label)}
              </Typography>
              <FormControlInput
                type="number"
                value={field.value}
                formControlRootClass={classes.formControlRootClass}
                formControlInputClass={classes.formControlInputClass}
                name={field.key}
                handleChange={handleChange}
                disabled={locked || isEmpty(size) || isEmpty(position)}
                custom
              />
            </Grid>
          ))}
        </Grid>
      }
    />
  )
}

SizePositioning.propTypes = {
  classes: PropTypes.object.isRequired,
  size: PropTypes.object,
  position: PropTypes.object,
  locked: PropTypes.bool
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCurrentTemplateItemSize,
      setCurrentTemplateItemPosition,
      setTemplateContainerSize
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToProps)(SizePositioning))
)
