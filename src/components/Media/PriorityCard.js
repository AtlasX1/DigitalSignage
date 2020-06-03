import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { CheckboxSwitcher } from '../Checkboxes'

const styles = theme => {
  const { palette, type } = theme
  return {
    muiPanelRoot: {
      marginBottom: '15px',
      border: `1px solid ${palette[type].sideModal.content.border}`,
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

    priorityHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].mediaInfo.card.titleColor
    },
    prioritySwitcherLabel: {
      marginTop: '15px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#4c5057'
    },
    prioritySwitcherDescription: {
      marginTop: '10px',
      marginBottom: '15px',
      fontSize: '12px',
      color: '#9394a0'
    }
  }
}

class PriorityCard extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    value: PropTypes.bool,
    onControlChange: PropTypes.func
  }

  render() {
    const { t, classes, value, onControlChange } = this.props

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
          <Typography className={classes.priorityHeaderText}>
            {t('Priority')}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container wrap="nowrap">
            <Grid item>
              <CheckboxSwitcher value={value} handleChange={onControlChange} />
            </Grid>
            <Grid item>
              <Typography className={classes.prioritySwitcherLabel}>
                {t('Fullscreen Priority').toUpperCase()}
              </Typography>
              <Typography className={classes.prioritySwitcherDescription}>
                {t(
                  'This option will display content as a fullscreen item, even if placed inside a smaller zone. After media has finished playing, original template will resume playback.'
                )}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}

PriorityCard.defaultProps = {
  value: false,
  onControlChange: () => {}
}

export default translate('translations')(withStyles(styles)(PriorityCard))
