import React, { useCallback } from 'react'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { withStyles, Grid } from '@material-ui/core'
import { compose } from 'redux'
import classNames from 'classnames'

import { BlueButton, WhiteButton } from 'components/Buttons'
import { FormControlInput } from 'components/Form'
import { isTruthy } from 'utils/generalUtils'

const styles = ({ palette, type }) => ({
  root: {
    padding: '25px 20px 20px',
    backgroundColor: palette[type].sideModal.action.background,
    borderTop: palette[type].sideModal.action.border
  },
  actionWrap: {
    width: '410px',
    paddingRight: '12px'
  },
  action: {
    paddingTop: '9px',
    paddingBottom: '9px'
  },
  confirmInput: {
    height: '41px',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 'none',
    borderColor: '#0b86cb'
  },
  confirmInputError: {
    borderColor: 'red'
  },
  confirmAction: {
    width: '170px',
    padding: '10px 0',
    border: 'none',
    backgroundImage:
      'linear-gradient(to right, #0b86cb, #0378ba), linear-gradient(to right, #0378ba, #0378ba)',
    borderRadius: '0 4px 4px 0',
    textAlign: 'center',
    color: '#fff'
  },
  actionCancel: {
    width: '140px',
    borderColor: palette[type].sideModal.action.button.border,
    boxShadow: 'none',
    backgroundImage: palette[type].sideModal.action.button.background,
    color: palette[type].sideModal.action.button.color
  }
})

function BottomActions({ t, classes, handleSave }) {
  const handleSubmit = useCallback(
    ({ password }) => {
      handleSave(password)
    },
    [handleSave]
  )
  const form = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required()
    }),
    onSubmit: handleSubmit
  })
  const { values, errors, touched, handleChange, handleBlur, submitForm } = form
  return (
    <Grid container wrap="nowrap" className={classes.root}>
      <Grid item className={classes.actionWrap}>
        <Grid container>
          <Grid item xs>
            <FormControlInput
              id="password"
              type="password"
              name="password"
              value={values.password}
              error={errors.password}
              touched={touched.password}
              handleChange={handleChange}
              handleBlur={handleBlur}
              showErrorText={false}
              placeholder={t('Password')}
              formControlInputClass={classNames(classes.confirmInput, {
                [classes.confirmInputError]: isTruthy(
                  errors.password,
                  touched.password
                )
              })}
            />
          </Grid>
          <Grid item>
            <BlueButton className={classes.confirmAction} onClick={submitForm}>
              {t('Confirm Send Alert')}
            </BlueButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <WhiteButton
          fullWidth
          className={classNames(classes.action, classes.actionCancel)}
        >
          {t('Cancel')}
        </WhiteButton>
      </Grid>
    </Grid>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(BottomActions)
