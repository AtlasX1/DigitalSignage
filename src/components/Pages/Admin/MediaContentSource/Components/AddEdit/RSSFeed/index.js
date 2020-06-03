import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { translate } from 'react-i18next'
import { isEmpty, isObject } from 'lodash'
import { withStyles } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import {
  postContentIntoFeature,
  getContentById,
  putContent
} from 'actions/contentActions'

import {
  FormControlInput,
  FormControlReactSelect,
  WysiwygEditor
} from 'components/Form'
import UploadLogoCard from 'components/UploadLogoCard'
import useCategoryOptions from 'hooks/tableLibrary/useCategoryOptions'
import featureConstants from 'constants/featureConstants'
import FooterLayout from 'components/Modal/FooterLayout'
import routeByName from 'constants/routes'
import { SideModal } from 'components/Modal'

import {
  imageValidateSchema,
  requiredImageValidateSchema
} from 'constants/validations'

import {
  convertEditorStateToHtml,
  convertHTMLToEditorState
} from 'utils/WysiwygUtils'
import { convertToFormData } from 'utils/formDataHelper'
import { checkData } from 'utils/tableUtils'

const { RSSFeed } = featureConstants

const styles = () => ({
  root: {
    padding: 20,
    overflow: 'auto',
    display: 'grid',
    gridRowGap: '7px',
    gridTemplateRows: 'repeat(5, fit-content(100%))'
  }
})

const AddRSSFeed = ({
  history,
  match: {
    params: { id },
    path
  },
  t,
  classes
}) => {
  const [backup, setBackup] = useState({})
  const isEdit = useMemo(() => path === routeByName[RSSFeed].edit, [path])

  const translate = useMemo(
    () => ({
      title: isEdit ? t('Edit RSS Feed') : t('Add RSS Feed'),
      name: t('RSS Feed Name'),
      category: t('Category'),
      logo: t('Logo'),
      url: t('URL'),
      tooltip: t('Tooltip')
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
          { ...values, tooltip: convertEditorStateToHtml(values.tooltip) },
          true
        )
        if (!isObject(values.thumbUri)) data.delete('thumbUri')

        dispatch(putContent(id, data))
      } else {
        dispatch(
          postContentIntoFeature(
            RSSFeed,
            convertToFormData({
              ...values,
              tooltip: convertEditorStateToHtml(values.tooltip)
            })
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
    if (!isEmpty(item) && item.feature.name === RSSFeed && isEdit) {
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

  const categories = useCategoryOptions(RSSFeed)

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
      closeLink={routeByName[RSSFeed].root}
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
    </SideModal>
  )
}

export default translate('translations')(withStyles(styles)(AddRSSFeed))
