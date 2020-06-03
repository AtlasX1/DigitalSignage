import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import { FormControlInput, FormControlReactSelect } from 'components/Form'
import Footer from 'components/Filter/Footer'
import queryParamsHelper from 'utils/queryParamsHelper'
import useOrgRoleOptions from 'hooks/tableLibrary/useOrgRoleOptions'
import useEnterpriseRoleOptions from 'hooks/tableLibrary/useEnterpriseRoleOptions'

const styles = theme => ({
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

const Filter = ({ classes, t, perPage, fetcher = f => f, close }) => {
  const enterpriseRoles = useEnterpriseRoleOptions()
  const orgRoles = useOrgRoleOptions()

  const roles = useMemo(() => [...enterpriseRoles, ...orgRoles], [
    enterpriseRoles,
    orgRoles
  ])

  const form = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      roleId: null
    },
    onSubmit: values => {
      fetcher(
        queryParamsHelper({
          ...values,
          limit: perPage
        })
      )
      close()
    },
    onReset: () => {
      fetcher({
        limit: perPage
      })
    }
  })
  return (
    <form className={classes.root}>
      <FormControlInput
        fullWidth
        id="email"
        label={t('Email')}
        value={form.values.email}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlReactSelect
        fullWidth
        name="roleId"
        label={t('User Type')}
        options={roles}
        value={form.values.roleId}
        onChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
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

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Filter))
