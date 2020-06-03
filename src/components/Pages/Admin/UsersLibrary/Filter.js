import React, { useMemo, useEffect } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import { connect } from 'react-redux'

import {
  FormControlInput,
  FormControlAutocomplete,
  FormControlChips,
  FormControlReactSelect
} from 'components/Form'
import Footer from 'components/Filter/Footer'
import { userRoleLevels } from 'constants/api'

import useUserRole from 'hooks/tableLibrary/useUserRole'
import groupService from 'services/groupsService'
import tagsService from 'services/tagsService'
import usersService from 'services/usersService'

const styles = () => ({
  root: {
    padding: '25px 17px'
  },
  searchAction: {
    width: '90%'
  },
  searchActionText: {
    fontSize: '14px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '300',
    transform: 'translate(0, 1.5px)'
  }
})

const Filter = ({
  classes,
  t,
  roles,
  queryParams,
  onSubmit,
  onReset,
  close
}) => {
  const role = useUserRole()

  const transformedRoles = useMemo(
    () => roles.map(({ displayName: label, id: value }) => ({ label, value })),
    [roles]
  )

  const form = useFormik({
    initialValues: queryParams,
    onSubmit: values => {
      onSubmit(values)
      close()
    },
    onReset
  })

  useEffect(() => {
    form.setValues(queryParams)
    // eslint-disable-next-line
  }, [queryParams])

  const getGroupOptions = async value => {
    const response = await groupService.getGroupByEntity('User', {
      fields: 'title',
      title: value || undefined,
      sort: 'title',
      order: 'asc'
    })
    const groups = response ? response.data : []

    return groups.map(({ title }) => ({ value: title, label: title }))
  }

  const getTagOptions = async value => {
    const response = await tagsService.getTags({
      fields: 'tag',
      tag: value || undefined,
      sort: 'tag',
      order: 'asc'
    })
    const tags = response ? response.data : []

    return tags.map(({ tag }) => ({ value: tag, label: tag }), 'value')
  }

  const getEmailOptions = async value => {
    const response = await usersService.getItems({
      fields: 'email',
      email: value || undefined,
      sort: 'email',
      order: 'asc'
    })
    const groups = response ? response.data : []

    return groups.map(({ email }) => ({ value: email, label: email }))
  }

  return (
    <form className={classes.root}>
      <FormControlInput
        fullWidth
        id="firstName"
        label={t('First Name')}
        value={form.values.firstName}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlInput
        fullWidth
        id="lastName"
        label={t('Last Name')}
        value={form.values.lastName}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlAutocomplete
        fullWidth
        name="email"
        label={t('Email')}
        value={form.values.email}
        getOptions={getEmailOptions}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
        isClearable
      />
      {!role.org && (
        <FormControlInput
          fullWidth
          id="client"
          label={t('Client')}
          value={form.values.client}
          handleChange={form.handleChange}
          formControlLabelClass={classes.label}
        />
      )}
      <FormControlReactSelect
        fullWidth
        name="roleId"
        label={t('User Type')}
        options={transformedRoles}
        value={form.values.roleId}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
        isClearable
      />
      {role.org && (
        <FormControlAutocomplete
          fullWidth
          name="group"
          label={t('Group')}
          value={form.values.group}
          getOptions={getGroupOptions}
          handleChange={form.handleChange}
          formControlLabelClass={classes.label}
          isClearable
        />
      )}
      {role.org && (
        <FormControlAutocomplete
          selectComponent={FormControlChips}
          fullWidth
          name="tag"
          label={t('Tags')}
          values={form.values.tag}
          handleChange={form.handleChange}
          getOptions={getTagOptions}
          formControlLabelClass={classes.label}
          isClearable
        />
      )}
      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

Filter.defaultProps = {
  fetcher: () => {},
  searchClient: ''
}

const mapStateToProps = ({
  user: {
    details: {
      response: {
        role: { level }
      }
    }
  },
  config: {
    systemRole: { response: systemRoles },
    configOrgRole: { response: orgRoles },
    enterpriseRole: { response: enterpriseRoles }
  }
}) => ({
  roles:
    level === userRoleLevels.org
      ? orgRoles
      : level === userRoleLevels.system
      ? systemRoles
      : enterpriseRoles
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(Filter))
)
