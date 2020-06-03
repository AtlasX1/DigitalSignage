import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { isEmpty } from 'lodash'

import { getItem, postItem, putItem } from 'actions/clientUsersActions'

import {
  FormControlInput,
  FormControlReactSelect,
  FormControlTelInput,
  FormControlSelectWithSearch
} from 'components/Form'
import { SideModal } from 'components/Modal'
import ProfileImage from 'components/ProfileImage'
import FooterLayout from 'components/Modal/FooterLayout'
import ImageUpload from 'components/Pages/Profile/ImageUpload'
import FormControlChips from 'components/Form/FormControlChips'
import FormControlPasswordInput from 'components/Form/FormControlPasswordInput'

import routeByName from 'constants/routes'
import { imageValidateSchema } from 'constants/validations'

import { formDataHelper, selectUtils } from 'utils'
import { checkData } from 'utils/tableUtils'
import queryParamsHelper from 'utils/queryParamsHelper'

import useTagsOptions from 'hooks/tableLibrary/useTagsOptions'
import useClientOptions from 'hooks/tableLibrary/useClientOptions'
import useOrgRoleOptions from 'hooks/tableLibrary/useOrgRoleOptions'
import useEnterpriseRoleOptions from 'hooks/tableLibrary/useEnterpriseRoleOptions'

const styles = () => ({
  wrapContent: {
    padding: '20px 40px',
    height: 'inherit'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '10px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  profileImage: {
    gridRow: 7
  }
})

const AddEditUser = ({
  t,
  item,
  classes,
  putItem,
  getItem,
  postItem,
  match: {
    path,
    params: { id }
  },
  history
}) => {
  const [backup, setBackup] = useState({})

  const orgRoles = useOrgRoleOptions()
  const enterpriseRoles = useEnterpriseRoleOptions()
  const clients = useClientOptions()
  const tags = useTagsOptions()

  const isEdit = useMemo(() => path === routeByName.clientUsers.edit, [path])
  const roles = useMemo(
    () => (isEdit ? [...orgRoles, ...enterpriseRoles] : orgRoles),
    [orgRoles, enterpriseRoles, isEdit]
  )
  const translate = useMemo(
    () => ({
      title: isEdit ? t('Edit Client User') : t('Add New Client User'),
      firstName: t('First Name'),
      lastName: t('Last Name'),
      email: t('Email'),
      phone: t('Phone'),
      password: t('Password'),
      confirmPassword: t('Confirm Password'),
      roleId: t('User Type'),
      tag: t('Create New / Add Tag'),
      client: t('Add to Client')
    }),
    [isEdit, t]
  )

  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      roleId: null,
      clientId: null,
      profile: null,
      tag: []
    },
    validationSchema: isEdit
      ? Yup.object().shape({
          phone: Yup.string()
            .min(10, 'The phone must be min 10 digits in length')
            .max(15, 'The phone must be max 15 digits in length'),
          email: Yup.string().email(),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Enter field'),
          passwordConfirmation: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .oneOf([Yup.ref('password')], 'Not match')
            .required('Enter field'),
          roleId: Yup.number().required('Please select role').nullable(),
          profile: Yup.mixed()
            .test(
              'fileFormat',
              'jpeg, jpg, png only',
              value =>
                isEmpty(value) ||
                ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
            )
            .nullable()
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
          profile: imageValidateSchema,
          roleId: Yup.number().required('Please select role').nullable(),
          clientId: Yup.number().required('Please enter field').nullable()
        }),
    onSubmit: values => {
      const formData = new FormData()
      Object.keys(queryParamsHelper(values)).forEach(
        key => key !== 'tag' && formData.append(key, values[key])
      )
      formDataHelper.createFormDataFromArray(
        formData,
        selectUtils.convertArr(values.tag, selectUtils.fromChipObj),
        'tag'
      )

      if (isEdit) {
        formData.append('_method', 'PUT')
      }
      isEdit ? putItem(id, formData) : postItem(formData)
      history.goBack()
    }
  })

  useEffect(() => {
    if (isEdit) {
      getItem(id)
    }
    // eslint-disable-next-line
  }, [])

  // Handle fetched item
  useEffect(() => {
    if (!isEmpty(item) && isEdit) {
      const {
        firstName,
        lastName,
        phone,
        role: { id: roleId },
        email,
        tag,
        client
      } = item

      setBackup({
        ...form.values,
        firstName,
        lastName,
        phone: checkData(phone, ''),
        email,
        roleId,
        clientId: client ? client.id : null,
        tag: selectUtils.convertArr(tag, selectUtils.toChipObj)
      })
    }
    //eslint-disable-next-line
  }, [item])

  useEffect(() => {
    if (!isEmpty(backup) && isEdit) {
      form.setValues(backup)
    }
    //eslint-disable-next-line
  }, [backup, isEdit])

  const handleClickReset = useCallback(
    () => (isEdit ? form.setValues(backup) : form.resetForm()),
    [backup, form, isEdit]
  )

  return (
    <SideModal
      width="60%"
      title={translate.title}
      closeLink={routeByName.clientUsers.root}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={handleClickReset}
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
            <FormControlSelectWithSearch
              name="clientId"
              options={clients}
              values={form.values.clientId}
              handleChange={form.handleChange}
              formControlContainerClass={classes.stretch}
              label={translate.client}
              error={form.errors.clientId}
              touched={form.touched.clientId}
              marginBottom={16}
            />
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
            <FormControlReactSelect
              label={translate.roleId}
              name="roleId"
              options={roles}
              onChange={form.handleChange}
              values={form.values.roleId}
              error={form.errors.roleId}
              touched={form.touched.roleId}
            />
            <FormControlChips
              name="tag"
              options={tags}
              values={form.values.tag}
              handleChange={form.handleChange}
              formControlContainerClass={classes.stretch}
              fullWidth
              marginBottom={16}
              label={translate.tag}
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
  clientUsers: {
    item: { response: item }
  },
  user: { details }
}) => ({
  item,
  details
})

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
