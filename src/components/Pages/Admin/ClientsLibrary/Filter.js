import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import { FormControlInput, FormControlSelect } from 'components/Form'
import Footer from 'components/Filter/Footer'
import queryParamsHelper from 'utils/queryParamsHelper'
import useClientTypeOptions from 'hooks/tableLibrary/useClientTypeOptions'
import useTagsOptions from 'hooks/tableLibrary/useTagsOptions'
import useGroupsOptions from 'hooks/tableLibrary/useGroupsOptions'
import entityGroupsConstants from 'constants/entityGroupsConstants'
import FormControlChips from 'components/Form/FormControlChips'

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
  const clientTypes = useClientTypeOptions()
  const tags = useTagsOptions()
  const groups = useGroupsOptions(entityGroupsConstants.Client)

  const translate = useMemo(
    () => ({
      name: t('Client Name'),
      groups: t('Create New / Add Group'),
      tags: t('Create New / Add Tag'),
      clientTypeId: t('Client Type')
    }),
    [t]
  )

  const form = useFormik({
    initialValues: {
      featurePackage: '',
      name: '',
      group: [],
      tag: [],
      clientTypeId: ''
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
        name="name"
        label={t('Name')}
        value={form.values.name}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlInput
        fullWidth
        name="featurePackage"
        label={t('Package')}
        value={form.values.featurePackage}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlSelect
        label={translate.clientTypeId}
        name="clientTypeId"
        formControlLabelClass={classes.label}
        options={clientTypes}
        value={form.values.clientTypeId}
        handleChange={form.handleChange}
      />
      <FormControlChips
        name="group"
        values={form.values.group}
        options={groups}
        handleChange={form.handleChange}
        fullWidth
        label={translate.groups}
      />
      <FormControlChips
        name="tag"
        options={tags}
        values={form.values.tag}
        handleChange={form.handleChange}
        fullWidth
        label={translate.tags}
      />
      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Filter))
