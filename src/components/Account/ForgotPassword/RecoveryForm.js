import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link as RouterLink } from 'react-router-dom'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles, Typography, Link } from '@material-ui/core'
import { FormControlInput } from '../../Form'
import { FabBlueButton } from '../../Buttons'

import { recoveryAction } from '../../../actions/authenticationActions'

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
      marginBottom: '15px',
      textAlign: 'center',
      color: palette[type].pages.singIn.color
    },
    formSubTitle: {
      marginBottom: '95px',
      color: palette[type].pages.singIn.color,
      textAlign: 'center'
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
    backToLink: {
      color: '#0076b9'
    }
  }
}

const RecoveryForm = ({ t, classes, recoveryAction }) => {
  const form = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('Enter field').email('Must be an email')
    }),
    onSubmit: ({ email }) => {
      recoveryAction(email)
    }
  })

  return (
    <form className={classes.form} onSubmit={form.handleSubmit}>
      <header>
        <Typography className={classes.formTitle} gutterBottom>
          {t('Forgot your password title')}
        </Typography>
        <Typography className={classes.formSubTitle}>
          {t('Forgot your password subtitle')}
        </Typography>
      </header>
      <div className={classes.inputWrap}>
        <FormControlInput
          id="email"
          type="text"
          value={form.values.email}
          handleChange={form.handleChange}
          error={form.errors.email}
          touched={form.touched.email}
          placeholder={t('Email')}
          formControlInputClass={classes.formControlInput}
          formControlContainerClass={classes.formControlContainer}
          fullWidth
        />
      </div>
      <FabBlueButton
        className={classes.actionLink}
        variant="extended"
        type="submit"
      >
        {t('Request reset link action')}
      </FabBlueButton>

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

RecoveryForm.propTypes = {
  recoveryAction: PropTypes.func
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ recoveryAction }, dispatch)

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToProps)(RecoveryForm))
)
