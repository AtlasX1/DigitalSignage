import React, { useState } from 'react'
import { withRouter, Link as RouterLink } from 'react-router-dom'
import classNames from 'classnames'

import {
  withStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'
import { DropdownHover } from '../Dropdowns'

const styles = ({ type, typography }) => ({
  navigationLinkWrap: {
    display: 'flex',
    alignItems: 'stretch',
    margin: '0 0.5rem',
    paddingBottom: '2px',
    cursor: 'default',
    '&:hover': {
      borderBottom: '2px solid transparent',
      paddingBottom: 0
    }
  },
  navigationItemIcon: {
    fontSize: 18,
    marginRight: '0.5rem'
  },
  dropdownContainer: {
    display: 'flex',
    alignItems: 'stretch'
  },
  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    fontSize: '0.875rem',
    textTransform: 'capitalize'
  },
  navigationText: {
    ...typography.lightText[type],
    fontSize: '0.9375rem'
  },
  navigationLinkActive: {
    fontWeight: 'bold'
  },
  navigationSubMenu: {
    width: '300px',
    top: '70%'
  },
  navigationSubMenuList: {
    padding: '35px 0 30px 35px',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  navigationSubMenuItem: {
    padding: '5px 0 0'
  },
  navigationSubMenuText: {
    ...typography.lightText[type],
    transition: 'all .4s'
  },
  navigationSubMenuActive: {
    fontWeight: 'bold'
  },
  subMenuItem: {
    '&:hover $subMenuIcon': {
      opacity: 1
    },
    '&:hover $navigationSubMenuText': {
      fontWeight: 'bold'
    }
  },
  subMenuIcon: {
    fontSize: '25px',
    opacity: 0.3,
    transition: 'all .4s'
  },
  subMenuIconActive: {
    opacity: 1
  }
})

const dropdownFadeTransition = 500

const NavigationLink = ({
  classes,
  withIcon = true,
  location,
  url = '/',
  color = 'black',
  linkText = '',
  linkIconClassName = '',
  menuItems = []
}) => {
  const [hidingDropdown, setHidingDropdown] = useState(false)

  const onLinkClick = () => {
    setHidingDropdown(true)
    setTimeout(() => {
      setHidingDropdown(false)
    }, 2 * dropdownFadeTransition)
  }

  return (
    <div
      className={classes.navigationLinkWrap}
      style={{ borderBottomColor: color }}
    >
      <DropdownHover
        forceHidden={hidingDropdown}
        dropSide="bottomRight"
        menuContainerClassName={classes.navigationSubMenu}
        dropdownContainerClassName={classes.dropdownContainer}
        buttonWrapClassName={classes.dropdownButton}
        ButtonComponent={
          <Typography
            className={classNames(
              classes.navigationText,
              location.pathname.indexOf(url) !== -1 &&
                classes.navigationLinkActive
            )}
          >
            {withIcon && (
              <i
                className={classNames(
                  linkIconClassName,
                  classes.navigationItemIcon
                )}
                style={{ color }}
              />
            )}
            {linkText}
          </Typography>
        }
        MenuComponent={
          <List className={classes.navigationSubMenuList}>
            {menuItems
              .filter(item =>
                item.hasOwnProperty('render') ? item.render : true
              )
              .map((item, index) => (
                <ListItem
                  className={classes.subMenuItem}
                  key={item + index}
                  component={RouterLink}
                  onClick={onLinkClick}
                  to={item.linkTo}
                  disableGutters
                >
                  {item.iconClassName || item.icon ? (
                    <ListItemIcon>
                      {item.iconClassName ? (
                        <i
                          style={{ color }}
                          className={classNames(
                            item.iconClassName,
                            classes.subMenuIcon,
                            location.pathname === item.linkTo &&
                              classes.subMenuIconActive
                          )}
                        />
                      ) : item.icon ? (
                        <item.icon
                          style={{ color }}
                          className={classNames(
                            item.iconClassName,
                            classes.subMenuIcon,
                            location.pathname === item.linkTo &&
                              classes.subMenuIconActive
                          )}
                        />
                      ) : null}
                    </ListItemIcon>
                  ) : null}
                  <ListItemText
                    className={classes.navigationSubMenuItem}
                    primary={item.label}
                    primaryTypographyProps={{
                      className: classNames(
                        classes.navigationSubMenuText,
                        location.pathname === item.linkTo &&
                          classes.navigationSubMenuActive
                      )
                    }}
                  />
                </ListItem>
              ))}
          </List>
        }
      />
    </div>
  )
}

export default withStyles(styles)(withRouter(NavigationLink))
