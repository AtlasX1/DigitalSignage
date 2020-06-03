import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { SideModal } from 'components/Modal'
import { FormControlChips, FormControlInput } from 'components/Form'
import { getItemById, postItem, putItem } from 'actions/workplacePosterActions'
import { FileUpload } from 'components/Media/General/components/Upload'
import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'
import routeByName from 'constants/routes'
import { formDataHelper, selectUtils } from 'utils/index'
import FooterLayout from 'components/Modal/FooterLayout'
import { imageValidateSchema } from 'constants/validations'

const styles = ({ palette, type }) => ({
  wrapContent: {
    padding: '20px 40px',
    height: 'inherit'
  },
  inputLabel: {
    fontSize: 18
  },
  fileUpload: {
    marginTop: '20px',
    height: '140px !important'
  },
  rightContent: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflow: 'auto'
  },
  separator: {
    width: '100%',
    opacity: '0.2'
  },
  labelSeparator: {
    color: '#9c9c9c'
  }
})

const AddEditWorkplacePoster = ({
  t,
  item,
  tags,
  classes,
  putItem,
  postItem,
  getItemById,
  match: {
    params: { id }
  },
  history
}) => {
  const translate = useMemo(
    () => ({
      title: id ? t('Edit Workplace Posters') : t('Add Workplace Posters'),
      fileUpload: t('File Upload'),
      webUrl: t('File from Web URL'),
      tags: t('Tags')
    }),
    [id, t]
  )

  const [preview, setPreview] = useState('')

  const transformedTags = useMemo(
    () => selectUtils.convertArr(tags, selectUtils.toChipObj),
    [tags]
  )

  useEffect(() => {
    if (id) {
      getItemById(id)
    }
  }, [id, getItemById])

  const form = useFormik({
    initialValues: {
      title: '',
      uri: '',
      uploadType: 'upload',
      upload: null,
      tag: []
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Please enter field'),
      upload: imageValidateSchema
    }),
    onSubmit: values => {
      const formData = new FormData()

      Object.keys(values).forEach(
        key =>
          key !== 'tag' && key !== 'upload' && formData.append(key, values[key])
      )

      if (Array.isArray(values.upload)) {
        formData.append('upload', values.upload[0])
      } else {
        formData.append('upload', preview)
      }

      formDataHelper.createFormDataFromArray(
        formData,
        values.tag.map(({ value }) => ({ id: value })),
        'tag'
      )

      id ? putItem(id, formData) : postItem(formData)
      history.goBack()
    }
  })

  const intialFormValues = useRef(form.values)

  // Handle fetched item
  useEffect(() => {
    if (Object.keys(item).length && id) {
      const { title, uploadType, content, tag } = item
      if (uploadType === 'Upload') {
        setPreview(content)
      }

      intialFormValues.current = {
        ...form.values,
        title,
        uploadType,
        uri: uploadType === 'URL' ? content : '',
        tag: tag.map(({ title, id }) => ({ label: title, id }))
      }

      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  // Tab logic
  const getSelectedTabContent = useMemo(() => {
    if (form.values.uploadType === 'URL') {
      return (
        <FormControlInput
          label="URL"
          id="uri"
          handleChange={form.handleChange}
          value={form.values.uri}
          error={form.errors.uri}
          touched={form.touched.uri}
          formControlLabelClass={classes.inputLabel}
        />
      )
    } else {
      return (
        <FileUpload
          name="upload"
          onChange={form.handleChange}
          files={form.values.upload}
          customClass={classes.fileUpload}
          error={form.errors.upload}
          touched={form.touched.upload}
        />
      )
    }
  }, [
    form.values.uploadType,
    form.values.uri,
    form.values.upload,
    form.handleChange,
    form.errors.uri,
    form.errors.upload,
    form.touched.uri,
    form.touched.upload,
    classes.inputLabel,
    classes.fileUpload
  ])

  const handleChangeTab = useCallback(
    (event, value) => {
      if (value) {
        form.setFieldValue('uploadType', value)
      }
    },
    [form]
  )

  return (
    <SideModal
      width="40%"
      title={translate.title}
      closeLink={routeByName.workplacePoster.root}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={() => form.setValues(intialFormValues.current)}
          isUpdate={!!id}
        />
      }
    >
      <Grid
        container
        direction="column"
        className={classes.wrapContent}
        spacing={16}
      >
        <Typography className={classes.labelSeparator}>
          Select Poster Type
        </Typography>
        <hr className={classes.separator} />
        <Grid container justify="center">
          <Grid item>
            <TabToggleButtonGroup
              name="uploadType"
              value={form.values.uploadType}
              exclusive
              onChange={handleChangeTab}
            >
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'upload'}
              >
                {translate.fileUpload}
              </TabToggleButton>
              <TabToggleButton
                className={classes.tabToggleButton}
                value={'URL'}
              >
                {translate.webUrl}
              </TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>
        </Grid>
        {getSelectedTabContent}
        <FormControlInput
          label="Title"
          id="title"
          handleChange={form.handleChange}
          value={form.values.title}
          error={form.errors.title}
          touched={form.touched.title}
          formControlLabelClass={classes.inputLabel}
        />
        <FormControlChips
          label={translate.tags}
          name="tag"
          options={transformedTags}
          values={form.values.tag}
          formControlLabelClass={classes.inputLabel}
          handleChange={form.handleChange}
        />
      </Grid>
    </SideModal>
  )
}

const mapStateToProps = ({ workplacePosters: { item, tags } }) => ({
  item: item.response,
  tags: tags.response
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      postItem,
      putItem,
      getItemById
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(AddEditWorkplacePoster)
    )
  )
)
