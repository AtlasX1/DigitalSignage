import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { withStyles, withTheme, Divider } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'

import List from '../List'
import Popup from '../Popup'

import {
  DropdownHoverListItem,
  DropdownHoverListItemText,
  DropdownHoverListItemIcon
} from '../Dropdowns'
import { WhiteButton } from '../Buttons'

const styles = ({ palette, type, typography }) => ({
  rowActionDropdown: {
    width: '170px'
  },
  rowActionList: {
    background: palette[type].tableLibrary.body.row.dropdown.list.background,
    overflow: 'hidden',
    borderRadius: 6
  },
  rowActionBtn: {
    minWidth: '61px',
    paddingLeft: '10px',
    paddingRight: '10px',
    boxShadow: `0 1px 0 0 ${palette[type].buttons.white.shadow}`,
    color: palette[type].tableLibrary.body.row.button.color,
    background: palette[type].tableLibrary.body.row.button.background,
    border: palette[type].tableLibrary.body.row.button.border,

    '&:hover': {
      borderColor: '#1c5dca',
      backgroundColor: '#1c5dca',
      color: '#fff'
    }
  },
  rowActionBtnIcon: {
    width: 18,
    height: 18
  },
  value: {
    color: palette[type].tagCard.item.color,
    fontFamily: typography.fontFamily,
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '-0.01px',
    lineHeight: '15px',
    padding: '5px 0 0 5px'
  }
})

const TableLibraryRowActionButton = ({
  theme,
  classes,
  actionLinks = [],
  ...props
}) => {
  const { palette, type } = theme

  const dropdownStyle = {
    width: 170,
    animation: 'fade-in',
    background: palette[type].tableLibrary.body.row.dropdown.background,
    boxShadow: `0 2px 4px 0 ${palette[type].tableLibrary.body.row.dropdown.shadow}`,
    borderColor: palette[type].dropdown.borderColor
  }

  const trigger = useMemo(() => {
    const { trigger } = props

    if (!trigger) {
      return (
        <WhiteButton className={classes.rowActionBtn}>
          <Settings className={classes.rowActionBtnIcon} />
          <KeyboardArrowDown className={classes.rowActionBtnIcon} />
        </WhiteButton>
      )
    }

    return trigger
  }, [classes, props])

  const dropdownArrowStyle = {
    background: palette[type].tableLibrary.body.row.dropdown.background
  }

  return (
    <div>
      <Popup
        on="hover"
        trigger={trigger}
        contentStyle={dropdownStyle}
        arrowStyle={dropdownArrowStyle}
      >
        <List
          component="nav"
          disablePadding={true}
          className={classes.rowActionList}
        >
          {actionLinks
            .filter(action =>
              action.hasOwnProperty('render') ? action.render : true
            )
            .map((action, index) =>
              action.divider ? (
                <Divider key={`row-action-${index}`} />
              ) : (
                <DropdownHoverListItem
                  key={`row-action-${index}`}
                  component={action.clickAction ? 'button' : Link}
                  to={{
                    pathname:
                      action.to && action.to.pathname
                        ? action.to.pathname
                        : action.to,
                    data: action.data || undefined
                  }}
                  onClick={action.clickAction ? action.clickAction : f => f}
                >
                  {action.icon && (
                    <DropdownHoverListItemIcon>
                      <i className={action.icon} />
                    </DropdownHoverListItemIcon>
                  )}
                  {action.value !== undefined ? (
                    <span className={classes.value}>{action.value}</span>
                  ) : null}
                  <DropdownHoverListItemText primary={action.label} />
                </DropdownHoverListItem>
              )
            )}
        </List>
      </Popup>
    </div>
  )
}

export default withStyles(styles)(withTheme()(TableLibraryRowActionButton))
