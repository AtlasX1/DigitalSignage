import React, { useEffect, useMemo } from 'react'
import { translate } from 'react-i18next'

import { withStyles } from '@material-ui/core'
import { SideModal } from 'components/Modal'
import { FormControlInput } from 'components/Form'
import { BlueButton } from 'components/Buttons'
import { useFormik } from 'formik'
import routeByName from 'constants/routes'
import {
  postCategoryIntoFeature,
  clearCategoryResponseInfo,
  getCategoriesByFeature
} from 'actions/categoriesActions'
import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { notificationAnalyzer } from 'utils'
import { withSnackbar } from 'notistack'
import CategoriesList from './CategoriesList'
import { ALL_RECORD } from 'constants/library'
import FormControlSelectIcons from 'components/Form/FormControlSelectIcon'
import * as Yup from 'yup'
import { requiredIconValidateSchema } from 'constants/validations'

const styles = theme => ({
  addBtn: {
    marginTop: 7,
    width: 62
  },
  controlInput: {
    flexGrow: 2,
    marginRight: 10
  },
  controlSelect: {
    flexGrow: 1,
    marginRight: 10
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 30px',
    height: 'inherit'
  },
  wrapperControlElements: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  selectIcon: {
    marginRight: 10
  }
})

const ManageCategory = ({
  t,
  del,
  put,
  post,
  meta,
  items,
  feature,
  classes,
  enqueueSnackbar,
  title = 'Unknown',
  getCategoriesByFeature,
  postCategoryIntoFeature,
  clearCategoryResponseInfo,
  closeLink = routeByName.dashboard.root
}) => {
  const form = useFormik({
    initialValues: {
      name: '',
      icon: null
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Please enter field'),
      icon: requiredIconValidateSchema
    }),
    onSubmit: values => {
      postCategoryIntoFeature(feature, { ...values, icon: values.icon.value })
      form.resetForm()
    }
  })

  useEffect(() => {
    getCategoriesByFeature(feature, { limit: ALL_RECORD })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (meta.total > meta.count) {
      getCategoriesByFeature(feature, { limit: meta.total })
    }
  }, [feature, getCategoriesByFeature, meta.count, meta.total])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'Category'
    )

    if (wasNotify) {
      clearCategoryResponseInfo()
      getCategoriesByFeature(feature, { limit: meta.total })
    }
    // eslint-disable-next-line
  }, [post, put, del])

  const translate = useMemo(
    () => ({
      add: t('Add'),
      icon: t('Icon'),
      categoryName: t('Category Name')
    }),
    [t]
  )

  return (
    <SideModal width="35%" title={title} closeLink={closeLink}>
      <div className={classes.wrapper}>
        <div className={classes.wrapperControlElements}>
          <FormControlInput
            id="name"
            value={form.values.name}
            handleChange={form.handleChange}
            fullWidth
            label={translate.categoryName}
            formControlContainerClass={classes.controlInput}
            error={form.errors.name}
            touched={form.touched.name}
          />
          <FormControlSelectIcons
            name="icon"
            label={translate.icon}
            rootClass={classes.selectIcon}
            value={form.values.icon}
            onChange={form.handleChange}
            error={form.errors.icon}
            touched={form.touched.icon}
          />
          <BlueButton
            fullWidth
            className={classes.addBtn}
            onClick={form.handleSubmit}
          >
            {translate.add}
          </BlueButton>
        </div>

        <CategoriesList items={items} />
      </div>
    </SideModal>
  )
}

const mapStateToProps = (
  { categories: { categoriesByFeature, del, post, put } },
  { feature }
) => ({
  items: categoriesByFeature[feature].response,
  meta: categoriesByFeature[feature].meta,
  del,
  post,
  put
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      postCategoryIntoFeature,
      clearCategoryResponseInfo,
      getCategoriesByFeature
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withSnackbar,
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(ManageCategory)
