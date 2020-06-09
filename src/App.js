import React, { Fragment, useState, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Router, Route, Switch, Redirect } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { LinkedInPopUp } from 'react-linkedin-login-oauth2'
import update from 'immutability-helper'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { StylesProvider, createGenerateClassName } from '@material-ui/styles'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { withStyles, CssBaseline } from '@material-ui/core'

import i18n from './i18n'
import defaultTheme from './theme'

import Header from 'components/Header'
import Footer from 'components/Footer'
import {
  SignIn,
  ForgotPassword,
  SystemSignIn,
  EnterpriseSignIn,
  AccessDenied
} from 'components/Account'
import MicrosoftLoginProcessing from 'components/Account/SocialLogin/MicrosoftLoginProcessing'
import WhiteLabelProvider from 'components/WhiteLabelProvider'
import WindowTitleProvider from 'components/WindowTitleProvider'

import history from './history'

import './styles/index.scss'
import featureConstants from 'constants/featureConstants'
import {
  UserDashboard,
  AccountSettings,
  MediaLibrary,
  PlaylistLibrary,
  ReportsLibrary,
  ScheduleLibrary,
  ScheduleTimeline,
  TemplateLibrary,
  FontLibrary,
  CreateReport,
  CustomReport,
  DesignGallery,
  RolesAndPermissions,
  HTMLContentLibrary,
  WorkplacePostersLibrary
} from 'components/Pages'

import {
  AdminDashboard,
  UsersLibrary,
  DeviceLibrary,
  ClientsLibrary,
  PackagesLibrary,
  MessagesLibrary,
  HelpPagesLibrary,
  BannersLibrary,
  OEMClientsLibrary,
  MediaContentSource,
  TagsLibrary,
  ClientUsersLibrary
} from 'components/Pages/Admin'
import SuperAdminSettings from 'components/Pages/Admin/ClientsLibrary/SuperAdminSettings'

import {
  UnauthorizedRoute,
  ORGRoute,
  SystemRoute,
  EnterpriseRoute
} from 'components/Routes'

import { apiConstants } from './constants'
import { getGoogleFonts } from 'actions/fontsActions'
import { getUserDetailsAction } from 'actions/userActions'
import { updateTokenAction } from 'actions/authenticationActions'
import { isExpired } from 'utils/date'
import routeByName from 'constants/routes'
import {
  HTML_CONTENT,
  CUSTOM_EMAIL_TEMPLATE,
  EMAIL_TEMPLATE
} from 'constants/library'
import getUrlPrefix from 'utils/permissionUrls'
require('dotenv').config()

const styles = theme => ({
  mainContainer: {
    maxWidth: 1600,
    margin: '16px auto 0',
    paddingTop: 80
  }
})

const {
  Feeds,
  RSSFeed,
  DemoFeeds,
  MediaRSS,
  YouTube,
  Radio,
  CustomWidget
} = featureConstants

const appWrapperMapStateToProps = ({ user, login, appReducer }) => ({
  login: login,
  details: user.details,
  minContainerHeight: appReducer.groupModalHeight
})

const appWrapperMapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserDetailsAction,
      updateTokenAction
    },
    dispatch
  )

const AppWrapper = connect(
  appWrapperMapStateToProps,
  appWrapperMapDispatchToProps
)(
  withStyles(styles)(
    ({
      classes,
      details = {},
      login = {},
      getUserDetailsAction,
      updateTokenAction,
      minContainerHeight,
      ...props
    }) => {
      useEffect(() => {
        const isLoggedOut = isExpired()

        if (!isLoggedOut) {
          if (!details.response) getUserDetailsAction()
        } else {
          if (!login.response) updateTokenAction()
        }
        // eslint-disable-next-line
      }, [])

      return (
        <Fragment>
          <Header
            dark={props.dark}
            handleThemeChange={props.handleThemeChange}
          />
          <div
            className={classNames(classes.mainContainer, {
              DarkTheme: props.dark
            })}
          >
            <div style={{ minHeight: minContainerHeight }}>
              <ORGRoute path="/org/dashboard" component={UserDashboard} />
              <ORGRoute
                path="/org/account-settings"
                component={AccountSettings}
              />
              <ORGRoute path="/playlist-library" component={PlaylistLibrary} />
              <ORGRoute path="/template-library" component={TemplateLibrary} />
              <ORGRoute path="/schedule-library" component={ScheduleLibrary} />
              <ORGRoute
                path="/schedule-timeline"
                component={ScheduleTimeline}
              />

              <ORGRoute path="/design-gallery" component={DesignGallery} />

              <ORGRoute
                path={`/org/${routeByName.users.root}`}
                component={UsersLibrary}
              />
              <ORGRoute
                path={`/org/${routeByName.device.root}`}
                component={DeviceLibrary}
              />
              <ORGRoute
                path={`/org/${routeByName.tag.root}`}
                component={TagsLibrary}
              />

              <EnterpriseRoute
                path="/enterprise/dashboard"
                component={AdminDashboard}
              />
              <EnterpriseRoute
                path="/enterprise/tags-library"
                component={TagsLibrary}
              />
              <EnterpriseRoute
                path="/enterprise/device-library"
                component={DeviceLibrary}
              />
              <EnterpriseRoute
                path={`/enterprise/${routeByName.users.root}`}
                component={UsersLibrary}
              />

              <EnterpriseRoute
                path="/enterprise/account-settings"
                component={AccountSettings}
              />

              <EnterpriseRoute
                path="/enterprise/settings"
                component={SuperAdminSettings}
              />
              <EnterpriseRoute
                path={`/enterprise/${routeByName.clients.root}`}
                component={ClientsLibrary}
              />

              <SystemRoute
                path="/system/settings"
                component={SuperAdminSettings}
              />
              <SystemRoute
                path={routeByName.clientUsers.root}
                component={ClientUsersLibrary}
              />
              <SystemRoute
                path="/system/settings"
                component={SuperAdminSettings}
              />
              <SystemRoute path="/system/dashboard" component={UserDashboard} />
              <SystemRoute
                path={`/system/${routeByName.users.root}`}
                component={UsersLibrary}
              />
              <SystemRoute
                path={`/system/${routeByName.clients.root}`}
                component={ClientsLibrary}
              />
              <SystemRoute
                path="/system/packages-library"
                component={PackagesLibrary}
              />
              <SystemRoute
                path={routeByName[EMAIL_TEMPLATE].root}
                propsComponent={{ variant: EMAIL_TEMPLATE }}
                component={MessagesLibrary}
              />
              <SystemRoute
                path={routeByName[CUSTOM_EMAIL_TEMPLATE].root}
                propsComponent={{ variant: CUSTOM_EMAIL_TEMPLATE }}
                component={MessagesLibrary}
              />
              <SystemRoute
                path="/system/help-pages-library"
                component={HelpPagesLibrary}
              />
              <SystemRoute
                path="/system/banners-library"
                component={BannersLibrary}
              />
              {/* Hide the page until further notice */}
              {/* <SystemRoute
              path="/system/channels-library"
              component={ChannelsLibrary}
            /> */}
              <SystemRoute
                path="/system/oem-clients-library"
                component={OEMClientsLibrary}
              />

              <SystemRoute
                path={routeByName[RSSFeed].root}
                propsComponent={{ feature: RSSFeed }}
                component={MediaContentSource}
              />
              <SystemRoute
                path={routeByName[Feeds].root}
                propsComponent={{ feature: Feeds }}
                component={MediaContentSource}
              />
              <SystemRoute
                path={routeByName[DemoFeeds].root}
                propsComponent={{ feature: DemoFeeds }}
                component={MediaContentSource}
              />
              <SystemRoute
                path={routeByName[MediaRSS].root}
                propsComponent={{ feature: MediaRSS }}
                component={MediaContentSource}
              />
              <SystemRoute
                path={routeByName[YouTube].root}
                propsComponent={{ feature: YouTube }}
                component={MediaContentSource}
              />
              <SystemRoute
                path={routeByName[Radio].root}
                propsComponent={{ feature: Radio }}
                component={MediaContentSource}
              />
              <SystemRoute
                path={routeByName[CustomWidget].root}
                propsComponent={{ feature: CustomWidget }}
                component={MediaContentSource}
              />

              <SystemRoute
                path="/system/roles-permissions"
                component={RolesAndPermissions}
              />
              <SystemRoute
                path={routeByName[HTML_CONTENT].root}
                propsComponent={{ variant: HTML_CONTENT }}
                component={HTMLContentLibrary}
              />
              <SystemRoute
                path={routeByName.workplacePoster.root}
                component={WorkplacePostersLibrary}
              />
              <SystemRoute
                path={`/system/${routeByName.device.root}`}
                component={DeviceLibrary}
              />

              <Route
                exact
                path="/"
                render={props => (
                  <Redirect to={getUrlPrefix('dashboard')} {...props} />
                )}
              />
              <Route path="/account-settings" component={AccountSettings} />
              <Route path="/media-library" component={MediaLibrary} />
              <Route path="/report-library" component={ReportsLibrary} />
              <Route path="/font-library" component={FontLibrary} />
              <Route path="/custom-reports/generate" component={CreateReport} />
              <Route path="/custom-report/:id" component={CustomReport} />
              <Route path="/system/tags-library" component={TagsLibrary} />
              <Route exact path="/system" component={AdminDashboard} />
            </div>
            <Footer />
          </div>
        </Fragment>
      )
    }
  )
)

const isLoggedIn = () =>
  !!localStorage.getItem(apiConstants.ORG_USER_TOKEN_NAME) ||
  !!localStorage.getItem(apiConstants.SYSTEM_USER_TOKEN_NAME) ||
  !!localStorage.getItem(apiConstants.ENTERPRISE_USER_TOKEN_NAME)

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        !isLoggedIn() ? (
          <Redirect
            to={{ pathname: '/sign-in', state: { from: props.location } }}
          />
        ) : (
          <Component
            {...props}
            dark={rest.dark}
            handleThemeChange={rest.handleThemeChange}
          />
        )
      }
    />
  )
}

const generateClassName = createGenerateClassName({
  seed: 'xhibit'
})

const App = ({ getGoogleFonts }) => {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    document.body.style.background = theme.palette[theme.type].body.background
    getGoogleFonts()
  }, [getGoogleFonts, theme])

  const MatTheme = createMuiTheme(theme)

  const handleThemeChange = () => {
    const th = theme.type === 'dark' ? 'light' : 'dark'

    localStorage.setItem('theme', th)

    setTheme(
      update(theme, {
        type: { $set: th }
      })
    )
  }

  return (
    <StylesProvider generateClassName={generateClassName}>
      <DndProvider backend={HTML5Backend}>
        <I18nextProvider i18n={i18n}>
          <MuiThemeProvider theme={MatTheme}>
            <SnackbarProvider maxSnack={5}>
              <Router history={history}>
                <Fragment>
                  <CssBaseline />
                  <WhiteLabelProvider />
                  <WindowTitleProvider />

                  <Switch>
                    <UnauthorizedRoute path="/sign-in" component={SignIn} />
                    <UnauthorizedRoute
                      path="/system/sign-in"
                      component={SystemSignIn}
                    />
                    <UnauthorizedRoute
                      path="/enterprise/sign-in"
                      component={EnterpriseSignIn}
                    />
                    <UnauthorizedRoute
                      path="/forgot-password"
                      component={ForgotPassword}
                    />
                    <UnauthorizedRoute
                      path="/password-expired"
                      component={ForgotPassword}
                    />
                    <UnauthorizedRoute
                      path="/password-reset"
                      component={ForgotPassword}
                    />
                    <UnauthorizedRoute
                      path="/login/microsoft"
                      component={MicrosoftLoginProcessing}
                    />
                    <UnauthorizedRoute
                      path="/login/linkedin"
                      component={LinkedInPopUp}
                    />
                    <UnauthorizedRoute
                      path="/access-denied"
                      component={AccessDenied}
                    />

                    <PrivateRoute
                      path="/"
                      component={AppWrapper}
                      dark={theme.type === 'dark'}
                      handleThemeChange={handleThemeChange}
                    />
                  </Switch>
                </Fragment>
              </Router>
            </SnackbarProvider>
          </MuiThemeProvider>
        </I18nextProvider>
      </DndProvider>
    </StylesProvider>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getGoogleFonts
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(App)
