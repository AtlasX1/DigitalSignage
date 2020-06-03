import React, { useEffect } from 'react'

import update from 'immutability-helper'

import { withSnackbar } from 'notistack'

import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { withStyles, Grid, Button } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import { FormControlInput } from '../../../Form'
import { BlueButton } from '../../../Buttons'

import { bindActionCreators } from 'redux'

import {
  mergeWebFontConfig,
  removeFontFromList,
  clearAddedFonts,
  postFontAction,
  clearPostFontInfoAction,
  getFonts
} from '../../../../actions/fontsActions'

const styles = ({ palette, type }) => ({
  container: {
    padding: 20
  },
  inputContainer: {
    width: 'calc(50% - 10px)'
  }
})

const AddFont = ({
  t,
  classes,
  postReducer,
  postFontAction,
  clearPostFontInfoAction,
  enqueueSnackbar,
  closeSnackbar,
  getFonts
}) => {
  const form = useFormik({
    initialValues: {
      name: '',
      style: '400 Normal'
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required(),
      style: Yup.string().required()
    }),
    onSubmit: values => {
      const data = update(values, {
        subsets: {
          $set: ['string']
        },
        category: { $set: 'sans-serif' }
      })
      postFontAction(data)
    }
  })

  useEffect(() => {
    if (postReducer.response) {
      getFonts()

      showSnackbar(t('Successfully added'))
      clearPostFontInfoAction()
    } else if (postReducer.error) {
      showSnackbar(t('Error'))
      clearPostFontInfoAction()
    }
    // eslint-disable-next-line
  }, [postReducer])

  const showSnackbar = title => {
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  return (
    <SideModal width="80%" title={t('Add Font')} closeLink="/font-library">
      <Grid container className={classes.container}>
        <Grid container justify="space-between">
          <FormControlInput
            id="add-font-name"
            name="name"
            value={form.values.name}
            handleChange={form.handleChange}
            label={t('Font Name')}
            formControlContainerClass={classes.inputContainer}
          />
          <FormControlInput
            id="add-font-weight"
            value={form.values.style}
            handleChange={form.handleChange}
            label={t('Font weight')}
            formControlContainerClass={classes.inputContainer}
          />
        </Grid>
        <Grid container>
          <BlueButton onClick={form.submitForm}>{t('Save')}</BlueButton>
        </Grid>
      </Grid>
    </SideModal>
  )
}
const mapStateToProps = ({ fonts }) => ({
  fonts: fonts.items,
  addedFonts: fonts.addedFonts,
  postReducer: fonts.post
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      mergeWebFontConfig,
      removeFontFromList,
      clearAddedFonts,
      postFontAction,
      clearPostFontInfoAction,
      getFonts
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(AddFont))
  )
)
