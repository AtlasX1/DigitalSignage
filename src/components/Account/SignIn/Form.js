import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, Link, Typography, withStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, Redirect, withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import { useFormik } from 'formik'
import { compose } from 'redux'
import { get as _get } from 'lodash'
import classNames from 'classnames'
import * as Yup from 'yup'
import { FormControlInput } from 'components/Form'
import { CheckboxSwitcher } from 'components/Checkboxes'
import SubmitButton from './SubmitButton'
import PasswordVisibilityButton from './PasswordVisibilityButton'
import { clearLoginInfo, loginUserAction } from 'actions/authenticationActions'
import { isEqual, isFalsy, takeTruth } from 'utils/generalUtils'
import { setToken } from 'utils/index'
import { apiConstants } from 'constants/index'
import snackbar from 'hooks/useCustomSnackbar'

function styles() {
  return {
    inputWrap: {
      position: 'relative',
      marginBottom: '16px'
    },
    formControlInput: {
      height: '50px',
      fontSize: '18px'
    },
    formControlContainer: {
      marginBottom: '10px'
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
    }
  }
}

function getRedirectRoute(userType) {
  switch (userType) {
    case apiConstants.SYSTEM_USER:
      return '/system/dashboard'
    case apiConstants.userRoleLevels.enterprise:
      return '/enterprise/dashboard'
    default:
      return '/org/dashboard'
  }
}

const formConfig = {
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
  })
}

const { initialValues, validationSchema } = formConfig

function Form({
  t,
  classes,
  isIpVisible,
  userType,
  enqueueSnackbar,
  closeSnackbar,
  location
}) {
  const dispatch = useDispatch()
  const login = useSelector(({ login }) => login)
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const showSnackbar = useMemo(() => {
    return snackbar(t, enqueueSnackbar, closeSnackbar)
  }, [t, enqueueSnackbar, closeSnackbar])

  const passwordInputType = useMemo(() => {
    return passwordVisibility ? 'text' : 'password'
  }, [passwordVisibility])

  const form = useFormik({
    initialValues,
    validationSchema,
    onSubmit: ({ username, password }) => {
      setLoading(true)
      dispatch(loginUserAction({ username, password, type: userType }))
    }
  })
  const { values, touched, errors, handleChange, handleSubmit } = form

  useEffect(() => {
    const { response, error } = login
    if (response) {
      localStorage.removeItem('originalUsers')
      const { accessToken, tokenType, expiresIn } = response

      const system = isEqual(userType, apiConstants.SYSTEM_USER)
      const enterprise = isEqual(
        userType,
        apiConstants.userRoleLevels.enterprise
      )

      const name = system
        ? apiConstants.SYSTEM_USER_TOKEN_NAME
        : enterprise
        ? apiConstants.ENTERPRISE_USER_TOKEN_NAME
        : apiConstants.ORG_USER_TOKEN_NAME

      setToken(name, tokenType, accessToken, expiresIn)
      dispatch(clearLoginInfo())
      setLoading(false)
      setSuccess(true)
    }
    if (error) {
      const { message } = error
      setLoading(false)
      showSnackbar(takeTruth(message, 'Error'))
      dispatch(clearLoginInfo())
    }
    // eslint-disable-next-line
  }, [login])

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisibility(prevState => isFalsy(prevState))
  }, [setPasswordVisibility])

  if (success) {
    return (
      <Redirect to={_get(location, 'state.from', getRedirectRoute(userType))} />
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.inputWrap}>
        <FormControlInput
          id="username"
          type="text"
          value={values.username}
          handleChange={handleChange}
          error={errors.username}
          touched={touched.username}
          placeholder={t('Email')}
          formControlInputClass={classes.formControlInput}
          formControlContainerClass={classes.formControlContainer}
          fullWidth
        />
      </div>
      <div className={classes.inputWrap}>
        <FormControlInput
          id="password"
          type={passwordInputType}
          value={values.password}
          handleChange={handleChange}
          error={errors.password}
          touched={touched.password}
          placeholder={t('Password')}
          formControlInputClass={classes.formControlInput}
          formControlContainerClass={classes.formControlContainer}
          fullWidth
        />
        <PasswordVisibilityButton
          onClick={togglePasswordVisibility}
          isVisible={passwordVisibility}
        />
        <Link
          to="/forgot-password"
          component={RouterLink}
          className={classNames(classes.formLink, classes.forgotPassLink)}
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
          [classes.submitWrap]: isFalsy(isIpVisible),
          [classes.submitWrapWithIp]: isIpVisible
        })}
      >
        <Grid item>
          <SubmitButton isLoading={isLoading} />
        </Grid>
        <Grid item>
          <CheckboxSwitcher
            label={t('Remember me')}
            formControlLabelClass={classes.checkboxSwitcherLabel}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles),
  withRouter,
  withSnackbar
)(Form)
