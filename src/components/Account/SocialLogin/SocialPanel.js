import React, { useState, useCallback, useMemo } from 'react'
import MicrosoftLogin from './MicrosoftLogin'
import GoogleLogin from 'react-google-login'
import LinkedIn from 'react-linkedin-login-oauth2'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Grid, withStyles } from '@material-ui/core'
import { WhiteButton } from '../../Buttons'
import classNames from 'classnames'

import LoginSocialModal from './LoginSocialModal'

import { loginOktaAction } from 'actions/authenticationActions'

const styles = ({ palette, type }) => ({
  socialLogin: {
    marginBottom: '60px'
  },
  socialLoginButton: {
    width: '75px',
    height: '55px'
  },
  socialLoginIcon: {
    fontSize: '2em'
  },
  facebook: {
    color: palette[type].pages.singIn.social.facebook
  },
  linkedIn: {
    color: palette[type].pages.singIn.social.linkedIn
  }
})

const SocialPanel = ({ classes, loginOktaAction, renderOptions }) => {
  const [openModal, setOpenModal] = useState(false)
  const handleOpenModal = useCallback(() => {
    setOpenModal(true)
  }, [setOpenModal])
  const handleGoogleResponse = useCallback(
    (response = {}) => {
      if (response.tokenObj && response.tokenObj.access_token) {
        loginOktaAction({
          provider: 'google',
          token: response.tokenObj.access_token
        })
      }
    },
    [loginOktaAction]
  )
  const handleMicrosoftResponse = useCallback(
    (response = {}) => {
      if (response.access_token) {
        loginOktaAction({ provider: 'graph', token: response.access_token })
      }
    },
    [loginOktaAction]
  )
  const handleLinkedInResponse = useCallback(
    (response = {}) => {
      if (response.code) {
        loginOktaAction({ provider: 'linkedin', code: response.code })
      }
    },
    [loginOktaAction]
  )
  const handleLinkedInError = useCallback(error => {
    console.log(error)
  }, [])
  const renderFacebook = useMemo(() => {
    if (!renderOptions.facebook) return null
    return (
      <Grid item key="login-social-facebook">
        <WhiteButton classes={{ root: classes.socialLoginButton }} disabled>
          <i
            className={classNames(
              classes.facebook,
              classes.socialLoginIcon,
              'mdi mdi-facebook'
            )}
          />
        </WhiteButton>
      </Grid>
    )
  }, [renderOptions, classes])
  const renderMicrosoft = useMemo(() => {
    if (!renderOptions.microsoft) return null
    if (!process.env.REACT_APP_MICROSOFT_CLIENT_ID) return null
    return (
      <Grid item key="login-social-microsoft">
        <MicrosoftLogin
          clientId={process.env.REACT_APP_MICROSOFT_CLIENT_ID}
          redirectUri={`${window.location.origin}/login/microsoft`}
          responseType="token"
          handleLogin={handleMicrosoftResponse}
          btnContent={() => (
            <WhiteButton classes={{ root: classes.socialLoginButton }}>
              <i
                className={classNames(
                  classes.socialLoginIcon,
                  'mdi mdi-microsoft'
                )}
                style={{ color: '#8d30a5' }}
              />
            </WhiteButton>
          )}
        />
      </Grid>
    )
  }, [renderOptions, classes, handleMicrosoftResponse])
  const renderGoogle = useMemo(() => {
    if (!renderOptions.google) return null
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) return null
    return (
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onSuccess={handleGoogleResponse}
        onFailure={handleGoogleResponse}
        cookiePolicy={'single_host_origin'}
        redirectUri={window.location.origin}
        render={renderProps => (
          <Grid item key="login-social-google">
            <WhiteButton
              classes={{ root: classes.socialLoginButton }}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <i
                className={classNames(
                  classes.socialLoginIcon,
                  'mdi mdi-google-plus'
                )}
                style={{ color: '#ed4b2d' }}
              />
            </WhiteButton>
          </Grid>
        )}
      />
    )
  }, [renderOptions, classes, handleGoogleResponse])
  const renderOkta = useMemo(() => {
    if (!renderOptions.okta) return null
    if (!process.env.REACT_APP_OKTA_CLIENT_ID) return null
    return (
      <Grid item key="login-social-okta">
        <WhiteButton
          classes={{ root: classes.socialLoginButton }}
          onClick={handleOpenModal}
        >
          <i
            className={classNames(classes.socialLoginIcon, 'mdi mdi-album')}
            style={{ color: '#90dded' }}
          />
        </WhiteButton>
      </Grid>
    )
  }, [renderOptions, classes, handleOpenModal])
  const renderLinkedIn = useMemo(() => {
    if (!renderOptions.linkedin) return null
    if (!process.env.REACT_APP_LINKEDIN_CLIENT_ID) return null
    return (
      <LinkedIn
        clientId={process.env.REACT_APP_LINKEDIN_CLIENT_ID}
        onFailure={handleLinkedInError}
        onSuccess={handleLinkedInResponse}
        scope="r_liteprofile,r_emailaddress"
        redirectUri={`${window.location.origin}/login/linkedin`}
        renderElement={({ onClick, disabled }) => (
          <Grid item key="login-social-google">
            <WhiteButton
              classes={{ root: classes.socialLoginButton }}
              onClick={onClick}
              disabled={disabled}
            >
              <i
                className={classNames(
                  classes.socialLoginIcon,
                  classes.linkedIn,
                  'mdi mdi-linkedin'
                )}
              />
            </WhiteButton>
          </Grid>
        )}
      >
        Login
      </LinkedIn>
    )
  }, [renderOptions, classes, handleLinkedInError, handleLinkedInResponse])
  return (
    <Grid container justify="space-between" className={classes.socialLogin}>
      {renderFacebook}
      {renderMicrosoft}
      {renderGoogle}
      {renderOkta}
      {renderLinkedIn}
      <LoginSocialModal isOpen={openModal} />
    </Grid>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginOktaAction }, dispatch)

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(null, mapDispatchToProps)
)(SocialPanel)
