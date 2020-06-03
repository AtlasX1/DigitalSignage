import React, { useMemo } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useFormik } from 'formik'
import { FormControlInput } from 'components/Form'
import Footer from 'components/Filter/Footer'
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

const Filter = ({ classes, t, perPage, fetcher = f => f, close }) => {
  const translate = useMemo(
    () => ({
      client: t('Client name')
    }),
    [t]
  )

  const form = useFormik({
    initialValues: {
      client: ''
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
        id="clientName"
        label={translate.client}
        value={form.values.client}
        handleChange={form.handleChange}
        formControlLabelClass={classes.label}
      />

      <Footer onSubmit={form.handleSubmit} onReset={form.handleReset} />
    </form>
  )
}

export default translate('translations')(withStyles(styles)(Filter))
