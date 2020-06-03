import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty, isObject } from 'lodash'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import {
  postContentIntoFeature,
  putContent,
  getContentById
} from 'actions/contentActions'

import {
  imageValidateSchema,
  requiredImageValidateSchema
} from 'constants/validations'
import routeByName from 'constants/routes'

import {
  WysiwygEditor,
  FormControlInput,
  FormControlReactSelect
} from 'components/Form'
import { SideModal } from 'components/Modal'
import TextPreview from 'components/TextPreview'
import UploadLogoCard from 'components/UploadLogoCard'
import featureConstants from 'constants/featureConstants'
import FooterLayout from 'components/Modal/FooterLayout'
import useCategoryOptions from 'hooks/tableLibrary/useCategoryOptions'

import {
  convertHTMLToEditorState,
  convertEditorStateToHtml
} from 'utils/WysiwygUtils'
import { convertToFormData } from 'utils/formDataHelper'
import { checkData } from 'utils/tableUtils'

const { DemoFeeds } = featureConstants

const styles = () => ({
  root: {
    padding: 20,
    overflow: 'auto',
    display: 'grid',
    gridRowGap: '7px',
    gridTemplateRows: 'repeat(5, fit-content(100%))'
  }
})

const AddDemoFeeds = ({
  history,
  match: {
    params: { id },
    path
  },
  t,
  classes
}) => {
  const [backup, setBackup] = useState({})

  const isEdit = useMemo(() => path === routeByName[DemoFeeds].edit, [path])

  const translate = useMemo(
    () => ({
      title: isEdit ? t('Edit Demo Feed') : t('Add Demo Feed'),
      name: t('Demo Feed Name'),
      category: t('Category'),
      logo: t('Thumbnail'),
      url: t('Demo Feed URL'),
      tooltip: t('Description popover'),
      preview: t('Description preview')
    }),
    [isEdit, t]
  )

  const dispatch = useDispatch()

  const item = useSelector(
    ({
      contents: {
        contentById: { response: item }
      }
    }) => item
  )

  const categories = useCategoryOptions(DemoFeeds)

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    ...form
  } = useFormik({
    initialValues: {
      name: '',
      categoryId: null,
      contentUri: '',
      tooltip: '',
      thumbUri: ''
    },
    validationSchema: isEdit
      ? Yup.object().shape({
          thumbUri: imageValidateSchema
        })
      : Yup.object().shape({
          name: Yup.string().required('Please enter field'),
          categoryId: Yup.number()
            .required('Please select category')
            .nullable(),
          contentUri: Yup.string().required('Please enter field'),
          thumbUri: requiredImageValidateSchema,
          tooltip: Yup.mixed().required('Please enter field').nullable()
        }),
    onSubmit: values => {
      if (isEdit) {
        const data = convertToFormData(
          { ...values, tooltip: tooltipEditorToHtml },
          true
        )
        if (!isObject(values.thumbUri)) data.delete('thumbUri')

        dispatch(putContent(id, data))
      } else {
        dispatch(
          postContentIntoFeature(
            DemoFeeds,
            convertToFormData({ ...values, tooltip: tooltipEditorToHtml })
          )
        )
      }

      history.goBack()
    }
  })
  useEffect(() => {
    if (isEdit) {
      dispatch(getContentById(id))
    }
    // eslint-disable-next-line
  }, [isEdit])

  useEffect(() => {
    if (!isEmpty(item) && item.feature.name === DemoFeeds && isEdit) {
      const {
        name,
        category: { id: categoryId },
        contentUri,
        tooltip,
        thumbUri
      } = item

      setBackup({
        name: checkData(name, ''),
        categoryId: checkData(categoryId, null),
        contentUri: checkData(contentUri, ''),
        tooltip: tooltip ? convertHTMLToEditorState(tooltip) : '',
        thumbUri: checkData(thumbUri, '')
      })
    }
    // eslint-disable-next-line
  }, [item, dispatch, isEdit, id])

  const tooltipEditorToHtml = useMemo(
    () => convertEditorStateToHtml(values.tooltip),
    [values.tooltip]
  )

  useEffect(() => {
    if (!isEmpty(backup) && isEdit) {
      form.setValues(backup)
    }
    //eslint-disable-next-line
  }, [backup, isEdit])

  const handleClickReset = useCallback(
    () => (isEdit ? form.setValues(backup) : form.resetForm()),
    [backup, form, isEdit]
  )

  return (
    <SideModal
      width="35%"
      title={translate.title}
      closeLink={routeByName[DemoFeeds].root}
      childrenWrapperClass={classes.root}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={handleClickReset}
          isUpdate={isEdit}
        />
      }
    >
      <FormControlInput
        name="name"
        fullWidth
        label={translate.name}
        value={values.name}
        error={errors.name}
        touched={touched.name}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
      <FormControlReactSelect
        name="categoryId"
        label={translate.category}
        value={values.categoryId}
        error={errors.categoryId}
        touched={touched.categoryId}
        onChange={handleChange}
        options={categories}
      />
      <FormControlInput
        name="contentUri"
        fullWidth
        label={translate.url}
        value={values.contentUri}
        error={errors.contentUri}
        touched={touched.contentUri}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />
      <UploadLogoCard
        name="thumbUri"
        title={translate.logo}
        onChange={handleChange}
        formValue={values.thumbUri}
        error={errors.thumbUri}
        touched={touched.thumbUri}
      />
      <WysiwygEditor
        label={translate.tooltip}
        name="tooltip"
        editorState={values.tooltip}
        onChange={handleChange}
        error={errors.tooltip}
        touched={touched.tooltip}
      />
      <TextPreview label={translate.preview} text={tooltipEditorToHtml} />
    </SideModal>
  )
}

export default translate('translations')(withStyles(styles)(AddDemoFeeds))
