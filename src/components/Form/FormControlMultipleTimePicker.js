import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid, Typography, List } from '@material-ui/core'

import Popup from '../Popup'
import { DropdownHoverListItem, DropdownHoverListItemText } from '../Dropdowns'

import { secToLabel } from '../../utils/secToLabel'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      background:
        palette[type].formControls.multipleTimePicker.input.background,
      border: `1px solid ${palette[type].formControls.multipleTimePicker.input.border}`,
      borderRadius: 3,
      height: 28,
      width: '100%',
      overflow: 'hidden'
    },
    divider: {
      width: 30,
      height: '100%',
      border: `1px solid ${palette[type].formControls.multipleTimePicker.input.border}`,
      background: palette[type].formControls.multipleTimePicker.input.border
    },
    dividerLabel: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '-0.02px',
      color: palette[type].formControls.multipleTimePicker.label.color
    },
    input: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 85,
      height: '100%',
      border: 'none',
      fontSize: 14,
      fontWeight: 500,
      letterSpacing: '-0.03px',
      color: palette[type].formControls.multipleTimePicker.input.color,
      textAlign: 'center',
      cursor: 'pointer'
    },
    inputSmall: {
      width: 60,
      fontSize: 11
    },
    dropdownListWrap: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      zIndex: 111
    }
  }
}

const FormControlMultipleTimePicker = ({
  classes,
  small = false,
  onChange = f => f,
  fromValue = 0,
  toValue = 0
}) => {
  const [fromDropdown, setFromDropdown] = useState(false)
  const [toDropdown, setToDropdown] = useState(false)

  const [fromOptions, setFromOptions] = useState([])
  const [toOptions, setToOptions] = useState([])

  const [from, setFrom] = useState(fromValue)
  const [to, setTo] = useState(toValue)

  useEffect(() => {
    setFromOptions(createOptions('from'))
    setToOptions(createOptions('to'))
    //eslint-disable-next-line
  }, [])

  const selectOption = (field, value) => {
    if (field === 'from') {
      setFrom(value)
      onChange([value, to])
    } else {
      setTo(value)
      onChange([from, value])
    }
  }

  const createOptions = field => {
    let options = []

    for (let i = 10; i <= 3600; i += 10) {
      options.push(
        <DropdownHoverListItem
          key={`field-${i}`}
          onClick={() => selectOption(field, i)}
        >
          <DropdownHoverListItemText primary={secToLabel(i)} />
        </DropdownHoverListItem>
      )
    }

    return options
  }

  return (
    <Grid
      container
      justify="space-between"
      className={[classes.container, small ? classes.containerSmall : ''].join(
        ' '
      )}
    >
      <Grid item>
        <Popup
          trigger={
            <Typography
              className={[classes.input, small ? classes.inputSmall : ''].join(
                ' '
              )}
            >
              {secToLabel(from)}
            </Typography>
          }
          on="click"
          open={fromDropdown}
          onOpen={() => {
            if (toDropdown) setToDropdown(false)
            setFromDropdown(true)
          }}
          onClose={() => setFromDropdown(false)}
          arrow={false}
          contentStyle={{
            width: 100,
            height: 300,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            animation: 'fade-in 500ms'
          }}
        >
          <List
            component="nav"
            disablePadding={true}
            className={classes.dropdownListWrap}
            onClick={() => setFromDropdown(false)}
          >
            {fromOptions}
          </List>
        </Popup>
      </Grid>
      <Grid
        item
        className={classes.divider}
        container
        justify="center"
        alignItems="center"
      >
        <Typography className={classes.dividerLabel}>TO</Typography>
      </Grid>
      <Grid item>
        <Popup
          trigger={
            <Typography
              className={[classes.input, small ? classes.inputSmall : ''].join(
                ' '
              )}
            >
              {secToLabel(to)}
            </Typography>
          }
          on="click"
          open={toDropdown}
          onOpen={() => {
            if (fromDropdown) setFromDropdown(false)
            setToDropdown(true)
          }}
          onClose={() => setToDropdown(false)}
          arrow={false}
          contentStyle={{
            width: 100,
            height: 300,
            borderBottomLeftRadius: 6,
            borderBottomRightRadius: 6,
            animation: 'fade-in 500ms'
          }}
        >
          <List
            component="nav"
            disablePadding={true}
            className={classes.dropdownListWrap}
            onClick={() => setToDropdown(false)}
          >
            {toOptions}
          </List>
        </Popup>
      </Grid>
    </Grid>
  )
}

FormControlMultipleTimePicker.propTypes = {
  classes: PropTypes.object.isRequired,
  small: PropTypes.bool
}

export default withStyles(styles)(FormControlMultipleTimePicker)
