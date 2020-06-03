import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { SingleDatePicker } from 'react-dates'

import { withStyles, Grid, Typography, InputLabel } from '@material-ui/core'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = theme => {
  const { palette, type } = theme
  return {
    muiPanelRoot: {
      marginBottom: '15px',
      border: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].mediaInfo.card.background,
      borderRadius: '4px',
      '&:before': {
        display: 'none'
      }
    },
    muiPanelExpanded: {
      margin: '0px',
      marginBottom: '15px'
    },

    muiSummaryRoot: {
      paddingLeft: '13px',
      minHeight: '0px',
      '&$muiSummaryExpanded': {
        minHeight: '0px',
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    muiSummaryContent: {
      minHeight: '0px',
      margin: '0px',
      '&$muiSummaryExpanded': {
        margin: '0px',
        minHeight: '0px'
      }
    },
    muiSummaryExpanded: {
      margin: '0px'
    },
    muiDetails: {
      padding: '13px 24px 24px'
    },

    validityHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].mediaInfo.card.titleColor
    },
    validityDateLabel: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '13px',
      color: '#74809a',
      transform: 'none !important'
    }
  }
}
class ValidityCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      activeDate: null,
      activeDateFocused: null,
      expireDate: null,
      expireDateFocused: null
    }
  }

  render() {
    const {
      t,
      classes,
      onActiveDateChange,
      onExpireDateChange,
      activeDate,
      expireDate,
      dayPickerProps = { right: {}, left: {} }
    } = this.props

    return (
      <ExpansionPanel
        expanded={this.props.expanded}
        elevation={0}
        classes={{
          root: classes.muiPanelRoot,
          expanded: classes.muiPanelExpanded
        }}
      >
        <ExpansionPanelSummary
          classes={{
            root: classes.muiSummaryRoot,
            content: classes.muiSummaryContent,
            expanded: classes.muiSummaryExpanded
          }}
          onClick={this.props.handler}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography className={classes.validityHeaderText}>
            {t('Validity')}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.muiDetails}>
          <Grid container justify="space-between">
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <InputLabel
                    shrink
                    variant="filled"
                    className={classes.validityDateLabel}
                  >
                    {t('Active On')}
                  </InputLabel>
                </Grid>
                <Grid item>
                  <SingleDatePicker
                    id="active-on"
                    showDefaultInputIcon
                    inputIconPosition="after"
                    anchorDirection="right"
                    placeholder={null}
                    date={activeDate}
                    onDateChange={onActiveDateChange}
                    focused={this.state.activeDateFocused}
                    onFocusChange={({ focused }) =>
                      this.setState({ activeDateFocused: focused })
                    }
                    {...dayPickerProps.left}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column">
                <Grid item>
                  <InputLabel
                    shrink
                    variant="filled"
                    className={classes.validityDateLabel}
                  >
                    {t('Expire On')}
                  </InputLabel>
                </Grid>
                <Grid item>
                  <SingleDatePicker
                    id="expire-on"
                    showDefaultInputIcon
                    inputIconPosition="after"
                    anchorDirection="right"
                    placeholder={null}
                    date={expireDate}
                    onDateChange={onExpireDateChange}
                    focused={this.state.expireDateFocused}
                    onFocusChange={({ focused }) =>
                      this.setState({ expireDateFocused: focused })
                    }
                    {...dayPickerProps.right}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

ValidityCard.defaultProps = {
  activeDate: null,
  expireDate: null,
  onActiveDateChange: () => {},
  onExpireDateChange: () => {}
}

export default translate('translations')(withStyles(styles)(ValidityCard))
