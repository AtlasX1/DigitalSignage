import React, { useState, useEffect } from 'react'
import { withRouter, Link as RouterLink } from 'react-router-dom'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import {
  withStyles,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@material-ui/core'

import DrawerIcon from 'common/icons/index'
import { DropdownHover } from 'components/Dropdowns'
import { getUrlPrefix, roles } from 'utils'
import routeByName from 'constants/routes'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    iconButtonWrapper: {
      marginRight: '1rem',
      paddingRight: '0.5rem',
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: palette[type].secondary
    },
    navigationSubMenu: {
      width: '200px',
      top: '80%'
    },
    navigationSubMenuList: {
      padding: '35px 0 30px 35px'
    },
    navigationSubMenuItem: {
      padding: 0
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
      transition: 'all .4s',
      color: palette[type].header.navItem.activeColor
    },
    subMenuIconActive: {
      opacity: 1
    }
  }
}

const Drawer = ({ t, classes, location, detailsReducer, customClass }) => {
  const [role, setRole] = useState({})

  useEffect(() => {
    if (detailsReducer.response) {
      setRole(roles.parse(detailsReducer.response.role))
    }
  }, [detailsReducer])

  const menuItems = [
    {
      url: `/${role.role}/dashboard`,
      linkText: t('Dashboard'),
      iconClassName: 'icon-list-bullets-2'
    },
    {
      url: getUrlPrefix(routeByName.users.root),
      linkText: t('Users menu item'),
      iconClassName: 'icon-user'
    },
    {
      url: routeByName.clientUsers.root,
      linkText: t('Client Users'),
      render: role.system,
      iconClassName: 'icon-user'
    },
    {
      url: `/${role.role}/clients-library`,
      linkText: t('Clients menu item'),
      iconClassName: 'icon-business-man',
      render: !role.org
    },
    {
      url: '/system/packages-library',
      linkText: t('Packages menu item'),
      iconClassName: 'icon-box-2',
      render: role.system
    },
    {
      url: '/system/messages-library',
      linkText: t('Messages menu item'),
      iconClassName: 'icon-chat-bubbles-square',
      render: role.system
    },
    {
      url: '/system/help-pages-library',
      linkText: t('Help Pages menu item'),
      iconClassName: 'icon-interface-question-mark',
      render: role.system
    },
    {
      url: '/system/banners-library',
      linkText: t('Banners menu item'),
      iconClassName: 'icon-rewards-banner-2',
      render: role.system
    },
    {
      url: '/system/channels-library',
      linkText: t('Channels menu item'),
      iconClassName: 'icon-list-bullets-3',
      render: false // Hide the page until further notice
      // render: role.system
    },
    {
      url: '/system/oem-clients-library',
      linkText: t('OEM Clients menu item'),
      iconClassName: 'icon-user-group',
      render: role.system
    },
    {
      url: '/system/rss-feeds-library',
      linkText: t('RSS Feeds menu item'),
      iconClassName: 'icon-share-rss-feed',
      render: role.system
    },
    {
      url: `/${role.role}/tags-library`,
      linkText: t('Tags'),
      iconClassName: 'icon-share-rss-feed'
    },
    {
      url: '/system/roles-permissions',
      linkText: t('Roles And Permissions'),
      iconClassName: 'icon-user-lock',
      render: role.system
    }
  ]

  const [isHovering, setHoverState] = useState(0)
  return (
    <div
      className={`${classes.iconButtonWrapper} ${customClass}`}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      <DropdownHover
        dropSide="bottomRight"
        menuContainerClassName={classes.navigationSubMenu}
        dropdownContainerClassName={classes.dropdownContainer}
        buttonWrapClassName={classes.dropdownButton}
        ButtonComponent={
          <IconButton>
            <DrawerIcon hovering={isHovering} />
          </IconButton>
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
                  to={item.url}
                  disableGutters
                >
                  {item.iconClassName !== '' ? (
                    <ListItemIcon>
                      <i
                        className={`${item.iconClassName} ${
                          classes.subMenuIcon
                        } ${
                          location.pathname === item.url
                            ? classes.subMenuIconActive
                            : ''
                        }`}
                      />
                    </ListItemIcon>
                  ) : null}
                  <ListItemText
                    className={classes.navigationSubMenuItem}
                    primary={item.linkText}
                    primaryTypographyProps={{
                      className: `${classes.navigationSubMenuText} ${
                        location.pathname === item.url
                          ? classes.navigationSubMenuActive
                          : ''
                      }`
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

const mapStateToProps = ({ user }) => ({
  detailsReducer: user.details
})

export default translate('translations')(
  withStyles(styles)(withRouter(connect(mapStateToProps, null)(Drawer)))
)
