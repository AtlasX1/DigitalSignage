import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import { FormControlInput } from 'components/Form'
import Footer from 'components/Filter/Footer'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  searchAction: {
    width: '90%'
  },
  label: {
    fontSize: '13px',
    fontWeight: '300',
    transform: 'translate(0, 1.5px)'
  }
})

const Filter = ({ classes, fetcher, meta, t, close }) => {
  const form = useFormik({
    initialValues: {
      title: ''
    },
    onSubmit: values => {
      fetcher({
        ...values,
        limit: meta.perPage
      })
      close()
    },
    onReset: () => {
      fetcher({
        limit: meta.perPage
      })
    }
  })

  const translate = useMemo(
    () => ({
      title: t('Package Name'),
      action: t('Search Action'),
      reset: t('Search Reset Action')
    }),
    [t]
  )
  return (
    <form className={classes.root}>
      <FormControlInput
        id="title"
        fullWidth
        label={translate.title}
        value={form.values.title}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />
      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Filter))
