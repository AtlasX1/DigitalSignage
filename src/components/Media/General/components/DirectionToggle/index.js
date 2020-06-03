import React, { useCallback } from 'react'
import {
  DirectionToggleButton,
  DirectionToggleButtonGroup
} from 'components/Buttons'
import TabIcon from './TabIcon'
import classNames from 'classnames'
import { InputLabel, withStyles } from '@material-ui/core'

const styles = ({ type, palette }) => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontSize: '17px',
    color: palette[type].formControls.label.color
  },
  rightLabel: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  topLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  leftLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  topLabelMargin: {
    marginBottom: '7px'
  }
})

const DirectionToggle = ({
  value = 'left',
  onChange = f => f,
  label = '',
  classes,
  name,
  labelClass,
  rootClass,
  labelPosition = 'left'
}) => {
  const handleChange = useCallback(
    (event, value) => value && onChange({ target: { value, name } }),
    [name, onChange]
  )

  return (
    <div
      className={classNames(classes.root, rootClass, {
        [classes.leftLabel]: labelPosition === 'left',
        [classes.topLabel]: labelPosition === 'top',
        [classes.rightLabel]: labelPosition === 'right'
      })}
    >
      {label && (
        <InputLabel
          shrink
          className={classNames(classes.bootstrapFormLabel, labelClass, {
            [classes.topLabelMargin]: labelPosition === 'top'
          })}
          classes={{
            focused: classes.bootstrapFormLabelFocus,
            root: classes.label
          }}
        >
          {label}
        </InputLabel>
      )}
      <DirectionToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
      >
        <DirectionToggleButton value="left">
          <TabIcon iconClassName="icon-arrow-left-1" />
        </DirectionToggleButton>
        <DirectionToggleButton value="right">
          <TabIcon iconClassName="icon-arrow-right-1" />
        </DirectionToggleButton>
        <DirectionToggleButton value="up">
          <TabIcon iconClassName="icon-arrow-up" />
        </DirectionToggleButton>
        <DirectionToggleButton value="down">
          <TabIcon iconClassName="icon-arrow-down" />
        </DirectionToggleButton>
      </DirectionToggleButtonGroup>
    </div>
  )
}

export default withStyles(styles)(DirectionToggle)
