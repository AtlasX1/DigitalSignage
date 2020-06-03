import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'
import { connect } from 'react-redux'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import { useFormik } from 'formik'

import { SideModal } from 'components/Modal'
import { FormControlInput, FormControlSelect } from 'components/Form'
import CodeCreator from 'components/CodeEditor'
import { orientations } from '../options'
import { FileUpload } from 'components/Media/General/components/Upload'
import Preview from './Preview'
import routeByName from 'constants/routes'
import { groupActions, groupValidationSchema } from './config'
import { ANNOUNCEMENT, HTML_CONTENT } from 'constants/library'
import FooterLayout from 'components/Modal/FooterLayout'
import featureConstants from 'constants/featureConstants'
import useCategoryOptions from 'hooks/tableLibrary/useCategoryOptions'

const styles = () => ({
  wrapContent: {
    padding: 20
  },
  inputLabel: {
    fontSize: 18
  },
  leftContent: {
    height: 'inherit',
    overflow: 'auto'
  },
  fileUpload: {
    marginTop: '20px',
    height: '140px !important'
  },
  rightContent: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column'
  }
})

const AddEditSideModal = ({
  t,
  item,
  classes,
  putItem,
  postItem,
  getItemById,
  history,
  variant,
  match: {
    params: { id }
  }
}) => {
  const [preview, setPreview] = useState('')
  const categories = useCategoryOptions(featureConstants[variant])

  useEffect(() => {
    if (id) {
      getItemById(id)
    }
  }, [id, getItemById])

  const translate = useMemo(
    () => ({
      [ANNOUNCEMENT]: {
        addTitle: t('Add Announcement Theme'),
        editTitle: t('Edit Announcement Theme')
      },
      [HTML_CONTENT]: {
        addTitle: t('Add HTML Widget'),
        editTitle: t('Edit HTML Widget')
      }
    }),
    [t]
  )

  const form = useFormik({
    initialValues: {
      name: '',
      javascript: '',
      css: '',
      html: '',
      orientation: '',
      thumbUri: null,
      categoryId: ''
    },
    validationSchema: id
      ? groupValidationSchema[variant].edit
      : groupValidationSchema[variant].add,
    onSubmit: values => {
      const formData = new FormData()

      Object.keys(values).forEach(
        key => key !== 'thumbUri' && formData.append(key, values[key])
      )
      if (Array.isArray(values.thumbUri)) {
        formData.append('thumbUri', values.thumbUri[0])
      } else {
        formData.append('thumbUri', preview)
      }

      id ? putItem(id, formData) : postItem(formData)

      history.goBack()
    }
  })

  const intialFormValues = useRef(form.values)

  useEffect(() => {
    if (Object.keys(item).length && id) {
      const {
        name,
        javascript,
        css,
        html,
        orientation,
        thumbUri,
        category: { id: categoryId }
      } = item
      setPreview(thumbUri)

      intialFormValues.current = {
        ...form.values,
        name,
        javascript: javascript || '',
        css: css || '',
        html: html || '',
        orientation,
        categoryId
      }

      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  const handleChangeFileUpload = useCallback(
    ({ target: { name, value } }) => {
      setPreview(value)
      form.setFieldValue(name, value)
    },
    [form]
  )

  return (
    <SideModal
      width="64%"
      title={id ? translate[variant].editTitle : translate[variant].addTitle}
      closeLink={routeByName[variant].root}
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
        justify="space-between"
        className={classes.wrapContent}
        spacing={16}
        style={{ height: 'inherit' }}
      >
        <Grid item xs={6} className={classes.leftContent}>
          <FormControlInput
            label="Name"
            id="name"
            handleChange={form.handleChange}
            value={form.values.name}
            error={form.errors.name}
            touched={form.touched.name}
            formControlLabelClass={classes.inputLabel}
          />
          <Grid container spacing={16}>
            <Grid item xs>
              <FormControlSelect
                label="Category"
                id="categoryId"
                options={categories}
                value={form.values.categoryId}
                handleChange={form.handleChange}
                error={form.errors.categoryId}
                touched={form.touched.categoryId}
              />
            </Grid>
            {variant === ANNOUNCEMENT && (
              <Grid item xs={6}>
                <FormControlSelect
                  label="Orientation"
                  id="orientation"
                  options={orientations}
                  value={form.values.orientation}
                  handleChange={form.handleChange}
                  error={form.errors.orientation}
                  touched={form.touched.orientation}
                />
              </Grid>
            )}
          </Grid>
          <CodeCreator
            valueJS={form.values.javascript}
            valueCSS={form.values.css}
            valueHTML={form.values.html}
            onChange={form.handleChange}
          />
        </Grid>

        <Grid item xs={6} style={{ height: 'inherit', overflow: 'auto' }}>
          <div className={classes.rightContent}>
            <FileUpload
              name="thumbUri"
              files={form.values.thumbUri}
              customClass={classes.fileUpload}
              onChange={handleChangeFileUpload}
              error={form.errors.thumbUri}
              touched={form.touched.thumbUri}
            />
            <Preview content={preview} />
          </div>
        </Grid>
      </Grid>
    </SideModal>
  )
}

const mapStateToProps = (state, { variant }) => ({
  item: state[variant].item.response
})

const mapDispatchToProps = (dispatch, { variant }) =>
  bindActionCreators(
    {
      ...groupActions[variant]
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(AddEditSideModal))
  )
)
