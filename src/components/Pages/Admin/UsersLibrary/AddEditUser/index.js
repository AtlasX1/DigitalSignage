import React, { useEffect, useMemo, useState, useRef } from 'react'
import { getItem, postItem, putItem } from 'actions/usersActions'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { get as _get } from 'lodash'

import { SideModal } from 'components/Modal'
import {
  FormControlInput,
  FormControlSelect,
  FormControlTelInput
} from 'components/Form'
import FooterLayout from 'components/Modal/FooterLayout'
import ImageUpload from 'components/Pages/Profile/ImageUpload'
import FormControlPasswordInput from 'components/Form/FormControlPasswordInput'
import ProfileImage from 'components/ProfileImage'

import routeByName from 'constants/routes'
import { getUrlPrefix } from 'utils'
import { userRoleLevels } from 'constants/api'
import queryParamsHelper from 'utils/queryParamsHelper'
import {
  imageValidateSchema,
  requiredImageValidateSchema
} from 'constants/validations'
import { checkData } from 'utils/tableUtils'

const styles = () => ({
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
  }
})

const AddEditUser = ({
  t,
  item,
  roles,
  classes,
  putItem,
  getItem,
  postItem,
  postReducer,
  putReducer,
  match: {
    path,
    params: { id }
  },
  history
}) => {
  const [isSubmittingForm, setSubmittingForm] = useState(false)
  const transformedRoles = useMemo(
    () => roles.map(({ displayName: label, id: value }) => ({ label, value })),
    [roles]
  )

  const isEdit = useMemo(() => path === getUrlPrefix(routeByName.users.edit), [
    path
  ])

  const translate = useMemo(
    () => ({
      title: isEdit ? t('Edit User') : t('Add New User'),
      firstName: t('First Name'),
      lastName: t('Last Name'),
      email: t('Email'),
      phone: t('Phone'),
      password: t('Password'),
      confirmPassword: t('Confirm Password'),
      roleId: t('User Type')
    }),
    [isEdit, t]
  )

  useEffect(() => {
    if (isEdit) {
      getItem(id)
    }
    // eslint-disable-next-line
  }, [])

  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      roleId: '',
      profile: null
    },
    validationSchema: isEdit
      ? Yup.object().shape({
          phone: Yup.string()
            .min(10, 'The phone must be min 10 digits in length')
            .max(15, 'The phone must be max 15 digits in length'),
          email: Yup.string().email(),
          password: Yup.string().min(
            6,
            'Password must be at least 6 characters'
          ),
          roleId: Yup.number().required('Please select role').nullable(),
          profile: imageValidateSchema
        })
      : Yup.object().shape({
          firstName: Yup.string().required('Enter field'),
          lastName: Yup.string().required('Enter field'),
          phone: Yup.string()
            .required('Enter field')
            .min(10, 'The phone must be min 10 digits in length')
            .max(15, 'The phone must be max 15 digits in length'),
          email: Yup.string().email().required('Enter field'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Enter field'),
          passwordConfirmation: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .oneOf([Yup.ref('password')], 'Not match')
            .required('Enter field'),
          profile: requiredImageValidateSchema,
          roleId: Yup.number().required('Please select role').nullable()
        }),
    onSubmit: values => {
      if (isSubmittingForm) return

      const formData = new FormData()

      Object.keys(queryParamsHelper(values)).forEach(key =>
        formData.append(key, values[key])
      )
      if (isEdit) {
        formData.append('_method', 'PUT')
      }
      isEdit ? putItem(id, formData) : postItem(formData)
      setSubmittingForm(true)
    }
  })

  const intialFormValues = useRef(form.values)

  // Handle fetched item
  useEffect(() => {
    if (Object.keys(item).length && isEdit) {
      const {
        firstName,
        lastName,
        phone,
        role: { id: roleId },
        email
      } = item

      intialFormValues.current = {
        ...form.values,
        password: '',
        passwordConfirmation: '',
        firstName: checkData(firstName, ''),
        lastName: checkData(lastName, ''),
        phone: checkData(phone, ''),
        email: checkData(email, ''),
        roleId: checkData(roleId, null),
        profile: null
      }

      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (!isSubmittingForm) return
    setSubmittingForm(false)

    const { error, response } = isEdit ? putReducer : postReducer
    if (response && response.status === 'success') {
      history.goBack()
    } else if (error && error.errorFields) {
      const formErrors = error.errorFields.reduce(
        (errors, err) => ({ ...errors, [err.name]: err.value.join(' ') }),
        {}
      )
      form.setErrors(formErrors)
    }
    //eslint-disable-next-line
  }, [postReducer, putReducer])

  return (
    <SideModal
      width="60%"
      title={translate.title}
      closeLink={getUrlPrefix(routeByName.users.root)}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={() => {
            form.setValues(intialFormValues.current)
          }}
          isUpdate={isEdit}
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
            <FormControlPasswordInput
              label={translate.password}
              name="password"
              value={form.values.password}
              error={form.errors.password}
              touched={form.touched.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            <FormControlPasswordInput
              label={translate.confirmPassword}
              name="passwordConfirmation"
              value={form.values.passwordConfirmation}
              error={form.errors.passwordConfirmation}
              touched={form.touched.passwordConfirmation}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
            <FormControlSelect
              label={translate.roleId}
              id="roleId"
              options={transformedRoles}
              handleChange={form.handleChange}
              value={form.values.roleId}
              error={form.errors.roleId}
              touched={form.touched.roleId}
              formControlLabelClass={classes.inputLabel}
            />
            <ProfileImage
              name="profile"
              className={classNames(classes.stretch, classes.profileImage)}
              onChange={form.handleChange}
            />
          </form>
        </Grid>
      </Grid>
    </SideModal>
  )
}

const mapStateToProps = ({
  users: {
    item: { response: item },
    post,
    put
  },
  user: { details: userDetails },
  config: {
    systemRole: { response: systemRoles },
    configOrgRole: { response: orgRoles },
    enterpriseRole: { response: enterpriseRoles }
  }
}) => {
  const level = _get(userDetails, 'response.role.level', '')
  const roles =
    level === userRoleLevels.org
      ? orgRoles
      : level === userRoleLevels.system
      ? systemRoles
      : enterpriseRoles

  return {
    postReducer: post,
    putReducer: put,
    item,
    roles
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      putItem,
      getItem,
      postItem
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(AddEditUser))
  )
)
