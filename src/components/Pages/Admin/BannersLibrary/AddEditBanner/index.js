import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { connect } from 'react-redux'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import moment from 'moment'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { withSnackbar } from 'notistack'
import { bindActionCreators } from 'redux'
import { useFormik } from 'formik'

import { SideModal } from 'components/Modal'
import {
  FormControlInput,
  FormControlSelect,
  WysiwygEditor,
  FormControlSingleDatePicker,
  FormControlSketchColorPicker
} from 'components/Form'
import { getItemById, postItem, putItem } from 'actions/bannerActions'
import FooterLayout from 'components/Modal/FooterLayout'
import routeByName from 'constants/routes'

const styles = theme => {
  const { palette, type } = theme
  return {
    addHelpPageWrap: {
      height: '100%'
    },
    addEditBannerDetails: {
      padding: '0 30px',
      overflowX: 'auto'
    },
    marginBottom40: {
      marginBottom: '40px'
    },

    bannerEditorWrap: {
      marginBottom: '15px'
    },
    bannerPreviewTitle: {
      marginBottom: '10px',
      fontSize: '13px',
      color: palette[type].formControls.label.color
    },
    bannerPreview: {
      marginBottom: '15px',
      minHeight: '250px',
      border: `1px solid ${palette[type].pages.banners.preview.border}`
    },
    additionalInfoWrap: {
      marginRight: '35px'
    }
  }
}

const AddEditBanner = ({
  t,
  item,
  classes,
  putItem,
  history,
  postItem,
  getItemById,
  orgRoleOptions,
  match: {
    params: { id }
  }
}) => {
  const translate = useMemo(
    () => ({
      title: id ? t('Edit Banner') : t('Add New Banner'),
      name: t('Name'),
      textPreview: t('Banner Text Preview'),
      userType: t('User Type'),
      expirationDate: t('Expiration Date'),
      color: t('Color')
    }),
    [id, t]
  )

  useEffect(() => {
    id && getItemById(id)
  }, [id, getItemById])

  const form = useFormik({
    initialValues: {
      bannerEditor: EditorState.createEmpty(),
      name: '',
      userRole: 1,
      expirationDate: moment(),
      color: '#e31c1c'
    },
    onSubmit: ({ name, color, userRole, expirationDate }) => {
      const formattedDate = moment(expirationDate).format('YYYY-MM-DD')

      const data = {
        name,
        content: getBannerEditorToHtml,
        color,
        expirationDate: formattedDate,
        // TODO Change userRole on dynamic data
        userRole: [userRole],
        status: 'Active'
      }

      if (id) {
        putItem(id, data)
      } else {
        postItem(data)
      }

      history.goBack()
    }
  })

  const intialFormValues = useRef(form.values)

  useEffect(() => {
    if (Object.keys(item.response).length && id) {
      const {
        response: { name, userRole, color, content, expirationDate }
      } = item
      const contentBlock = htmlToDraft(content)
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )

      intialFormValues.current = {
        ...form.values,
        name,
        color,
        userRole: userRole && userRole[0] ? userRole[0].id : null,
        expirationDate: moment(expirationDate),
        bannerEditor: EditorState.createWithContent(contentState)
      }

      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  const getBannerEditorToHtml = useMemo(() => {
    return draftToHtml(
      convertToRaw(form.values.bannerEditor.getCurrentContent())
    )
  }, [form.values.bannerEditor])

  const handleChangeColor = useCallback(
    color => form.setFieldValue('color', color),
    [form]
  )

  return (
    <SideModal
      width="64%"
      title={translate.title}
      closeLink={routeByName.banner.root}
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
        justify="space-between"
        wrap="nowrap"
        className={classes.addHelpPageWrap}
      >
        <Grid item xs className={classes.addEditBannerDetails}>
          <Grid container className={classes.marginBottom40}>
            <Grid item xs={12}>
              <FormControlInput
                id="name"
                value={form.values.name}
                handleChange={form.handleChange}
                fullWidth
                label={translate.name}
              />
            </Grid>
            <Grid item xs={12} className={classes.bannerEditorWrap}>
              <WysiwygEditor
                name="bannerEditor"
                editorState={form.values.bannerEditor}
                onChange={form.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.bannerPreviewTitle}>
                {translate.textPreview}
              </Typography>
              <div className={classes.bannerPreview}>
                {getBannerEditorToHtml}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={4} className={classes.additionalInfoWrap}>
                  <FormControlSelect
                    id="userRole"
                    fullWidth
                    value={form.values.userRole}
                    options={orgRoleOptions}
                    handleChange={form.handleChange}
                    label={translate.userType}
                  />
                </Grid>
                <Grid item xs={3} className={classes.additionalInfoWrap}>
                  <FormControlSingleDatePicker
                    name="expirationDate"
                    label={translate.expirationDate}
                    value={form.values.expirationDate}
                    handleChange={form.handleChange}
                    showDefaultInputIcon
                    inputIconPosition="after"
                    anchorDirection="right"
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormControlSketchColorPicker
                    id="color"
                    label={translate.color}
                    color={form.values.color}
                    handleChange={handleChangeColor}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SideModal>
  )
}

AddEditBanner.propTypes = {
  t: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  putItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  postItem: PropTypes.func.isRequired,
  getItemById: PropTypes.func.isRequired,
  orgRoleOptions: PropTypes.array.isRequired
}

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(
        ({
          config: {
            configOrgRole: { response }
          },
          banners: { item }
        }) => ({
          orgRoleOptions: response,
          item
        }),
        dispatch =>
          bindActionCreators(
            {
              postItem,
              putItem,
              getItemById
            },
            dispatch
          )
      )(AddEditBanner)
    )
  )
)
