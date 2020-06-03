import React, { useCallback, useEffect, useMemo } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { SideModal } from '../../../Modal'
import { FormControlInput } from '../../../Form'
import { BlueButton } from '../../../Buttons'
import { useFormik } from 'formik'
import routeByName from 'constants/routes'
import {
  postTag,
  getTags,
  deleteTag,
  clearResponseInfo
} from '../../../../actions/workplacePosterActions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { notificationAnalyzer } from '../../../../utils'
import { withSnackbar } from 'notistack'
import TagsList from './TagsList'
import * as Yup from 'yup'

const styles = theme => ({
  manageCategoriesWrap: {
    marginBottom: 40,
    padding: '0 30px '
  },
  newCategoryNameWrap: {
    display: 'flex',
    flex: 1
  },
  controlInput: {
    flex: '1 1 auto'
  },
  addBtn: {
    height: 38,
    marginTop: 24,
    marginLeft: 10,
    width: 40
  }
})

const ManageAnnouncementCategory = ({
  t,
  classes,
  clearResponseInfo,
  getTags,
  tags,
  enqueueSnackbar,
  deleteTagAction,
  postTagAction,
  postTag,
  delTag
}) => {
  const form = useFormik({
    initialValues: {
      title: ''
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Please enter field')
    }),
    onSubmit: values => postTagAction(values)
  })

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [postTag, delTag],
      'Tag'
    )

    if (wasNotify) {
      clearResponseInfo()
      getTags()
    }
    // eslint-disable-next-line
  }, [postTag, delTag])

  const handleReorder = useCallback((...rest) => {
    console.log({ rest })
  }, [])

  const handleDeleteTag = useCallback(
    id => {
      deleteTagAction(id)
    },
    [deleteTagAction]
  )

  const translate = useMemo(
    () => ({
      add: t('Add'),
      categoryName: t('Category Name'),
      title: t('Workplace Posters Tags')
    }),
    [t]
  )

  return (
    <SideModal
      width="35%"
      title={translate.title}
      closeLink={routeByName.workplacePoster.root}
    >
      <Grid container className={classes.manageCategoriesWrap}>
        <div className={classes.newCategoryNameWrap}>
          <FormControlInput
            id="title"
            value={form.values.title}
            error={form.errors.title}
            touched={form.touched.title}
            handleChange={form.handleChange}
            formControlContainerClass={classes.controlInput}
            label={translate.categoryName}
          />
          <BlueButton
            fullWidth
            onClick={form.handleSubmit}
            className={classes.addBtn}
          >
            {translate.add}
          </BlueButton>
        </div>
        <Grid item xs={12}>
          <TagsList
            items={tags}
            onReorder={handleReorder}
            onDelete={handleDeleteTag}
          />
        </Grid>
      </Grid>
    </SideModal>
  )
}

const mapStateToProps = ({
  workplacePosters: {
    tags: { response },
    delTag,
    postTag
  }
}) => ({
  tags: response,
  delTag,
  postTag
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      postTagAction: postTag,
      getTags,
      deleteTagAction: deleteTag,
      clearResponseInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(ManageAnnouncementCategory)
    )
  )
)
