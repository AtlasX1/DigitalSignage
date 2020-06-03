import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import { FormControlInput, FormControlReactSelect } from 'components/Form'
import Footer from 'components/Filter/Footer'
import featureConstants from 'constants/featureConstants'
import queryParamsHelper from 'utils/queryParamsHelper'
import useCategoryOptions from 'hooks/tableLibrary/useCategoryOptions'

const { DemoFeeds } = featureConstants

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

const Filter = ({ classes, t, perPage, fetcher = f => f, close }) => {
  const translate = useMemo(
    () => ({
      name: t('Feed name'),
      category: t('Category')
    }),
    [t]
  )

  const categories = useCategoryOptions(DemoFeeds)

  const form = useFormik({
    initialValues: {
      name: '',
      categoryId: null
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
        id="name"
        label={translate.name}
        value={form.values.name}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlReactSelect
        name="categoryId"
        label={translate.category}
        options={categories}
        value={form.values.categoryId}
        onChange={form.handleChange}
        formControlLabelClass={classes.label}
      />

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Filter))
