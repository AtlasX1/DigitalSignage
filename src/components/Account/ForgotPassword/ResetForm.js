import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles, Typography, Link, IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'

import { FormControlInput } from '../../Form'
import { FabBlueButton } from '../../Buttons'

import { resetAction } from '../../../actions/authenticationActions'
import { Link as RouterLink } from 'react-router-dom'

const styles = theme => {
  const { palette, type } = theme
  return {
    form: {
      width: '569px',
      padding: '0 65px',
      marginBottom: '15px',
      borderBottom: `1px solid ${palette[type].pages.singIn.border}`
    },
    formTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      marginBottom: 100,
      textAlign: 'center',
      color: palette[type].pages.singIn.color
    },
    inputWrap: {
      marginBottom: '16px'
    },
    formControlInput: {
      height: '50px',
      fontSize: '18px'
    },
    formControlContainer: {
      marginBottom: '10px'
    },
    actionLink: {
      marginTop: '30px',
      width: '100%'
    },
    backToText: {
      padding: '40px 0 170px',
      color: '#888996',
      textAlign: 'center'
    },
    error: {
      color: 'red',
      marginBottom: '10px'
    },
    passwordVisibility: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      padding: '15px'
    }
  }
}

const ResetForm = ({ t, match, classes, resetAction, resetPassword }) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false)
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] = useState(
    false
  )
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const form = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required('Enter field')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/,
          'Must Contain 8 Characters, at least one UPPERCASE letter, and at least one number'
        ),
      confirmPassword: Yup.string()
        .required('Enter field')
        .oneOf(
          [Yup.ref('password')],
          'New Password and Confirm Password does not match.'
        )
    }),
    onSubmit: ({ password, confirmPassword }) => {
      const { token, email } = match.params

      setError('')

      const data = {
        password,
        passwordConfirmation: confirmPassword,
        email: decodeURIComponent(email),
        token: token
      }

      resetAction(data)
    }
  })

  useEffect(() => {
    if (resetPassword.response) {
      setSuccess(true)
    } else if (resetPassword.error) {
      if (resetPassword.error.errors && resetPassword.error.errors.length) {
        setError(resetPassword.error.errors[0])
      } else if (resetPassword.error.message) {
        setError(resetPassword.error.message)
      }
    }
  }, [resetPassword])

  return (
    <form className={classes.form} onSubmit={form.handleSubmit}>
      {!success ? (
        <>
          <header>
            <Typography className={classes.formTitle} gutterBottom>
              {t('Reset Password')}
            </Typography>
          </header>
          <div className={classes.inputWrap}>
            {error && (
              <Typography className={classes.error}>{error}</Typography>
            )}
            <FormControlInput
              id="password"
              name="password"
              type={passwordVisibility ? 'text' : 'password'}
              value={form.values.password}
              handleChange={form.handleChange}
              error={form.errors.password}
              touched={form.touched.password}
              placeholder={t('New Password')}
              formControlInputClass={classes.formControlInput}
              formControlContainerClass={classes.formControlContainer}
              fullWidth
              icon={
                <IconButton
                  className={classes.passwordVisibility}
                  onClick={() => setPasswordVisibility(!passwordVisibility)}
                >
                  {passwordVisibility ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
              }
            />
            <FormControlInput
              id="confirmPassword"
              name="confirmPassword"
              type={confirmPasswordVisibility ? 'text' : 'password'}
              value={form.values.confirmPassword}
              placeholder={t('Confirm Password')}
              formControlInputClass={classes.formControlInput}
              formControlContainerClass={classes.formControlContainer}
              handleChange={form.handleChange}
              error={form.errors.confirmPassword}
              touched={form.touched.confirmPassword}
              fullWidth
              icon={
                <IconButton
                  className={classes.passwordVisibility}
                  onClick={() =>
                    setConfirmPasswordVisibility(!confirmPasswordVisibility)
                  }
                >
                  {confirmPasswordVisibility ? (
                    <Visibility fontSize="small" />
                  ) : (
                    <VisibilityOff fontSize="small" />
                  )}
                </IconButton>
              }
            />
          </div>
          <FabBlueButton
            className={classes.actionLink}
            variant="extended"
            type="submit"
          >
            {t('Submit')}
          </FabBlueButton>
        </>
      ) : (
        <header>
          <Typography className={classes.formTitle} gutterBottom>
            {t('Password successfully changed!')}
          </Typography>
        </header>
      )}
      <Typography className={classes.backToText}>
        {t('Back to')}{' '}
        <Link
          to="/sign-in"
          component={RouterLink}
          className={classes.backToLink}
        >
          {t('Sign In')}
        </Link>
      </Typography>
    </form>
  )
}

ResetForm.propTypes = {
  classes: PropTypes.object,
  resetAction: PropTypes.func,
  resetPassword: PropTypes.object
}

const mapStateToProps = ({ resetPassword }) => ({ resetPassword })

const mapDispatchToProps = dispatch =>
  bindActionCreators({ resetAction }, dispatch)

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ResetForm))
)
