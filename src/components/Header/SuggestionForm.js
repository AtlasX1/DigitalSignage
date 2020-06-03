import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { withSnackbar } from 'notistack'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { withStyles, Grid, Typography, Button } from '@material-ui/core'

import { BlueButton } from '../Buttons'

import { FormControlInput } from '../Form'

import { CheckboxSwitcher } from '../Checkboxes'

import { postData, clearPostData } from '../../actions/feedbackActions'

const styles = ({ palette, type, typography }) => {
  return {
    container: {
      width: '100%',
      height: '100%',
      padding: '45px 37px'
    },
    title: {
      fontSize: 22,
      letterSpacing: '-0.02px',
      color: palette[type].suggestionBox.title,
      fontWeight: 'bold',
      marginBottom: 14
    },
    subtitle: {
      fontSize: 14,
      letterSpacing: '-0.02px',
      color: palette[type].suggestionBox.subtitle,
      marginBottom: 26
    },
    textarea: {
      width: '100%',
      height: 216,
      background: palette[type].formControls.input.background,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].formControls.input.border,
      color: palette[type].formControls.input.color,
      borderRadius: 4,
      resize: 'none',
      padding: '17px 15px',
      fontFamily: typography.fontFamily,
      marginBottom: 21
    },
    textareaError: {
      borderColor: 'red'
    },
    switchContainer: {
      marginBottom: 10
    },
    switchRoot: {
      width: 36
    },
    switchBase: {
      width: 20
    },
    note: {
      fontSize: 12,
      color: '#067DC0',
      fontWeight: 'bold',
      marginBottom: 20
    },
    button: {
      width: 142,
      height: 40
    }
  }
}

const SuggestionForm = ({
  t,
  post,
  classes,
  postData,
  closeSnackbar,
  clearPostData,
  enqueueSnackbar
}) => {
  const form = useFormik({
    initialValues: {
      subject: '',
      message: '',
      agreed: false
    },
    validationSchema: Yup.object().shape({
      subject: Yup.string().required(),
      message: Yup.string().required()
    }),
    onSubmit: values => {
      if (values.agreed) {
        postData({
          subject: values.subject,
          message: values.message
        })
      } else {
        form.setFieldError('agreed', 'error')
      }
    }
  })

  useEffect(() => {
    if (post.response) {
      enqueueSnackbar(t('Successfully sent'), {
        variant: 'default',
        action: key => (
          <Button
            color="secondary"
            size="small"
            onClick={() => closeSnackbar(key)}
          >
            {t('OK')}
          </Button>
        )
      })

      form.resetForm()
      clearPostData()
    } else if (post.error) {
      const err = post.error.errors[0] ? post.error.errors[0][0] : ''

      if (err) {
        enqueueSnackbar(err, {
          variant: 'default',
          action: key => (
            <Button
              color="secondary"
              size="small"
              onClick={() => closeSnackbar(key)}
            >
              {t('OK')}
            </Button>
          )
        })
      }
      clearPostData()
    }
    //eslint-disable-next-line
  }, [post])

  const handleAgreedChange = () => {
    form.setFieldValue('agreed', !form.values.agreed, false)
    if (form.errors.agreed) form.setFieldError('agreed', null)
  }

  return (
    <Grid container direction="column" className={classes.container}>
      <Typography className={classes.title}>{t('Suggestion Box')}</Typography>

      <Typography className={classes.subtitle}>
        {t(
          "This form is for product feedback and feature requests only - not technical support. If you're having an issue and need technical support, please visit our Support Center."
        )}
      </Typography>

      <FormControlInput
        fullWidth
        placeholder={t('Subject')}
        name="subject"
        value={form.values.subject}
        handleChange={form.handleChange}
        showErrorText={false}
        error={form.errors.subject}
        touched={form.touched.subject}
      />

      <textarea
        className={[
          classes.textarea,
          form.errors.message && form.touched.message
            ? classes.textareaError
            : ''
        ].join(' ')}
        placeholder={t('Message')}
        name="message"
        value={form.values.message}
        onChange={form.handleChange}
      />

      <CheckboxSwitcher
        switchRootClass={classes.switchRoot}
        switchBaseClass={classes.switchBase}
        switchContainerClass={classes.switchContainer}
        label={t('I confirm this is not a technical support request')}
        labelPlacement="end"
        value={form.values.agreed}
        handleChange={handleAgreedChange}
        error={form.errors.agreed}
      />

      <Typography className={classes.note}>
        {t('NOTE') +
          ': ' +
          t(
            'This form is not actively monitored and you will not receive an email reply.'
          )}
      </Typography>

      <BlueButton className={classes.button} onClick={form.submitForm}>
        {t('Send Message')}
      </BlueButton>
    </Grid>
  )
}

SuggestionForm.propTypes = {
  classes: PropTypes.object.isRequired,
  post: PropTypes.object,
  putData: PropTypes.func,
  clearPutData: PropTypes.func
}

const mapStateToProps = ({ feedback }) => ({
  post: feedback.post
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      postData,
      clearPostData
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(SuggestionForm))
  )
)
