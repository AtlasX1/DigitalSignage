import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import { FormControlInput, FormControlSelect } from 'components/Form'
import Footer from 'components/Filter/Footer'
import { userRoleLevels } from 'constants/api'
import { connect } from 'react-redux'
import queryParamsHelper from 'utils/queryParamsHelper'

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

const Filter = ({
  classes,
  t,
  roles,
  perPage,
  fetcher = f => f,
  searchClient = ''
}) => {
  const transformedRoles = useMemo(
    () => roles.map(({ displayName: label, id: value }) => ({ label, value })),
    [roles]
  )

  const form = useFormik({
    initialValues: {
      email: '',
      client: searchClient,
      firstName: '',
      lastName: '',
      userType: ''
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
      <FormControlInput
        fullWidth
        id="client"
        label={t('Client')}
        value={form.values.client}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlSelect
        fullWidth
        id="userType"
        label={t('User Type')}
        options={transformedRoles}
        value={form.values.userType}
        handleChange={form.handleChange}
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
