import React, { Fragment, useState, useEffect, useMemo } from 'react'
import { Link as RouterLink, withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classNames from 'classnames'

import {
  withStyles,
  Avatar,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { Settings, ExitToApp, Person } from '@material-ui/icons'
import { CheckboxSwitcher } from '../Checkboxes'
import { DropdownHover } from '../Dropdowns'

import {
  logoutUserAction,
  clearLogoutInfo
} from 'actions/authenticationActions'
import { clearUserDetailsAction } from 'actions/userActions'
import { clearStorage, roles, languageHelper } from 'utils'
import { userRoleLevels } from 'constants/api'
import restoreLastOriginalUser from 'utils/restoreLastOriginalUser'
import languages from 'constants/languages'
import { getLogoutUrl } from 'utils/permissionUrls'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    accountInfoWrap: {
      display: 'flex',
      alignItems: 'stretch',
      marginLeft: '0.5rem',
      paddingLeft: '1rem',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: palette[type].secondary
    },
    actionDropdown: {
      width: 200
    },
    actionBtnLink: {
      display: 'flex',
      cursor: 'pointer'
    },
    actionBtnIcon: {
      width: 25,
      height: 25,
      color: palette[type].header.account.color,
      transition: 'opacity .4s',
      opacity: 0.5
    },
    languagesBtnLink: {
      cursor: 'pointer'
    },
    avatar: {
      margin: 10
    },
    userName: {
      ...typography.lightText[type],
      fontSize: '0.9375rem'
    },
    text: {
      ...typography.lightText[type]
    },
    textRoot: {
      padding: '5px 0 0 0',
      transition: 'all .4s'
    },
    switchRoot: {
      width: 25,
      margin: '0 11px 0 5px',
      transition: 'opacity .4s',
      opacity: 0.5
    },
    switchBase: {
      width: 30,
      marginLeft: -9
    },
    flag: {
      marginRight: 16
    },
    listContiner: {
      padding: '35px 0 30px 35px'
    },
    switchListItem: {
      height: '3em'
    },
    listItem: {
      padding: '11px 0',
      lineHeight: '29px',
      '&:hover $text': {
        fontWeight: '600 !important'
      },
      '&:hover $switchRoot, &:hover $actionBtnIcon': {
        opacity: 1
      }
    },
    dropdownTrigger: {
      cursor: 'pointer'
    },
    switchListItemText: {
      cursor: 'pointer'
    }
  }
}

const AccountInfo = ({
  t,
  classes,
  userProfile,
  userReducer,
  logout,
  openLanguageSelector,
  location,
  history,
  ...props
}) => {
  const [profile, setProfile] = useState(
    userProfile ? userProfile.userPic || '' : ''
  )
  const [userDetails, setUserDetails] = useState({
    role: {},
    permissions: {}
  })

  useEffect(() => {
    setProfile(userProfile ? userProfile.userPic || '' : '')
  }, [setProfile, userProfile])

  useEffect(() => {
    if (userReducer.response) {
      const { role, permissions } = userReducer.response
      setUserDetails({ role: roles.parse(role), permissions })
    }
  }, [userReducer])

  const menuItems = useMemo(() => {
    const {
      role: { role }
    } = userDetails
    return [
      {
        url: `/${role}/account-settings/profile`,
        text: t('Profile'),
        icon: <Person className={classes.actionBtnIcon} />,
        render: role !== userRoleLevels.system
      },
      {
        url: `/${role}/account-settings`,
        text: t('Settings'),
        icon: <Settings className={classes.actionBtnIcon} />,
        render: role !== userRoleLevels.system
      },
      {
        url: `/${role}/settings`,
        text: t('Settings'),
        icon: <Settings className={classes.actionBtnIcon} />,
        render: role === userRoleLevels.system
      },
      {
        url: `/${role}/settings`,
        text: t('Domain Settings'),
        icon: <Settings className={classes.actionBtnIcon} />,
        render: role === userRoleLevels.enterprise
      }
    ]
  }, [userDetails, t, classes.actionBtnIcon])

  useEffect(() => {
    if (logout.response || logout.error) {
      clearStorage()

      props.clearLogoutInfo()
      props.clearUserDetailsAction()

      if (!!localStorage.getItem('originalUsers')) {
        restoreLastOriginalUser()
        window.location.reload()
      }
      history.push(getLogoutUrl(location.pathname))
    }
    // eslint-disable-next-line
  }, [logout])

  const logoutUser = () => {
    props.logoutUserAction()
  }

  const selectedLanguage =
    languages.find(l => l.code === languageHelper.getLanguage()) || {}

  return (
    <div className={classes.accountInfoWrap}>
      <DropdownHover
        menuContainerClassName={classes.actionDropdown}
        ButtonComponent={
          <Grid
            container
            justify="center"
            alignItems="center"
            className={classes.dropdownTrigger}
          >
            <Avatar
              alt={userProfile.userName}
              src={profile}
              onError={() => setProfile('')}
              className={classes.avatar}
            />
            <Typography component="span" className={classes.userName}>
              {userProfile.userName}
            </Typography>
          </Grid>
        }
        MenuComponent={
          <Fragment>
            <List component="nav" className={classes.listContiner}>
              <ListItem
                className={classNames(classes.switchListItem, classes.listItem)}
                onClick={() => props.handleThemeChange(!props.dark)}
              >
                <CheckboxSwitcher
                  value={props.dark}
                  switchRootClass={classes.switchRoot}
                  switchBaseClass={classes.switchBase}
                />
                <ListItemText
                  classes={{
                    root: classNames(
                      classes.textRoot,
                      classes.switchListItemText
                    ),
                    primary: classes.text
                  }}
                  primary={props.dark ? t('Dark Theme') : t('Light Theme')}
                />
              </ListItem>
              <ListItem
                className={classNames(
                  classes.languagesBtnLink,
                  classes.listItem
                )}
                onClick={() => openLanguageSelector(true)}
              >
                <img
                  src={selectedLanguage.icon}
                  className={[classes.actionBtnIcon, classes.flag].join(' ')}
                  alt={selectedLanguage.name}
                />
                <ListItemText
                  classes={{
                    root: classes.textRoot,
                    primary: classes.text
                  }}
                  primary={selectedLanguage.name}
                />
              </ListItem>
              {menuItems
                .filter(item =>
                  item.hasOwnProperty('render') ? item.render : true
                )
                .map(({ url, icon, text }, index) => (
                  <ListItem
                    key={text + index}
                    className={classNames(
                      classes.actionBtnLink,
                      classes.listItem
                    )}
                    component={RouterLink}
                    to={url}
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText
                      classes={{
                        root: classes.textRoot,
                        primary: classes.text
                      }}
                      primary={text}
                    />
                  </ListItem>
                ))}
              <ListItem
                className={classNames(classes.actionBtnLink, classes.listItem)}
                onClick={logoutUser}
              >
                <ListItemIcon>
                  <ExitToApp className={classes.actionBtnIcon} />
                </ListItemIcon>
                <ListItemText
                  classes={{
                    root: classes.textRoot,
                    primary: classes.text
                  }}
                  primary={t('Logout')}
                />
              </ListItem>
            </List>
          </Fragment>
        }
      />
    </div>
  )
}

const mapStateToProps = ({ logout, user }) => ({
  logout,
  userReducer: user.details
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { logoutUserAction, clearLogoutInfo, clearUserDetailsAction },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withRouter(connect(mapStateToProps, mapDispatchToProps)(AccountInfo))
  )
)
