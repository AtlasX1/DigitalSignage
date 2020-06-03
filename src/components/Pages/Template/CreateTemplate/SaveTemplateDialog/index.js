import React, { useEffect, useState } from 'react'

import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import { compose } from 'redux'
import { get as _get } from 'lodash'
import * as Yup from 'yup'
import { translate } from 'react-i18next'

import {
  Grid,
  DialogActions,
  Typography,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent
} from '@material-ui/core'

import selectUtils from '../../../../../utils/select'

import { FormControlChips, FormControlInput } from '../../../../Form'
import { BlueButton, WhiteButton } from '../../../../Buttons'

import * as tagsActions from '../../../../../actions/tagsActions'
import { getTemplateGroupsAction } from '../../../../../actions/templateActions'

const styles = ({ palette, type, typography }) => {
  return {
    saveDialog: {
      width: '100%',
      maxWidth: 500
    },
    root: {
      margin: '24px 25px',
      fontFamily: typography.fontFamily
    },
    formWrapper: {
      position: 'relative'
    },
    loaderWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '100px',
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: '0',
      left: '0',
      backgroundColor: 'rgba(255,255,255,.5)',
      zIndex: 1
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    switchContainerClass: {
      width: '180px'
    },
    inputContainerClass: {
      margin: '0 10px'
    },
    inputClass: {
      width: '60px'
    },
    previewMediaRow: {
      marginTop: '42px'
    },
    formGroup: {
      marginTop: '12px'
    },
    sliderInputLabelClass: {
      paddingRight: '15px',
      fontStyle: 'normal'
    },
    labelClass: {
      fontSize: '17px'
    },
    formControlLabelClass: {
      fontSize: '13px'
    },
    dialog: {
      background: palette[type].dialog.background,
      border: `1px solid ${palette[type].dialog.border}`
    },
    dialogTitle: {
      '& *': {
        color: `${palette[type].dialog.title}`
      }
    },
    dialogText: {
      color: palette[type].dialog.text,
      marginBottom: '12px',
      '&:last-child': {
        marginBottom: 0
      }
    },
    reactSelectContainer: {
      '& .react-select__control': {
        paddingTop: 0,
        paddingBottom: 0
      }
    }
  }
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Enter field')
})

const SaveTemplateDialog = props => {
  const {
    t,
    classes,
    open,
    onClose,
    onSave,
    onSaveAndCreate,
    values: defaultValues
  } = props

  const dispatchAction = useDispatch()

  const group = useSelector(({ template }) =>
    _get(template, 'groups.response.data')
  )
  const tags = useSelector(({ tags }) => _get(tags, 'items.response'))

  const [createAnother, setCreateAnother] = useState(false)

  useEffect(
    () => {
      dispatchAction(
        getTemplateGroupsAction({
          limit: 9999
        })
      )
      dispatchAction(
        tagsActions.getItems({
          limit: 9999
        })
      )
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      form.setValues(defaultValues)
    },
    // eslint-disable-next-line
    [defaultValues]
  )

  const form = useFormik({
    initialValues: {
      title: defaultValues.title,
      group: defaultValues.group,
      tag: defaultValues.tag
    },
    enableReinitialize: false,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema,
    onSubmit: async values => {
      try {
        if (createAnother) {
          onSaveAndCreate(values)
        } else onSave(values)
      } catch (e) {
        console.log('e', e)
      }
    }
  })

  const { values, errors, touched } = form

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.saveDialog }}
    >
      <DialogTitle>
        <Typography className={classes.title}>{t('Save Template')}</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={form.handleSubmit}>
          <Grid container>
            <Grid item xs={12}>
              <FormControlInput
                label={t('Template Name')}
                fullWidth={true}
                formControlLabelClass={classes.labelClass}
                value={values.title}
                error={errors.title}
                touched={touched.title}
                handleChange={e => form.setFieldValue('title', e.target.value)}
              />
              <FormControlChips
                isMulti={false}
                customClass={classes.reactSelectContainer}
                name="group"
                label={t('Create New / Add to Group')}
                options={selectUtils.convertArr(group, selectUtils.toChipObj)}
                values={values.group}
                error={errors.group}
                touched={touched.group}
                handleChange={e => {
                  const selectedGroup = selectUtils
                    .convertArr(group, selectUtils.toChipObj)
                    .find(i => i.value === e.target.value)
                  form.setFieldValue('group', [selectedGroup])
                }}
              />
              <FormControlChips
                customClass={classes.reactSelectContainer}
                name="tag"
                label={t('Add Tags')}
                options={selectUtils.convertArr(tags, selectUtils.tagToChipObj)}
                values={values.tag}
                error={errors.tag}
                touched={touched.tag}
                handleChange={form.handleChange}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions className={classes.actionBar}>
        <BlueButton onClick={form.handleSubmit}>{t('Save')}</BlueButton>
        <WhiteButton
          classes={{ root: classes.button }}
          onClick={() => {
            setCreateAnother(true)
            form.handleSubmit()
          }}
        >
          {t('Save & Create another')}
        </WhiteButton>
        <WhiteButton onClick={onClose}>{t('Cancel')}</WhiteButton>
      </DialogActions>
    </Dialog>
  )
}

export default compose(
  translate('translations'),
  withStyles(styles)
)(SaveTemplateDialog)
