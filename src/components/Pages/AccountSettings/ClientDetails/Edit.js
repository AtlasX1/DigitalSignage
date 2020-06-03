import React, { useEffect, useState } from 'react'
import update from 'immutability-helper'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { withSnackbar } from 'notistack'

import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import { getNames } from 'country-list'

import { Grid, Typography } from '@material-ui/core'

import {
  FormControlInput,
  FormControlSelect,
  FormControlTelInput
} from '../../../Form'

import { BlueButton, WhiteButton } from '../../../Buttons'

import { putClientSettingsAction } from '../../../../actions/clientSettingsActions'

const Edit = ({
  t,
  data,
  classes,
  onCancelClick = f => f,
  putClientSettingsAction
}) => {
  const [countriesOptions] = useState(
    getNames().map(c => ({ value: c, label: c }))
  )

  const [phoneNo1, setPhoneNo1] = useState({
    value: '',
    valid: false,
    code: {}
  })

  const [phoneNo2, setPhoneNo2] = useState({
    value: '',
    valid: false,
    code: {}
  })

  const form = useFormik({
    initialValues: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    onSubmit: values => {
      const d = update(data, {
        $merge: values
      })

      if (phoneNo1.value) {
        d.phoneNo1 = phoneNo1.value
      }

      if (phoneNo2.value) {
        d.phoneNo2 = phoneNo2.value
      }

      if (d.defaultScreen && typeof d.defaultScreen.imageSize === 'number') {
        d.defaultScreen.imageSize = `${d.defaultScreen.imageSize}`
      }

      putClientSettingsAction(d)
    }
  })

  useEffect(() => {
    if (data) {
      form.setValues({
        address1: data.address1 || '',
        address2: data.address2 || '',
        city: data.city || '',
        state: data.state || '',
        zipCode: data.zipCode || '',
        country: data.country || ''
      })

      if (data.phoneNo1) {
        setPhoneNo1(
          update(phoneNo1, {
            value: { $set: data.phoneNo1 }
          })
        )
      }

      if (data.phoneNo2) {
        setPhoneNo2(
          update(phoneNo2, {
            value: { $set: data.phoneNo2 }
          })
        )
      }
    }
    // eslint-disable-next-line
  }, [data])

  const handleCountryChange = e => {
    form.setFieldValue('country', e.target.value, false)
  }

  const handlePhoneNo1Change = (valid, value, code) => {
    setPhoneNo1(
      update(phoneNo1, {
        value: { $set: value },
        valid: { $set: valid },
        code: { $set: code }
      })
    )
  }

  const handlePhoneNo2Change = (valid, value, code) => {
    setPhoneNo2(
      update(phoneNo2, {
        value: { $set: value },
        valid: { $set: valid },
        code: { $set: code }
      })
    )
  }

  return (
    <Grid container direction="column">
      <Grid
        className={[classes.detailRow, classes.detailRowPd].join(' ')}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Address').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <FormControlInput
            value={form.values.address1}
            marginBottom={false}
            handleChange={form.handleChange}
            name="address1"
          />
        </Grid>
      </Grid>

      <Grid
        className={[classes.detailRow, classes.detailRowPd].join(' ')}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Address 2').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <FormControlInput
            value={form.values.address2}
            marginBottom={false}
            handleChange={form.handleChange}
            name="address2"
          />
        </Grid>
      </Grid>

      <Grid
        className={[classes.detailRow, classes.detailRowPd].join(' ')}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('City').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <FormControlInput
            value={form.values.city}
            marginBottom={false}
            handleChange={form.handleChange}
            name="city"
          />
        </Grid>
      </Grid>

      <Grid container justify="space-between" alignItems="center">
        <Grid item xs={6} className={classes.detailRowLeft}>
          <Grid
            className={[classes.detailRow, classes.detailRowPd].join(' ')}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('State').toUpperCase()}
              </Typography>
            </Grid>
            <Grid item>
              <FormControlInput
                value={form.values.state}
                marginBottom={false}
                formControlContainerClass={classes.inputSmallContainer}
                handleChange={form.handleChange}
                name="state"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6} className={classes.detailRowRight}>
          <Grid
            className={[classes.detailRow, classes.detailRowPd].join(' ')}
            container
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <Typography className={classes.detailLabel}>
                {t('Zip').toUpperCase()}
              </Typography>
            </Grid>
            <Grid item>
              <FormControlInput
                value={form.values.zipCode}
                marginBottom={false}
                formControlContainerClass={classes.inputSmallContainer}
                handleChange={form.handleChange}
                name="zipCode"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid
        className={[classes.detailRow, classes.detailRowPd].join(' ')}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Country').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <FormControlSelect
            value={form.values.country}
            options={countriesOptions}
            formControlContainerClass={classes.inputContainer}
            marginBottom={false}
            handleChange={handleCountryChange}
          />
        </Grid>
      </Grid>

      <Grid
        className={[classes.detailRow, classes.detailRowPd].join(' ')}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Phone-1').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <FormControlTelInput
            value={phoneNo1.value}
            formControlRootClass={classes.inputContainer}
            marginBottom={false}
            onChange={handlePhoneNo1Change}
          />
        </Grid>
      </Grid>
      <Grid
        className={[
          classes.detailRow,
          classes.detailRowPd,
          classes.detailRowLast
        ].join(' ')}
        container
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography className={classes.detailLabel}>
            {t('Phone-2').toUpperCase()}
          </Typography>
        </Grid>
        <Grid item>
          <FormControlTelInput
            value={phoneNo2.value}
            formControlRootClass={classes.inputContainer}
            marginBottom={false}
            onChange={handlePhoneNo2Change}
          />
        </Grid>
      </Grid>

      <Grid container justify="flex-end">
        <WhiteButton
          className={classes.editCancelButton}
          onClick={onCancelClick}
        >
          Cancel
        </WhiteButton>

        <BlueButton onClick={form.submitForm}>Save</BlueButton>
      </Grid>
    </Grid>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      putClientSettingsAction
    },
    dispatch
  )

export default translate('translations')(
  withSnackbar(connect(null, mapDispatchToProps)(Edit))
)
