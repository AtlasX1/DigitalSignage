import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles, List, Typography } from '@material-ui/core'
import { KeyboardArrowDown } from '@material-ui/icons'
import { get as _get } from 'lodash'

import Popup from '../Popup'
import { WhiteButton } from '../Buttons'
import { DropdownHoverListItem, DropdownHoverListItemText } from '../Dropdowns'

const styles = theme => {
  const { palette, type } = theme
  return {
    value: {
      color: palette[type].formControls.label.color
    }
  }
}

const FormControlCustomSelect = ({
  classes,
  customClasses,
  customOpen,
  customIcon,
  customContentStyle = {},
  onOpen,
  onClose,
  value = null,
  options = [],
  handleChange = f => f,
  placeholder = '',
  inputClassName = '',
  inputIconClassName = '',
  disableRipple = false,
  dropdownPosition = 'bottom center'
}) => {
  const [open, setOpen] = useState(false)
  const isCustomOpen = customOpen !== undefined
  const popupStyles = {
    width: 190,
    height: 300,
    borderRadius: 6,
    animation: 'fade-in 500ms',
    overflowY: 'auto'
  }
  return (
    <Popup
      open={isCustomOpen ? customOpen : open}
      onOpen={() => {
        isCustomOpen ? onOpen() : setOpen(true)
      }}
      onClose={() => {
        isCustomOpen ? onClose() : setOpen(false)
      }}
      position={dropdownPosition}
      trigger={
        <WhiteButton
          className={classNames(_get(classes, 'selectButton'), inputClassName)}
          disableRipple={disableRipple}
        >
          <Typography
            className={classNames(
              _get(classes, 'value'),
              _get(customClasses, 'value')
            )}
          >
            {value ? value.label : placeholder}
          </Typography>
          {customIcon ? (
            customIcon
          ) : (
            <KeyboardArrowDown className={inputIconClassName} />
          )}
        </WhiteButton>
      }
      contentStyle={{ ...popupStyles, ...customContentStyle }}
      arrow={false}
    >
      <List
        component="nav"
        disablePadding={true}
        className={classes.dropdownListWrap}
      >
        {options.map((option, index) => (
          <DropdownHoverListItem
            key={index}
            onClick={() => {
              handleChange(option)
              isCustomOpen && onClose()
            }}
          >
            <DropdownHoverListItemText primary={option.label} />
          </DropdownHoverListItem>
        ))}
      </List>
    </Popup>
  )
}

FormControlCustomSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.any,
  options: PropTypes.array,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  inputClassName: PropTypes.string,
  inputIconClassName: PropTypes.string,
  disableRipple: PropTypes.bool,
  dropdownPosition: PropTypes.string,
  customOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func
}

export default withStyles(styles)(FormControlCustomSelect)
