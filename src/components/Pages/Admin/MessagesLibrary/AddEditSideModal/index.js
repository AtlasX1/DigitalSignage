import React, { useEffect, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from 'draftjs-to-html'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { useFormik } from 'formik'

import { SideModal } from 'components/Modal'
import { FormControlInput, WysiwygEditor } from 'components/Form'
import { groupActions } from './config'
import routeByName from 'constants/routes'
import FooterLayout from 'components/Modal/FooterLayout'

const styles = () => ({
  addHelpPageWrap: {
    height: '100%'
  },
  addHelpPageDetails: {
    padding: '0 30px',
    height: 'inherit',
    overflow: 'auto'
  },
  container: {
    marginBottom: '40px'
  }
})

const AddEditSideModal = ({
  t,
  item,
  classes,
  putItem = f => f,
  variant,
  getItemById,
  postItem = f => f,
  history,
  match: {
    params: { id }
  }
}) => {
  const translate = useMemo(
    () => ({
      subject: t('Subject'),
      name: t('Name'),
      title: id ? t('Add E-mail Templates') : t('Update E-mail Templates')
    }),
    [id, t]
  )

  useEffect(() => {
    id && getItemById(id)
    //eslint-disable-next-line
  }, [])

  const form = useFormik({
    initialValues: {
      emailTemplateEditor: EditorState.createEmpty(),
      title: '',
      subject: ''
    },
    onSubmit: ({ title, subject }) => {
      const data = {
        title,
        body: getBannerEditorToHtml,
        subject,
        status: 'Active'
      }

      id ? putItem(id, data) : postItem(data)
      history.goBack()
    }
  })

  const getBannerEditorToHtml = useMemo(() => {
    return draftToHtml(
      convertToRaw(form.values.emailTemplateEditor.getCurrentContent())
    )
  }, [form.values.emailTemplateEditor])

  const intialFormValues = useRef(form.values)

  useEffect(() => {
    if (Object.keys(item.response).length && id) {
      const {
        response: { title, subject, body }
      } = item
      const contentBlock = htmlToDraft(body)
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      )

      intialFormValues.current = {
        ...form.values,
        title,
        subject,
        emailTemplateEditor: EditorState.createWithContent(contentState)
      }
      form.setValues(intialFormValues.current)
    }
    //eslint-disable-next-line
  }, [item])

  return (
    <SideModal
      width="64%"
      title={translate.title}
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
        direction="column"
        justify="space-between"
        className={classes.addHelpPageWrap}
      >
        <Grid item className={classes.addHelpPageDetails}>
          <Grid container className={classes.container}>
            <Grid item xs={12}>
              <FormControlInput
                id="title"
                value={form.values.title}
                fullWidth
                label={translate.name}
                handleChange={form.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlInput
                id="subject"
                value={form.values.subject}
                fullWidth
                label={translate.subject}
                handleChange={form.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <WysiwygEditor
                name="emailTemplateEditor"
                editorState={form.values.emailTemplateEditor}
                onChange={form.handleChange}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </SideModal>
  )
}

AddEditSideModal.propTypes = {
  variant: PropTypes.string.isRequired
}

const mapStateToProps = (state, { variant }) => ({
  item: state[variant].item
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
    connect(mapStateToProps, mapDispatchToProps)(AddEditSideModal)
  )
)
