import React, { useState, useEffect } from 'react'

import AceEditor from 'react-ace'
import 'brace/mode/css'
import 'brace/mode/html'
import 'brace/mode/javascript'
import '../aceThemeImports'
import '../../../../../styles/forms/_code-editor.scss'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../../../../Buttons'

import { FormControlSelect, WysiwygEditor } from '../../../../Form'
import ExpansionPanel from '../../../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { get as _get } from 'lodash'

const TabIconStyles = theme => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const InfoMessageStyles = theme => ({
  infoMessageContainer: {
    display: 'flex',
    padding: '12px 12px 27px',
    borderBottom: '1px solid #E4E9F3',
    color: '#74809A'
  },
  infoMessage: {
    marginLeft: '10px',
    fontSize: '12px',
    fontStyle: 'italic',
    lineHeight: '15px'
  },
  errorMessageContainer: {
    display: 'flex',
    padding: '12px 12px 27px',
    borderBottom: '1px solid #E4E9F3',
    color: '#74809A'
  },
  errorMessage: {
    marginLeft: '10px',
    fontSize: '12px',
    fontStyle: 'italic',
    lineHeight: '15px',
    color: 'red'
  }
})

const InfoMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.infoMessageContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.infoMessage}>
        e.g. (please enter only body section area)
      </div>
    </div>
  )
)

const ErrorMessage = withStyles(InfoMessageStyles)(
  ({ iconClassName = '', classes, error }) => (
    <div className={classes.errorMessageContainer}>
      <div className={classes.errorMessage}>{error}</div>
    </div>
  )
)

const styles = theme => ({
  root: {
    margin: '22px 30px'
  },
  tabToggleButtonGroup: {},
  tabToggleButton: {
    width: '128px'
  },
  themeCardWrap: {
    border: 'solid 1px #e4e9f3',
    backgroundColor: 'rgba(245, 246, 250, 0.5)',
    borderRadius: '4px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: '1px solid #e4e9f3',
    color: '#4C5057',
    fontSize: '12px'
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: '#4c5057',
    fontSize: '12px'
  },
  previewMediaBtn: {
    padding: '10px 25px 8px',
    border: 'solid 1px #cbd3e3',
    backgroundImage: 'linear-gradient(to right, #ffffff, #fefefe)',
    borderRadius: '4px',
    boxShadow: 'none'
  },
  previewMediaRow: {
    marginTop: '23px'
  },
  previewMediaText: {
    fontWeight: 'bold',
    color: '#818ca4'
  },
  featureIconTabContainer: {
    justifyContent: 'center'
  },
  featureIconTab: {
    '&:not(:last-child)': {
      marginRight: '30px'
    }
  },
  marginTop1: {
    marginTop: '25px'
  },
  marginTop2: {
    marginTop: '21px'
  },
  marginTop3: {
    marginTop: '15px'
  },
  editorSelect: {
    width: '165px'
  },
  editorInput: {
    height: '29px'
  },
  sliderInputLabel: {
    color: '#74809A',
    fontSize: '13px',
    lineHeight: '15px',
    marginRight: '15px'
  },
  sliderInputClass: {
    width: '46px'
  },
  plainText: {
    margin: 0,
    height: 114,
    width: '100%',
    padding: 10,
    borderRadius: 5,
    borderColor: 'transparent',
    resize: 'vertical',
    maxHeight: 300
  }
})

const Code = props => {
  const { classes, values, touched, errors, onChange, editorThemes } = props

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(
    () => {
      if (values.sub_section === 'richText' && values.content.text) {
        const contentBlock = htmlToDraft(values.content.text)
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        )

        setEditorState(EditorState.createWithContent(contentState))
      }
    },
    //eslint-disable-next-line
    [values.sub_section]
  )

  useEffect(
    () => {
      const val = draftToHtml(convertToRaw(editorState.getCurrentContent()))
      onChange('content.text', val)
    },
    //eslint-disable-next-line
    [editorState]
  )

  const getSelectedTabContent = () => {
    switch (values.sub_section) {
      case 'plainText':
        return (
          <Grid container className={classes.marginTop3}>
            <Grid item xs={12} style={{ padding: 10 }}>
              <textarea
                className={classes.plainText}
                value={values.content.text}
                onChange={e => onChange('content.text', e.target.value)}
              />
              {_get(errors, 'content.text') &&
                _get(touched, 'content.text') && (
                  <ErrorMessage error={errors.content.text} />
                )}
            </Grid>
          </Grid>
        )
      case 'richText':
        return (
          <Grid container className={classes.marginTop3}>
            <Grid item>
              <WysiwygEditor
                editorState={editorState}
                onChange={e => setEditorState(e.target.value)}
              />
              {_get(errors, 'content.text') &&
                _get(touched, 'content.text') && (
                  <ErrorMessage error={errors.content.text} />
                )}
            </Grid>
          </Grid>
        )
      case 'htmlCssJs':
        return getHtmlCssComponent()
      default:
        return (
          <Grid container className={classes.marginTop3}>
            <Grid item>
              <textarea
                className={classes.plainText}
                value={values.content.text}
                onChange={e => onChange('content.text', e.target.value)}
              />
              {_get(errors, 'content.text') &&
                _get(touched, 'content.text') && (
                  <ErrorMessage error={errors.content.text} />
                )}
            </Grid>
          </Grid>
        )
    }
  }

  const getHtmlCssComponent = () => (
    <Grid container justify="space-between" className={classes.marginTop2}>
      <Grid item xs={12} className={classes.themeCardWrap}>
        <header className={classes.themeHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography className={classes.themeHeaderText}>
                Editor
              </Typography>
            </Grid>
            <Grid item>
              <FormControlSelect
                custom={true}
                formControlContainerClass={classes.editorSelect}
                customMenuPaperClassName={classes.editorSelectMenu}
                inputClasses={{ input: classes.editorInput }}
                marginBottom={false}
                value={values.editor.theme}
                error={errors.editor && errors.editor.theme}
                touched={touched.editor && touched.editor.theme}
                options={editorThemes.map(name => ({
                  component: <span>{name}</span>,
                  value: name
                }))}
                handleChange={e => onChange('editor.theme', e.target.value)}
              />
            </Grid>
          </Grid>
        </header>
        <ExpansionPanel
          expanded={true}
          title={'HTML'}
          children={
            <Grid item xs={12}>
              <AceEditor
                theme={values.editor.theme}
                mode="html"
                width="auto"
                height="225px"
                showPrintMargin={false}
                value={values.content.html}
                onChange={val => onChange('content.html', val)}
              />
              <InfoMessage iconClassName={'icon-interface-information-1'} />
              {_get(errors, 'content.html') &&
                _get(touched, 'content.html') && (
                  <ErrorMessage error={errors.content.html} />
                )}
            </Grid>
          }
        />
        <ExpansionPanel
          expanded={false}
          title={'CSS'}
          children={
            <Grid item xs={12}>
              <AceEditor
                theme={values.editor.theme}
                mode="css"
                width="auto"
                height="225px"
                showPrintMargin={false}
                value={values.content.css}
                onChange={val => onChange('content.css', val)}
              />
              <InfoMessage iconClassName={'icon-interface-information-1'} />
            </Grid>
          }
        />
        <ExpansionPanel
          expanded={false}
          title={'Javascript'}
          children={
            <Grid item xs={12}>
              <AceEditor
                theme={values.editor.theme}
                mode="javascript"
                width="auto"
                height="225px"
                showPrintMargin={false}
                value={values.content.js}
                onChange={val => onChange('content.js', val)}
              />
              <InfoMessage iconClassName={'icon-interface-information-1'} />
            </Grid>
          }
        />
      </Grid>
    </Grid>
  )

  return (
    <Grid container justify="center" className={classes.marginTop1}>
      <Grid item xs={12} className={classes.themeCardWrap}>
        <header className={classes.themeHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography className={classes.themeHeaderText}>
                HTML Text:
              </Typography>
            </Grid>
          </Grid>
        </header>
        <Grid container justify="center" className={classes.marginTop1}>
          <Grid item>
            <TabToggleButtonGroup
              value={values.sub_section}
              exclusive
              onChange={(e, v) => v && onChange('sub_section', v)}
            >
              <TabToggleButton
                className={classes.tabToggleButton}
                value="plainText"
              >
                Plain Text
              </TabToggleButton>
              <TabToggleButton
                className={classes.tabToggleButton}
                value="richText"
              >
                Rich Text
              </TabToggleButton>
              <TabToggleButton
                className={classes.tabToggleButton}
                value="htmlCssJs"
              >
                HTML-CSS
              </TabToggleButton>
            </TabToggleButtonGroup>
          </Grid>
        </Grid>
        {getSelectedTabContent()}
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(Code)
