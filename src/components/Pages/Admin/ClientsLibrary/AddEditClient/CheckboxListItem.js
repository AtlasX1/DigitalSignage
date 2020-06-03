import React from 'react'
import { Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { CheckboxSwitcher } from 'components/Checkboxes'

const styles = ({ palette, type }) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingLabel: {
    color: palette[type].formControls.label.color
  },
  corner: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  }
})

const CheckboxListItem = ({
  label,
  t,
  classes,
  onChange,
  name,
  value,
  id,
  hasCorner = false
}) => {
  return (
    <div
      className={classNames(classes.container, {
        [classes.corner]: hasCorner
      })}
    >
      <Typography className={classes.settingLabel}>{label}</Typography>
      <CheckboxSwitcher
        id={id}
        name={name}
        handleChange={onChange}
        value={value}
      />
    </div>
  )
}

export default translate('translations')(withStyles(styles)(CheckboxListItem))
