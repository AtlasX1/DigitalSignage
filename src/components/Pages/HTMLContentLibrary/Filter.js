import React, { useMemo } from 'react'
import { translate } from 'react-i18next'

import { withStyles } from '@material-ui/core'

import { FormControlInput } from 'components/Form'
import { useFormik } from 'formik'
import queryParamsHelper from 'utils/queryParamsHelper'
import Footer from 'components/Filter/Footer'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'
import useCategoryOptions from 'hooks/tableLibrary/useCategoryOptions'
import featureConstants from 'constants/featureConstants'
import { HTML_CONTENT } from 'constants/library'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '300',
    transform: 'translate(0, 1.5px)'
  },
  spacing: {
    marginBottom: 16
  }
})

const Filter = ({ t, classes, getItems, meta, close }) => {
  const translate = useMemo(
    () => ({
      name: t('Theme name'),
      category: t('Category'),
      search: t('Search Action'),
      reset: t('Search Reset Action')
    }),
    [t]
  )

  const categories = useCategoryOptions(featureConstants[HTML_CONTENT])

  const form = useFormik({
    initialValues: {
      name: '',
      category: null
    },
    onSubmit: ({ name, category }) => {
      // TODO Finish filtering work
      getItems(
        queryParamsHelper({
          name,
          category,
          limit: meta.perPage
        })
      )
      close()
    },
    onReset: () => {
      getItems({
        limit: meta.perPage
      })
    }
  })
  return (
    <form className={classes.root}>
      <FormControlInput
        id="name"
        fullWidth
        label={translate.name}
        value={form.values.name}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <FormControlReactSelect
        name="category"
        options={categories}
        label={translate.category}
        value={form.values.category}
        onChange={form.handleChange}
        formControlLabelClass={classes.label}
        formControlContainerClass={classes.spacing}
      />

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Filter))
