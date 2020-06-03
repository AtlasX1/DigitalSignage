import React, { useMemo, useEffect, useCallback, useState } from 'react'
import { translate } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import * as Yup from 'yup'
import { isEmpty, isObject } from 'lodash'
import moment from 'moment'

import {
  postContentIntoFeature,
  getContentById,
  putContent
} from 'actions/contentActions'

import {
  FormControlInput,
  FormControlReactSelect,
  FormControlSelectWithSearch,
  FormControlSingleDatePicker,
  WysiwygEditor
} from 'components/Form'
import { SideModal } from 'components/Modal'
import UploadLogoCard from 'components/UploadLogoCard'
import featureConstants from 'constants/featureConstants'
import FooterLayout from 'components/Modal/FooterLayout'

import routeByName from 'constants/routes'
import {
  imageValidateSchema,
  requiredImageValidateSchema
} from 'constants/validations'

import useClientOptions from 'hooks/tableLibrary/useClientOptions'
import useCategoryOptions from 'hooks/tableLibrary/useCategoryOptions'

import {
  convertEditorStateToHtml,
  convertHTMLToEditorState
} from 'utils/WysiwygUtils'
import { convertToFormData } from 'utils/formDataHelper'
import { checkData } from 'utils/tableUtils'

const { CustomWidget } = featureConstants

const styles = () => ({
  root: {
    padding: 20,
    overflow: 'auto',
    display: 'grid',
    gridRowGap: '7px'
  }
})

const AddEditFeeds = ({
  history,
  match: {
    params: { id },
    path
  },
  t,
  classes
}) => {
  const [backup, setBackup] = useState({})

  const isEdit = useMemo(() => path === routeByName[CustomWidget].edit, [path])
  const translate = useMemo(
    () => ({
      title: isEdit ? t('Edit Custom Widget') : t('Add Custom Widget'),
      name: t('Name'),
      category: t('Widget'),
      logo: t('Thumbnail'),
      url: t('URL'),
      tooltip: t('Thumbnail tooltip'),
      client: t('Client Name'),
      expireOn: t('Expire On')
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
  const clients = useClientOptions()
  const categories = useCategoryOptions(CustomWidget)
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
      thumbUri: '',
      clientId: null,
      expirationDate: moment()
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
          tooltip: Yup.mixed().required('Please enter field').nullable(),
          clientId: Yup.number().required('Please enter field').nullable()
        }),
    onSubmit: values => {
      if (isEdit) {
        const data = convertToFormData(
          {
            ...values,
            tooltip: convertEditorStateToHtml(values.tooltip),
            expirationDate: moment(values.expirationDate).format('YYYY-MM-DD')
          },
          true
        )

        if (!isObject(values.thumbUri)) data.delete('thumbUri')

        dispatch(putContent(id, data))
      } else {
        dispatch(
          postContentIntoFeature(
            CustomWidget,
            convertToFormData({
              ...values,
              tooltip: convertEditorStateToHtml(values.tooltip),
              expirationDate: moment(values.expirationDate).format('YYYY-MM-DD')
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
    if (!isEmpty(item) && item.feature.name === CustomWidget && isEdit) {
      const {
        name,
        category: { id: categoryId },
        contentUri,
        tooltip,
        thumbUri,
        expirationDate,
        client
      } = item

      setBackup({
        name: checkData(name, ''),
        categoryId: checkData(categoryId, null),
        contentUri: checkData(contentUri, ''),
        tooltip: tooltip ? convertHTMLToEditorState(tooltip) : '',
        thumbUri: checkData(thumbUri, ''),
        clientId: client ? client.id : null,
        expirationDate: expirationDate ? moment(expirationDate) : moment()
      })
    }
    // eslint-disable-next-line
  }, [item, dispatch, isEdit, id])

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
      closeLink={routeByName[CustomWidget].root}
      childrenWrapperClass={classes.root}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={handleClickReset}
          isUpdate={isEdit}
        />
      }
    >
      <FormControlSelectWithSearch
        name="clientId"
        options={clients}
        value={values.clientId}
        handleChange={handleChange}
        label={translate.client}
        error={errors.clientId}
        touched={touched.clientId}
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
        formControlLabelClass={classes.label}
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
      <FormControlSingleDatePicker
        name="expirationDate"
        label={translate.expireOn}
        value={values.expirationDate}
        handleChange={handleChange}
      />
    </SideModal>
  )
}

export default translate('translations')(withStyles(styles)(AddEditFeeds))
