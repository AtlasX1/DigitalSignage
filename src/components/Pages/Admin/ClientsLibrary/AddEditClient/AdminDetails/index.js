import React, { useEffect, useMemo } from 'react'
import { translate } from 'react-i18next'
import * as Yup from 'yup'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'

import { FormControlInput, FormControlTelInput } from 'components/Form'
import FormControlPasswordInput from 'components/Form/FormControlPasswordInput'
import { Card } from 'components/Card'
import { isEmpty } from 'lodash'
import { ADMIN_DETAILS } from 'constants/clientsConstants'

const styles = ({ palette, type }) => ({
  container: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  }
})

const AdminDetails = ({
  t,
  classes,
  invokeCollector = f => f,
  onFailCollecting = f => f,
  isStartCollecting = false,
  doReset = false,
  afterReset = f => f
}) => {
  const translate = useMemo(
    () => ({
      title: t('Client admin details'),
      firstName: t('First Name'),
      lastName: t('Last Name'),
      email: t('Email'),
      phone: t('Phone'),
      password: t('Password'),
      confirmPassword: t('Confirm Password')
    }),
    [t]
  )

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleReset,
    handleSubmit
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      phone: ''
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required('Enter field'),
      lastName: Yup.string().required('Enter field'),
      email: Yup.string().email().required('Enter field'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Enter field'),
      passwordConfirmation: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .oneOf([Yup.ref('password')], 'Not match')
        .required('Enter field'),
      phone: Yup.string().required('Enter field')
    }),

    onSubmit: values => {
      invokeCollector('adminDetails', { ...values })
    }
  })

  useEffect(() => {
    if (isStartCollecting) {
      handleSubmit()
    }
    // eslint-disable-next-line
  }, [isStartCollecting])

  useEffect(() => {
    if (!isEmpty(errors)) {
      onFailCollecting()
    }
    // eslint-disable-next-line
  }, [errors])

  useEffect(() => {
    if (doReset) {
      handleReset({})
      afterReset(ADMIN_DETAILS)
    }
    // eslint-disable-next-line
  }, [doReset])

  return (
    <Card
      icon={false}
      shadow={false}
      radius={false}
      flatHeader
      title={translate.title}
      rootClassName={classes.bandwidthWrap}
    >
      <form>
        <FormControlInput
          label={translate.firstName}
          placeholder={translate.firstName}
          name="firstName"
          value={values.firstName}
          handleChange={handleChange}
          error={errors.firstName}
          touched={touched.firstName}
          handleBlur={handleBlur}
        />
        <FormControlInput
          label={translate.lastName}
          placeholder={translate.lastName}
          name="lastName"
          handleChange={handleChange}
          value={values.lastName}
          error={errors.lastName}
          touched={touched.lastName}
          handleBlur={handleBlur}
        />
        <FormControlInput
          label={translate.email}
          placeholder={translate.email}
          name="email"
          value={values.email}
          handleChange={handleChange}
          error={errors.email}
          touched={touched.email}
          handleBlur={handleBlur}
        />
        <FormControlTelInput
          label={translate.phone}
          name="phone"
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          touched={touched.phone}
          onBlur={handleBlur}
        />
        <FormControlPasswordInput
          label={translate.password}
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          touched={touched.password}
          onBlur={handleBlur}
        />
        <FormControlPasswordInput
          label={translate.confirmPassword}
          name="passwordConfirmation"
          value={values.passwordConfirmation}
          onChange={handleChange}
          error={errors.passwordConfirmation}
          touched={touched.passwordConfirmation}
          onBlur={handleBlur}
        />
      </form>
    </Card>
  )
}

export default translate('translations')(withStyles(styles)(AdminDetails))
