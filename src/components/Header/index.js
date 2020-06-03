import React, { useEffect, useState, useMemo } from 'react'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withSnackbar } from 'notistack'

import { withStyles, Grid, Button } from '@material-ui/core'

import Drawer from './Drawer'
import Navigation from '../Navigation'
import AccountInfo from '../Account/AccountInfo'
import { AccountNavigation } from '../Account'
import LanguageSelector from './LanguageSelector'

import {
  HeaderAccountInfoLoader,
  HeaderAccountNavigationLoader,
  HeaderNavigationLoader,
  HeaderLogoLoader
} from '../Loaders'

import {
  getUserDetailsAction,
  clearUserDetailsAction
} from 'actions/userActions'
import { clearLoginInfo } from 'actions/authenticationActions'
import { setToken, whiteLabelUtils, getUrlPrefix } from 'utils/index'

import { apiConstants } from '../../constants'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      height: 80,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].header.borderColor,
      boxShadow: `0 2px 4px 0 ${palette[type].header.shadow.s}, 0 1px 0 0 ${palette[type].header.shadow.f}`,
      backgroundColor: palette[type].default,
      position: 'fixed',
      zIndex: 111,
      width: '100%',
      top: 0
    },
    contentContainer: {
      maxWidth: 1600,
      margin: '0 auto'
    },
    leftPart: {
      padding: '.5rem 0'
    },
    logoImage: {
      width: 104,
      height: 32
    },
    navigationWrap: {
      display: 'flex',
      alignItems: 'stretch'
    },
    accountNavigationWrap: {
      display: 'flex',
      alignItems: 'center',
      padding: '.5rem 0'
    }
  }
}

const Header = ({
  t,
  classes,
  details = {},
  login = {},
  getUserDetailsAction,
  clearUserDetailsAction,
  clearLoginInfo,
  enqueueSnackbar,
  whiteLabelReducer,
  ...props
}) => {
  const [userPic, setUserPic] = useState('')
  const [name, setName] = useState({ first: '', last: '' })
  const [passwordReminder, setPasswordReminder] = useState({})
  const [loading, setLoading] = useState(true)
  const [languageSelectorIsOpen, setLanguageSelectorIsOpen] = useState(false)
  const whiteLabelInfo = useMemo(() => {
    return whiteLabelUtils.parseReducer(whiteLabelReducer)
  }, [whiteLabelReducer])

  useEffect(() => {
    if (details.response) {
      const {
        firstName,
        lastName,
        profile,
        passwordReminder
      } = details.response
      setName({ first: firstName, last: lastName })
      setUserPic(profile)
      setPasswordReminder(passwordReminder)

      setLoading(false)
    }
    // eslint-disable-next-line
  }, [details])

  useEffect(() => {
    if (login.response) {
      const { accessToken, tokenType, expiresIn } = login.response

      const system = !!localStorage.getItem(apiConstants.SYSTEM_USER_TOKEN_NAME)
      const name = system
        ? apiConstants.SYSTEM_USER_TOKEN_NAME
        : apiConstants.ORG_USER_TOKEN_NAME

      setToken(name, tokenType, accessToken, expiresIn)
      clearLoginInfo()
      getUserDetailsAction()
    }
    // eslint-disable-next-line
  }, [login])

  useEffect(() => {
    if (Object.keys(passwordReminder).length) {
      const {
        alert,
        forcePasswordChange,
        lastPasswordChange
      } = passwordReminder

      if (forcePasswordChange) {
        props.history.push(getUrlPrefix('account-settings/profile'))
      } else if (alert) {
        enqueueSnackbar(
          `${t('Change Password reminder')}. ${t(
            'Days'
          )}: ${lastPasswordChange}`,
          {
            variant: 'default',
            persist: true,
            action: (
              <Button color="secondary" size="small">
                {t('Hide').toUpperCase()}
              </Button>
            )
          }
        )
      }
    }
    // eslint-disable-next-line
  }, [passwordReminder])

  return (
    <header className={classes.root}>
      <Grid
        container
        justify="space-between"
        direction="row"
        className={classes.contentContainer}
      >
        <Grid item className={classes.leftPart}>
          <Grid container alignItems="center" direction="row">
            {loading ? (
              <HeaderLogoLoader />
            ) : (
              <>
                <Grid item>
                  <Drawer />
                </Grid>
                <Grid item>
                  <img
                    className={classes.logoImage}
                    src={whiteLabelInfo.headerLogo}
                    alt="Logo"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>

        <Grid item className={classes.navigationWrap}>
          {loading ? <HeaderNavigationLoader /> : <Navigation />}
        </Grid>

        <Grid item className={classes.accountNavigationWrap}>
          {loading ? <HeaderAccountNavigationLoader /> : <AccountNavigation />}

          {loading ? (
            <HeaderAccountInfoLoader />
          ) : (
            <AccountInfo
              userProfile={{
                userName: `${name.first} ${name.last}`,
                userPic: userPic
              }}
              dark={props.dark}
              handleThemeChange={props.handleThemeChange}
              openLanguageSelector={setLanguageSelectorIsOpen}
            />
          )}
        </Grid>
      </Grid>
      {languageSelectorIsOpen && (
        <LanguageSelector
          setLanguageSelectorIsOpen={setLanguageSelectorIsOpen}
          route={props.location.pathname}
        />
      )}
    </header>
  )
}

const mapStateToProps = ({ user, login, whiteLabel }) => ({
  whiteLabelReducer: whiteLabel,
  login: login,
  details: user.details
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearUserDetailsAction,
      getUserDetailsAction,
      clearLoginInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withRouter(withSnackbar(Header)))
  )
)
