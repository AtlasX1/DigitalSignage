import React, { useState, useEffect } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { withStyles, Typography, IconButton } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { withSnackbar } from 'notistack'
import { FormControlInput } from '../../Form'
import { FabBlueButton } from '../../Buttons'
import { resetAction } from 'actions/authenticationActions'

function styles({ palette, type }) {
  return {
    form: {
      width: '569px',
      padding: '0 65px 100px 65px'
    },
    formTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      marginBottom: '15px',
      textAlign: 'center',
      color: palette[type].pages.singIn.color
    },
    formSubTitle: {
      margin: '0 auto 60px auto',
      width: '70%',
      color: palette[type].pages.singIn.subtitle,
      textAlign: 'center'
    },
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
    passwordVisibility: {
      position: 'absolute',
      top: '0px',
      right: '0px',
      padding: '15px'
    },
    formLink: {
      margin: '0 10px'
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
    actionLink: {
      marginTop: '30px',
      width: '100%'
    },
    error: {
      color: 'red',
      marginBottom: '10px'
    }
  }
}

function ExpiredForm({ t, classes, match, resetPassword, resetAction }) {
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
        token
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
              {t('Password has expired title')}
            </Typography>
            <Typography className={classes.formSubTitle}>
              {t('Password has expired subtitle')}
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
            {t('Update My New Password')}
          </FabBlueButton>
        </>
      ) : (
        <header>
          <Typography className={classes.formTitle} gutterBottom>
            {t('Password successfully changed!')}
          </Typography>
        </header>
      )}
    </form>
  )
}

const mapStateToProps = ({ resetPassword }) => ({ resetPassword })

const mapDispatchToProps = dispatch =>
  bindActionCreators({ resetAction }, dispatch)

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  withSnackbar
)(ExpiredForm)
