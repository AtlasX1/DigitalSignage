import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
  withStyles
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Toggle } from './Toggle'

export const Group = translate('translations')(
  withStyles(theme => {
    const { palette, type } = theme
    return {
      panelRoot: {
        marginBottom: '10px',
        border: `solid 1px ${palette[type].pages.rbac.group.border}`,
        background: palette[type].pages.rbac.background,
        borderRadius: '4px',
        '&:before': {
          display: 'none'
        }
      },
      panelExpanded: {
        margin: '0px',
        marginBottom: '10px'
      },

      summaryRoot: {
        paddingLeft: '8px',
        minHeight: '0px',
        '&$summaryExpanded': {
          minHeight: '0px',
          borderBottom: `1px solid ${palette[type].pages.rbac.group.border}`
        }
      },
      summaryExpanded: {
        margin: '0px'
      },
      summaryContent: {
        minHeight: '0px',
        margin: '0px',
        '&$summaryExpanded': {
          margin: '0px',
          minHeight: '0px'
        }
      },
      title: {
        fontWeight: 'bold',
        lineHeight: '42px',
        color: palette[type].pages.rbac.emphasis,
        textTransform: 'capitalize'
      },
      icon: {
        color: palette[type].pages.rbac.group.color
      },
      content: {
        display: 'grid',
        gap: '5px',
        padding: '8px'
      },
      ungroupedToggleOverride: {
        grid: '1fr / 92px 184px'
      }
    }
  })(
    class Group extends Component {
      static propTypes = {
        classes: PropTypes.object.isRequired
      }
      constructor(props) {
        super(props)
        this.state = {
          expanded: this.props.expanded
        }
      }

      render() {
        const {
          t,
          classes,
          title = '',
          groupPermissions = [],
          expanded,
          handler = f => f
        } = this.props

        return (
          <ExpansionPanel
            expanded={groupPermissions.length > 0 ? expanded : false}
            elevation={0}
            classes={{
              root: classes.panelRoot,
              expanded: classes.panelExpanded
            }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon className={classes.icon} />}
              onClick={() => handler(title)}
              classes={{
                root: classes.summaryRoot,
                content: classes.summaryContent,
                expanded: classes.summaryExpanded
              }}
            >
              <Typography className={classes.title}>{title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
              {groupPermissions.length > 0 &&
                groupPermissions.map((permissions, index) => (
                  <Toggle
                    classes={
                      title === t('Permissions')
                        ? {
                            container: classes.ungroupedToggleOverride
                          }
                        : {}
                    }
                    title={Object.keys(permissions)[0]}
                    key={`permission-toggle-${index}`}
                    data={permissions}
                  />
                ))}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      }
    }
  )
)
