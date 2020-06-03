import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'react-dates/initialize'
import { DateRangePicker } from 'react-dates'

import { withStyles, Grid, InputLabel, Typography } from '@material-ui/core'

import 'react-dates/lib/css/_datepicker.css'
import '../../styles/forms/_datepicker.scss'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      marginBottom: theme.spacing.unit * 2
    },
    datePicker: {
      display: 'flex',
      flexDirection: 'row',
      verticalAlign: 'middle'
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      color: palette[type].formControls.label.color
    },
    dividerText: {
      fontSize: 12,
      lineHeight: '28px',
      textTransform: 'uppercase'
    },
    inputContainer: {
      margin: '1px 1px 1px 2px'
    },
    errorText: {
      color: 'red',
      fontSize: 9
    }
  }
}

class FormControlDateRangePickers extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onDatesChange: PropTypes.func
  }

  static defaultProps = {
    bottomMargin: true,
    startDatePlaceholderText: 'Start',
    endDatePlaceholderText: 'End'
  }

  constructor(props) {
    super(props)

    this.state = {
      startDate: null,
      endDate: null,
      focusedInput: null
    }
  }

  render() {
    const {
      id,
      classes,
      label,
      dividerText,
      bottomMargin,
      startDatePlaceholderText,
      endDatePlaceholderText,
      formControlLabelClass = '',
      formControlDividerTextClass = '',
      onDatesChange,
      startDate,
      endDate,
      error,
      touched,
      anchorDirection = 'right'
    } = this.props
    return (
      <div className={bottomMargin ? classes.root : null}>
        <Grid
          container
          alignItems="center"
          justify="space-between"
          className={classes.inputContainer}
        >
          {label && (
            <InputLabel
              shrink
              className={[classes.label, formControlLabelClass].join(' ')}
            >
              {label}
            </InputLabel>
          )}
          <DateRangePicker
            customArrowIcon={
              <Typography
                className={[
                  classes.dividerText,
                  formControlDividerTextClass
                ].join(' ')}
              >
                {dividerText}
              </Typography>
            }
            anchorDirection={anchorDirection}
            isOutsideRange={() => false}
            startDateId={`${id}-from`}
            endDateId={`${id}-to`}
            startDate={onDatesChange ? startDate : this.state.startDate}
            endDate={onDatesChange ? endDate : this.state.endDate}
            onDatesChange={
              onDatesChange ||
              (({ startDate, endDate }) =>
                this.setState({ startDate, endDate }))
            }
            onFocusChange={focusedInput => this.setState({ focusedInput })}
            focusedInput={this.state.focusedInput}
            startDatePlaceholderText={startDatePlaceholderText}
            endDatePlaceholderText={endDatePlaceholderText}
          />
        </Grid>
        {error && touched && (
          <Typography className={classes.errorText}>{error}</Typography>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(FormControlDateRangePickers)
