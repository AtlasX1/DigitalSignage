import React from 'react'
import classNames from 'classnames'
import { translate } from 'react-i18next'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { FormControlInput, FormControlSelect } from '../../../../Form'
import { BlueButton, WhiteButton } from '../../../../Buttons'
import { TEMPLATES_GROUPS } from '../../constans'

const useStyles = makeStyles({
  formControlRoot: {
    marginBottom: 0
  },
  formControlInput: {
    marginBottom: 18
  },
  formControlLabel: {
    color: '#74809A',
    fontFamily: 'inherit',
    fontSize: '1.0833rem',
    letterSpacing: '-0.01px'
  },
  formControls: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .btn': {
      fontFamily: 'inherit',
      height: 31,
      letterSpacing: '-0.02px'
    }
  },
  formControlsApply: {
    minWidth: 122
  },
  formControlsCancel: {
    minWidth: 113
  }
})

const CanvasSaveForm = ({ t, onSubmit, onCancel }) => {
  const classes = useStyles()
  const form = useFormik({
    initialValues: {
      title: '',
      type: 'media',
      tags: ''
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(),
      type: Yup.string().required(),
      tags: Yup.string().required()
    }),
    onSubmit: values => {
      onSubmit(values)
    }
  })

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControlInput
          fullWidth={true}
          label={'Title'}
          name="title"
          value={form.values.title}
          handleChange={form.handleChange}
          formControlLabelClass={classes.formControlLabel}
          formControlRootClass={classes.formControlRoot}
          formControlInputClass={classes.formControlInput}
          showErrorText={false}
          error={form.errors.title}
          touched={form.touched.title}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlSelect
          custom
          label={'Create New / Add to Group'}
          name="type"
          value={form.values.type}
          handleChange={form.handleChange}
          options={TEMPLATES_GROUPS.map(name => {
            return { label: t(name), value: name.toLowerCase() }
          })}
          formControlLabelClass={classes.formControlLabel}
          formControlRootClass={classes.formControlInput}
          showErrorText={false}
          error={form.errors.type}
          touched={form.touched.type}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlInput
          fullWidth={true}
          label={'Tags'}
          name="tags"
          value={form.values.tags}
          handleChange={form.handleChange}
          formControlLabelClass={classes.formControlLabel}
          formControlRootClass={classes.formControlRoot}
          formControlInputClass={classes.formControlInput}
          showErrorText={false}
          error={form.errors.tags}
          touched={form.touched.tags}
        />
      </Grid>

      <Grid
        container
        className={`${classes.formGroup} ${classes.formControls}`}
      >
        <Grid item>
          <BlueButton
            onClick={form.submitForm}
            className={classNames('btn', classes.formControlsApply)}
          >
            {t('Save')}
          </BlueButton>
        </Grid>
        <Grid item>
          <WhiteButton
            onClick={onCancel}
            className={classNames('btn', classes.formControlsCancel)}
          >
            {t('Cancel')}
          </WhiteButton>
        </Grid>
      </Grid>
    </Grid>
  )
}
export default translate('translations')(CanvasSaveForm)
