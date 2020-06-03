import React from 'react'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'

import { TabToggleButtonGroup, TabToggleButton } from '../../../Buttons'

const TabToggleButtonStyles = makeStyles({
  selected: {
    borderColor: '#0084CE !important',
    backgroundColor: '#0084CE !important',
    fontWeight: 'normal'
  }
})

const TabButtonsGroup = ({ fullWidth, buttons, value, onChange }) => {
  const classes = TabToggleButtonStyles()
  const className = classNames('TabToggleButtonGroup', {
    'full-width': fullWidth
  })
  return (
    <TabToggleButtonGroup
      className={className}
      value={value}
      exclusive={true}
      onChange={onChange}
    >
      {buttons.map(({ text }, key) => (
        <TabToggleButton
          key={key}
          value={text}
          className={'TabToggleButton'}
          classes={{
            selected: classes.selected
          }}
        >
          {text}
        </TabToggleButton>
      ))}
    </TabToggleButtonGroup>
  )
}

export default TabButtonsGroup
