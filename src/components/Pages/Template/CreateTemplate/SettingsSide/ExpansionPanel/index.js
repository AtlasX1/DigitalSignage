import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { withStyles, Typography } from '@material-ui/core'
import { Remove, Add } from '@material-ui/icons'
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel'
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'

const PanelContainer = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      position: 'static',
      borderWidth: '1px 0 1px 0',
      borderStyle: 'solid',
      borderColor: palette[type].pages.createTemplate.border,
      boxShadow: 'none',

      '&:before': {
        display: 'none'
      }
    },
    expanded: {
      margin: 'auto 0'
    }
  }
})(MuiExpansionPanel)

const ExpansionPanelSummary = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      background:
        palette[type].pages.createTemplate.settings.expansion.header.background,
      borderBottom: palette[type].pages.createTemplate.border,
      marginBottom: -1,
      minHeight: 36,
      '&$expanded': {
        minHeight: 36
      }
    },
    content: {
      margin: '0',

      '&$expanded': {
        margin: '0'
      }
    },
    expanded: {},
    expandIcon: {}
  }
})(props => <MuiExpansionPanelSummary {...props} />)

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary'

const ExpansionPanelDetails = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      flexWrap: 'wrap',
      padding: '0',
      background:
        palette[type].pages.createTemplate.settings.expansion.body.background
    }
  }
})(MuiExpansionPanelDetails)

const styles = theme => {
  const { palette, type } = theme
  return {
    label: {
      color: palette[type].pages.createTemplate.settings.expansion.header.color,

      '&:hover': {
        color: palette[type].dropdown.listItem.hover.color
      }
    },
    textWrapper: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'center'
    },
    errorText: {
      flexGrow: 1,
      padding: '0 0 0 10px',
      textAlign: 'right',
      color: 'red',
      fontSize: 12
    }
  }
}

const ExpansionPanel = ({
  classes,
  title,
  error,
  children,
  expanded,
  formControlLabelClass = '',
  rootClass = '',
  summaryClass = '',
  summaryIconClass = '',
  contentClass = '',
  className,
  isExpanded: isExpandedProp,
  onChange,
  disabled
}) => {
  const [isExpanded, setExpanded] = useState(expanded)
  const isControlled = typeof onChange === 'function'

  return (
    <div className={className}>
      <PanelContainer
        square
        expanded={isControlled ? isExpandedProp : isExpanded}
        onChange={() =>
          isControlled ? onChange(!isExpandedProp) : setExpanded(!isExpanded)
        }
        className={rootClass}
        disabled={disabled}
      >
        <ExpansionPanelSummary
          aria-controls="panel1d-content"
          id={`expansion-panel-${title}-header`}
          className={summaryClass}
          classes={{
            expandIcon: summaryIconClass
          }}
          expandIcon={
            isExpanded ? (
              <Remove className={classes.label} />
            ) : (
              <Add className={classes.label} />
            )
          }
        >
          <div className={classes.textWrapper}>
            <Typography
              className={[classes.label, formControlLabelClass].join(' ')}
            >
              {title}
            </Typography>
            {error && (
              <Typography className={classes.errorText}>{error}</Typography>
            )}
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={contentClass}>
          {children}
        </ExpansionPanelDetails>
      </PanelContainer>
    </div>
  )
}

ExpansionPanel.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool.isRequired
}

export default withStyles(styles)(ExpansionPanel)
