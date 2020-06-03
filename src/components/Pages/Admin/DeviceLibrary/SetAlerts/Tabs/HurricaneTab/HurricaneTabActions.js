import React from 'react'
import { translate } from 'react-i18next'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles, Grid } from '@material-ui/core'

import { BlueButton, WhiteButton } from '../../../../../../Buttons'
import { FormControlInput } from '../../../../../../Form'

const styles = theme => {
  const { palette, type } = theme
  return {
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

    confirmInputControl: {},
    confirmInput: {
      height: '41px',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRight: 'none',
      borderColor: '#0b86cb'
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
  }
}

const HurricaneTabActions = ({ t, classes, handleSave }) => {
  const form = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required()
    }),
    onSubmit: values => {
      handleSave(values.password)
    }
  })

  return (
    <Grid container wrap="nowrap" className={classes.root}>
      <Grid item className={classes.actionWrap}>
        <Grid container>
          <Grid item xs>
            <FormControlInput
              id="password"
              type="password"
              name="password"
              value={form.values.password}
              error={form.errors.password}
              touched={form.touched.password}
              handleChange={form.handleChange}
              handleBlur={form.handleBlur}
              showErrorText={false}
              placeholder={t('Password')}
              formControlRootClass={classes.confirmInputControl}
              formControlInputClass={classes.confirmInput}
            />
          </Grid>
          <Grid item>
            <BlueButton
              className={classes.confirmAction}
              onClick={form.submitForm}
            >
              {t('Confirm Send Alert')}
            </BlueButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <WhiteButton
          fullWidth={true}
          className={[classes.action, classes.actionCancel].join(' ')}
        >
          {t('Cancel')}
        </WhiteButton>
      </Grid>
    </Grid>
  )
}

export default translate('translations')(
  withStyles(styles)(HurricaneTabActions)
)
