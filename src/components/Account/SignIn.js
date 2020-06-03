import React, { useEffect, useState, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link as RouterLink, Redirect } from 'react-router-dom'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  withStyles,
  Grid,
  Link,
  Typography,
  IconButton,
  Button
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { withSnackbar } from 'notistack'
import { useIpAddress } from 'hooks'

import { loginUserAction, clearLoginInfo } from 'actions/authenticationActions'
import { setToken, whiteLabelUtils } from '../../utils'

import { FormControlInput } from '../Form'
import { CheckboxSwitcher } from '../Checkboxes'
import { FabBlueButton } from '../Buttons'

import { apiConstants } from '../../constants'

import BackgroundImage from '../../common/assets/images/sign-in.jpg'

import SocialPanel from './SocialLogin/SocialPanel'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      position: 'relative',
      overflow: 'hidden',
      width: '100vw',
      height: '100vh',
      background: `url("${BackgroundImage}") no-repeat`,
      backgroundSize: 'cover',

      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        backgroundImage: 'linear-gradient(#00e7c1, #00d0e6)'
      },

      '&::before': {
        top: 0,
        left: '-100%',
        right: '70%',
        bottom: 0,
        transform: 'skewX(20deg)'
      },

      '&::after': {
        top: '-10%',
        right: 0,
        width: '400px',
        height: '50%',
        opacity: '.8',
        transform: 'skewX(70deg)'
      },
      '&$systemView': {
        backgroundImage: 'none'
      }
    },
    systemView: {
      backgroundColor: '#121212'
    },
    formWrap: {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      left: '120px',
      zIndex: 2,
      width: '640px',
      padding: '95px 35px 25px',
      background: palette[type].pages.singIn.background,
      transform: 'translateY(-50%)'
    },
    form: {
      width: '569px',
      padding: '0 65px',
      marginBottom: '15px',
      borderBottom: `1px solid ${palette[type].pages.singIn.border}`
    },
    logoImage: {
      width: '104px',
      height: '32px',
      marginBottom: '120px'
    },
    formTitle: {
      fontWeight: 'bold',
      marginBottom: '55px',
      color: palette[type].pages.singIn.color
    },
    inputWrap: {
      position: 'relative',
      marginBottom: '16px'
    },
    formControlInput: {
      height: '50px',
      fontSize: '18px'
    },
    passwordVisibility: {
      position: 'absolute',
      top: '3px',
      right: '130px'
    },
    forgotPassLink: {
      position: 'absolute',
      top: '16px',
      right: '12px'
    },
    checkboxSwitcherLabel: {
      fontSize: '14px'
    },
    submitWrap: {
      marginBottom: '80px'
    },
    submitWrapWithIp: {
      marginBottom: '30px'
    },
    formLink: {
      margin: '0 10px',
      display: 'inline-block',
      textDecoration: 'none'
    },
    formLinkText: {
      fontSize: '13px',
      color: '#0076b9'
    },
    footerGrid: {
      marginBottom: '35px'
    },
    footerText: {
      color: '#888996',
      textAlign: 'center'
    },
    formControlContainer: {
      marginBottom: '10px'
    },
    footerLink: {
      display: 'inline-block',
      color: '#0076b9',
      textDecoration: 'none'
    },
    ipAddress: {
      marginBottom: '30px',
      color: '#74809a'
    }
  }
}

const SignIn = ({
  t,
  classes,
  login,
  enqueueSnackbar,
  userType,
  title,
  displayIp,
  ...props
}) => {
  const [whiteLabelReducer] = useSelector(state => [state.whiteLabel])
  const [success, setSuccess] = useState(false)
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const whiteLabelInfo = useMemo(() => {
    return whiteLabelUtils.parseReducer(whiteLabelReducer)
  }, [whiteLabelReducer])

  const ipAddress = useIpAddress()

  const form = useFormik({
    initialValues: {
      username: 'ui2019ver3@mvixusa.com',
      password: 'Newui@2019'
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required('Enter field').email('Must be an email'),
      password: Yup.string()
        .required('Enter field')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
          'Must Contain 8 Characters, at least one UPPERCASE letter, and at least one number'
        )
    }),
    onSubmit: ({ username, password }) => {
      props.loginUserAction({ username, password, type: userType })
    }
  })

  const getRedirectRoute = useCallback(() => {
    switch (userType) {
      case apiConstants.SYSTEM_USER:
        return '/system/dashboard'
      case apiConstants.userRoleLevels.enterprise:
        return '/enterprise/dashboard'
      default:
        return '/org/dashboard'
    }
  }, [userType])

  const { from } = props.location.state || {
    from: {
      pathname: getRedirectRoute()
    }
  }

  useEffect(() => {
    if (login.response) {
      localStorage.removeItem('originalUsers')
      const { accessToken, tokenType, expiresIn } = login.response

      const system = userType === apiConstants.SYSTEM_USER
      const enterprise = userType === apiConstants.userRoleLevels.enterprise

      const name = system
        ? apiConstants.SYSTEM_USER_TOKEN_NAME
        : enterprise
        ? apiConstants.ENTERPRISE_USER_TOKEN_NAME
        : apiConstants.ORG_USER_TOKEN_NAME

      setToken(name, tokenType, accessToken, expiresIn)
      props.clearLoginInfo()
      setSuccess(true)
    } else if (login.error) {
      if (login.error.message) {
        enqueueSnackbar(login.error.message, {
          variant: 'default',
          action: (
            <Button color="secondary" size="small">
              {t('OK')}
            </Button>
          )
        })
      }
    }
    // eslint-disable-next-line
  }, [login])

  const isIpVisible = Boolean(displayIp && ipAddress)

  return (
    <div
      className={classNames(classes.root, {
        [classes.systemView]: userType === apiConstants.SYSTEM_USER
      })}
    >
      <div className={classes.formWrap}>
        <form className={classes.form} onSubmit={form.handleSubmit}>
          <header>
            <img
              className={classes.logoImage}
              src={whiteLabelInfo.headerLogo}
              alt="Logo"
            />
            {success && <Redirect to={from} />}
            <Typography className={classes.formTitle} variant="h2" gutterBottom>
              {t(title)}
            </Typography>
          </header>
          <div className={classes.inputWrap}>
            <FormControlInput
              id="username"
              type="text"
              value={form.values.username}
              handleChange={form.handleChange}
              error={form.errors.username}
              touched={form.touched.username}
              placeholder={t('Email')}
              formControlInputClass={classes.formControlInput}
              formControlContainerClass={classes.formControlContainer}
              fullWidth
            />
          </div>
          <div className={classes.inputWrap}>
            <FormControlInput
              id="password"
              type={passwordVisibility ? 'text' : 'password'}
              value={form.values.password}
              handleChange={form.handleChange}
              error={form.errors.password}
              touched={form.touched.password}
              placeholder={t('Password')}
              formControlInputClass={classes.formControlInput}
              formControlContainerClass={classes.formControlContainer}
              fullWidth
            />
            {form.values.password !== '' ? (
              <IconButton
                className={classes.passwordVisibility}
                onClick={() => setPasswordVisibility(!passwordVisibility)}
              >
                {passwordVisibility ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            ) : null}
            <Link
              to="/forgot-password"
              component={RouterLink}
              className={[classes.formLink, classes.forgotPassLink].join(' ')}
            >
              <Typography className={classes.formLinkText}>
                {t('Forgot Password?')}
              </Typography>
            </Link>
          </div>
          <Grid
            container
            justify="space-between"
            className={classNames({
              [classes.submitWrap]: !isIpVisible,
              [classes.submitWrapWithIp]: isIpVisible
            })}
          >
            <Grid item>
              <FabBlueButton type="submit" variant="extended">
                {t('Sign In')}
              </FabBlueButton>
            </Grid>
            <Grid item>
              <CheckboxSwitcher
                label={t('Remember me')}
                formControlLabelClass={classes.checkboxSwitcherLabel}
              />
            </Grid>
          </Grid>
          {isIpVisible && (
            <Grid item>
              <Typography align="center" className={classes.ipAddress}>
                {t('Your IP address is being logged as', { IP: ipAddress })}
              </Typography>
            </Grid>
          )}
          <SocialPanel renderOptions={whiteLabelInfo.sso} />
        </form>
        <footer>
          <Grid container justify="center" className={classes.footerGrid}>
            <Grid item>
              <a
                href={whiteLabelInfo.privacyPolicy.link}
                className={classes.formLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography className={classes.formLinkText}>
                  {t('Privacy Policy footer link')}
                </Typography>
              </a>
            </Grid>
            <Grid item>
              <a
                href={whiteLabelInfo.termsCondition.link}
                className={classes.formLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography className={classes.formLinkText}>
                  {t('Term and Conditions footer link')}
                </Typography>
              </a>
            </Grid>
            <Grid item>
              <a
                href={whiteLabelInfo.aboutPage.link}
                className={classes.formLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Typography className={classes.formLinkText}>
                  {t('About Mvix footer link')}
                </Typography>
              </a>
            </Grid>
          </Grid>
          <Typography className={classes.footerText}>
            If you have any e-Learning queries, please feel free to contact the
            e-Learning team on
            <Link href="tel:+18663104923">+1 866.310.4923</Link> or
            alternatively email us on{' '}
            <a
              className={classes.footerLink}
              href={whiteLabelInfo.helpPage}
              target="_blank"
              rel="noopener noreferrer"
            >
              support.mvixusa.com
            </a>
          </Typography>
        </footer>
      </div>
    </div>
  )
}

SignIn.propTypes = {
  userType: PropTypes.string,
  enqueueSnackbar: PropTypes.func,
  title: PropTypes.string,
  displayIp: PropTypes.bool
}

SignIn.defaultProps = {
  title: 'Login',
  displayIp: false
}

const mapStateToProps = ({ login }) => ({ login })

const mapDispatchToProps = dispatch =>
  bindActionCreators({ loginUserAction, clearLoginInfo }, dispatch)

export default translate('translations')(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(withSnackbar(SignIn))
  )
)
