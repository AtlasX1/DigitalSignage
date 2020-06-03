import React, { useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import { isEmpty } from 'lodash'
import * as Yup from 'yup'

import { AccountInfoWithStatus } from 'components/Account'
import { Card } from 'components/Card'
import { CheckboxSwitcher } from 'components/Checkboxes'
import {
  FormControlCountrySelect,
  FormControlInput,
  FormControlSelect,
  FormControlTelInput
} from 'components/Form'
import FormControlChips from 'components/Form/FormControlChips'
import entityGroupsConstants from 'constants/entityGroupsConstants'
import useTagsOptions from 'hooks/tableLibrary/useTagsOptions'
import useGroupsOptions from 'hooks/tableLibrary/useGroupsOptions'
import useClientTypeOptions from 'hooks/tableLibrary/useClientTypeOptions'
import { CLIENT_DETAILS } from 'constants/clientsConstants'
import { checkData } from 'utils/tableUtils'

const styles = ({ palette, type }) => ({
  clientDetailCardRoot: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '15px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  label: {
    fontSize: 16
  }
})

const ClientDetails = ({
  classes,
  item,
  isEdit = false,
  className,
  t,
  invokeCollector = f => f,
  onFailCollecting = f => f,
  isStartCollecting = false,
  doReset = false,
  afterReset = f => f
}) => {
  const [backup, setBackup] = useState({})
  const tags = useTagsOptions()
  const groups = useGroupsOptions(entityGroupsConstants.Client)
  const clientTypes = useClientTypeOptions()

  const translate = useMemo(
    () => ({
      isUniqueClient: t('Unique Client'),
      uniqueClientDescription: t('Reason for Unique Client'),
      name: t('Client Name'),
      address: t('Address'),
      state: t('State'),
      zip: t('Zip'),
      city: t('City'),
      country: t('Country'),
      phoneNo1: t('Phone'),
      phoneNo2: t('Phone 2'),
      groups: t('Create New / Add Group'),
      tags: t('Create New / Add Tag'),
      clientTypeId: t('Client Type')
    }),
    [t]
  )

  const form = useFormik({
    initialValues: {
      isUniqueClient: false,
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phoneNo1: '',
      phoneNo2: '',
      clientTypeId: '',
      uniqueClientDescription: '',
      status: 'Active',
      group: [],
      tag: []
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Enter field'),
      address1: Yup.string().required('Enter field'),
      city: Yup.string().required('Enter field'),
      state: Yup.string().required('Enter field'),
      country: Yup.string().required('Enter field'),
      phoneNo1: Yup.string()
        .required('Enter field')
        .min(10, 'The phone must be min 10 digits in length')
        .max(15, 'The phone must be max 15 digits in length'),
      phoneNo2: Yup.string()
        .min(10, 'The phone must be min 10 digits in length')
        .max(15, 'The phone must be max 15 digits in length'),
      zipCode: Yup.string().required('Enter field'),
      uniqueClientDescription: Yup.string().required('Enter field'),
      clientTypeId: Yup.number().required('Enter field')
    }),
    onSubmit: values => {
      const tag = values.tag.map(({ value: id, label: title }) => ({
        id,
        title
      }))
      const group = values.group.map(({ value: id, label: title }) => ({
        id,
        title
      }))

      invokeCollector(CLIENT_DETAILS, { ...values, group, tag })
    }
  })

  useEffect(() => {
    if (isStartCollecting) {
      form.handleSubmit()
    }
    // eslint-disable-next-line
  }, [isStartCollecting])

  useEffect(() => {
    if (doReset) {
      // console.log({ backup, });
      if (isEdit) {
        form.setValues(backup)
      } else {
        form.resetForm()
      }

      afterReset(CLIENT_DETAILS)
    }
    // eslint-disable-next-line
  }, [doReset])

  useEffect(() => {
    if (!isEmpty(form.errors)) {
      onFailCollecting()
    }
    // eslint-disable-next-line
  }, [form.errors])

  useEffect(() => {
    if (!isEmpty(backup)) {
      form.setValues(backup)
    }
    // eslint-disable-next-line
  }, [backup])

  useEffect(() => {
    if (!isEmpty(item) && isEdit) {
      const {
        name,
        address1,
        address2,
        city,
        state,
        country,
        zipCode,
        phoneNo1,
        phoneNo2,
        type: { id: clientTypeId },
        isUniqueClient,
        uniqueClientDescription,
        status,
        group,
        tag
      } = item
      setBackup({
        name: checkData(name, ''),
        address1: checkData(address1, ''),
        address2: checkData(address2, ''),
        city: checkData(city, ''),
        state: checkData(state, ''),
        country: checkData(country, ''),
        zipCode: checkData(zipCode, ''),
        phoneNo1: checkData(phoneNo1, ''),
        phoneNo2: checkData(phoneNo2, ''),
        clientTypeId: checkData(clientTypeId, ''),
        isUniqueClient: checkData(isUniqueClient, ''),
        uniqueClientDescription: checkData(uniqueClientDescription, ''),
        status: checkData(status, ''),
        group: group
          ? group.map(({ id: value, title: label }) => ({ value, label }))
          : [],
        tag: tag
          ? tag.map(({ id: value, title: label }) => ({ value, label }))
          : []
      })
    }
    // eslint-disable-next-line
  }, [item, isEdit])

  return (
    <div className={className}>
      <AccountInfoWithStatus
        accountStatus={form.values.status}
        userName={form.values.name}
        // imgSrc={userPicture}
      />
      <Card
        icon={false}
        dropdown={false}
        grayHeader
        hasMargin={false}
        shadow={false}
        radius={false}
        headerClasses={[classes.stretch]}
        title={t('Client Details').toUpperCase()}
        rootClassName={classes.clientDetailCardRoot}
      >
        <CheckboxSwitcher
          name="isUniqueClient"
          value={form.values.isUniqueClient}
          handleChange={form.handleChange}
          label={translate.isUniqueClient}
        />
        <FormControlInput
          placeholder={translate.uniqueClientDescription}
          formControlContainerClass={classes.stretch}
          name="uniqueClientDescription"
          fullWidth
          multiline
          rows={10}
          value={form.values.uniqueClientDescription}
          handleChange={form.handleChange}
          error={form.errors.uniqueClientDescription}
          handleBlur={form.handleBlur}
          touched={form.touched.uniqueClientDescription}
        />
        <FormControlInput
          label={translate.name}
          name="name"
          value={form.values.name}
          handleChange={form.handleChange}
          fullWidth
          formControlContainerClass={classes.stretch}
          error={form.errors.name}
          handleBlur={form.handleBlur}
          touched={form.touched.name}
        />
        <FormControlInput
          name="address1"
          value={form.values.address1}
          handleChange={form.handleChange}
          fullWidth
          label={translate.address}
          formControlContainerClass={classes.stretch}
          error={form.errors.address1}
          handleBlur={form.handleBlur}
          touched={form.touched.address1}
        />
        <FormControlInput
          name="address2"
          value={form.values.address2}
          handleChange={form.handleChange}
          fullWidth
          formControlContainerClass={classes.stretch}
        />
        <FormControlInput
          name="state"
          value={form.values.state}
          handleChange={form.handleChange}
          fullWidth
          label={translate.state}
          error={form.errors.state}
          handleBlur={form.handleBlur}
          touched={form.touched.state}
        />
        <FormControlInput
          name="zipCode"
          value={form.values.zipCode}
          handleChange={form.handleChange}
          fullWidth
          label={translate.zip}
          error={form.errors.zip}
          handleBlur={form.handleBlur}
          touched={form.touched.zip}
        />
        <FormControlInput
          name="city"
          value={form.values.city}
          handleChange={form.handleChange}
          fullWidth
          label={translate.city}
          error={form.errors.city}
          handleBlur={form.handleBlur}
          touched={form.touched.city}
        />
        <FormControlCountrySelect
          label={translate.country}
          name="country"
          value={form.values.country}
          handleChange={form.handleChange}
        />
        <FormControlTelInput
          label={translate.phoneNo1}
          name="phoneNo1"
          value={form.values.phoneNo1}
          onChange={form.handleChange}
          error={form.errors.phoneNo1}
          onBlur={form.handleBlur}
          touched={form.touched.phoneNo1}
        />
        <FormControlTelInput
          label={translate.phoneNo2}
          name="phoneNo2"
          value={form.values.phoneNo2}
          onChange={form.handleChange}
          error={form.errors.phoneNo2}
          onBlur={form.handleBlur}
          touched={form.touched.phoneNo2}
        />
        <FormControlSelect
          label={translate.clientTypeId}
          name="clientTypeId"
          formControlContainerClass={classes.stretch}
          formControlLabelClass={classes.label}
          options={clientTypes}
          value={form.values.clientTypeId}
          handleChange={form.handleChange}
          error={form.errors.clientTypeId}
          onBlur={form.handleBlur}
          touched={form.touched.clientTypeId}
        />
        <FormControlChips
          name="group"
          values={form.values.group}
          options={groups}
          handleChange={form.handleChange}
          formControlContainerClass={classes.stretch}
          fullWidth
          label={translate.groups}
        />
        <FormControlChips
          name="tag"
          options={tags}
          values={form.values.tag}
          handleChange={form.handleChange}
          formControlContainerClass={classes.stretch}
          fullWidth
          marginBottom={0}
          label={translate.tags}
        />
      </Card>
    </div>
  )
}

const mapStateToProps = ({
  clients: {
    item: { response: item }
  }
}) => ({
  item
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(ClientDetails))
)
