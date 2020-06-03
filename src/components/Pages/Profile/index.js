import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { isEmpty } from 'lodash'

import { SideModal } from 'components/Modal'
import { FormControlInput, FormControlTelInput } from 'components/Form'
import { getUrlPrefix } from 'utils'
import FooterLayout from 'components/Modal/FooterLayout'
import ImageUpload from 'components/Pages/Profile/ImageUpload'
import FormControlPasswordInput from 'components/Form/FormControlPasswordInput'
import ProfileImage from 'components/ProfileImage'
import queryParamsHelper from 'utils/queryParamsHelper'
import { putUserDetailsAction } from 'actions/userActions'
import { BlueButton } from 'components/Buttons'
import { checkData } from 'utils/tableUtils'
import { imageValidateSchema } from 'constants/validations'

const styles = ({ palette, type }) => ({
  wrapContent: {
    padding: '20px 40px',
    height: 'inherit'
  },
  inputLabel: {
    fontSize: 18
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '15px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  profileImage: {
    gridRow: 6
  },

  passwordsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    background: palette[type].pages.profile.passwords.background,
    gridColumnGap: '15px',
    padding: 20,
    borderRadius: 5
  }
})

const Profile = ({ t, classes, details, history, putUserDetailsAction }) => {
  const [uploadRef, setUploadRef] = useState(null)
  const [profileKey, setProfileKey] = useState(false)
  const translate = useMemo(
    () => ({
      title: t('Profile Settings'),
      firstName: t('First Name'),
      lastName: t('Last Name'),
      email: t('Email'),
      phone: t('Phone'),
      password: t('Password'),
      confirmPassword: t('Confirm Password'),
      roleId: t('User Type')
    }),
    [t]
  )

  const handleDropzoneRef = useCallback(ref => setUploadRef(ref), [])

  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profile: null
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .min(10, 'The phone must be min 10 digits in length')
        .max(15, 'The phone must be max 15 digits in length')
        .required(),
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email(),
      profile: imageValidateSchema
    }),
    onSubmit: values => {
      const formData = new FormData()

      Object.keys(queryParamsHelper(values)).forEach(key =>
        formData.append(key, values[key])
      )

      putUserDetailsAction(formData)
      history.goBack()
    }
  })

  const intialFormValues = useRef(form.values)

  const passForm = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required('Enter field')
        .min(6, 'Password must be at least 6 characters'),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('password')], 'Not match')
        .required('Enter field')
    }),
    onSubmit: values => {
      putUserDetailsAction(values)
    }
  })

  useEffect(() => {
    if (!isEmpty(details)) {
      const { firstName, lastName, phone, email } = details.response

      intialFormValues.current = {
        firstName,
        lastName,
        phone: checkData(phone, ''),
        email
      }
      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [details])
  return (
    <SideModal
      width="60%"
      title={translate.title}
      closeLink={getUrlPrefix('account-settings')}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={() =>
            form.setValues(intialFormValues.current) &&
            setProfileKey(!profileKey)
          }
        />
      }
    >
      <Grid
        container
        direction="row"
        className={classes.wrapContent}
        spacing={16}
      >
        <Grid item xs={6}>
          <ImageUpload
            name="profile"
            value={form.values.profile}
            onChange={form.handleChange}
            error={form.errors.profile}
            touched={form.touched.profile}
            handleDropzoneRef={handleDropzoneRef}
          />
        </Grid>
        <Grid item xs={6}>
          <form className={classes.grid}>
            <FormControlInput
              label={translate.firstName}
              placeholder={translate.firstName}
              name="firstName"
              value={form.values.firstName}
              error={form.errors.firstName}
              touched={form.touched.firstName}
              handleChange={form.handleChange}
              handleBlur={form.handleBlur}
            />
            <FormControlInput
              label={translate.lastName}
              placeholder={translate.lastName}
              name="lastName"
              value={form.values.lastName}
              error={form.errors.lastName}
              touched={form.touched.lastName}
              handleChange={form.handleChange}
              handleBlur={form.handleBlur}
            />
            <FormControlInput
              label={translate.email}
              placeholder={translate.email}
              name="email"
              value={form.values.email}
              error={form.errors.email}
              touched={form.touched.email}
              handleChange={form.handleChange}
              handleBlur={form.handleBlur}
            />
            <FormControlTelInput
              label={translate.phone}
              name="phone"
              value={form.values.phone}
              error={form.errors.phone}
              touched={form.touched.phone}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            <div
              className={classNames(
                classes.passwordsContainer,
                classes.stretch
              )}
            >
              <FormControlPasswordInput
                id="password"
                fullWidth
                name="password"
                label={t('New Password')}
                value={passForm.values.password}
                error={passForm.errors.password}
                touched={passForm.touched.password}
                handleChange={passForm.handleChange}
                handleBlur={passForm.handleBlur}
              />
              <FormControlPasswordInput
                fullWidth
                name="passwordConfirmation"
                label={t('Confirm Password')}
                value={passForm.values.passwordConfirmation}
                error={passForm.errors.passwordConfirmation}
                touched={passForm.touched.passwordConfirmation}
                handleChange={passForm.handleChange}
                handleBlur={passForm.handleBlur}
              />

              <BlueButton onClick={passForm.submitForm}>
                {t('Update Password')}
              </BlueButton>
            </div>
            <ProfileImage
              key={`profile-${profileKey}`}
              name="profile"
              className={classNames(classes.stretch, classes.profileImage)}
              onChange={form.handleChange}
              onImageUpload={() => uploadRef && uploadRef.current.click()}
            />
          </form>
        </Grid>
      </Grid>
    </SideModal>
  )
}

const mapStateToProps = ({ user: { details } }) => ({
  details
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      putUserDetailsAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(Profile))
  )
)
