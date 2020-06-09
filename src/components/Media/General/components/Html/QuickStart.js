import React, { useEffect, useState } from 'react'

import { get as _get } from 'lodash'

import AceEditor from 'react-ace'
import 'brace/mode/css'
import 'brace/mode/html'
import 'brace/mode/javascript'
import '../aceThemeImports'
import '../../../../../styles/forms/_code-editor.scss'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlSelect } from '../../../../Form'
import { SingleIconTab, SingleIconTabs } from '../../../../Tabs'
import MediaHtmlCarousel from '../../../MediaHtmlCarousel'
import ExpansionPanel from '../../../../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'

import { Base64 } from 'js-base64'
import classNames from 'classnames'

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
  loaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '100px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(255,255,255,.5)',
    zIndex: 1
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
    color: '#4c5057'
  },
  featureIconTabContainer: {
    justifyContent: 'center'
  },
  featureIconTab: {
    '&:not(:last-child)': {
      marginRight: '30px'
    }
  },
  marginTop: {
    marginTop: 16
  },
  editorSelect: {
    width: '165px'
  },
  editorInput: {
    height: '29px'
  },
  editorSelectMenu: {
    maxHeight: 300
  },
  sliderInputLabel: {
    ...theme.formControls.mediaApps.refreshEverySlider.label,
    lineHeight: '15px',
    marginRight: '15px'
  },
  sliderInputClass: {
    width: '46px'
  }
})

const QuickStart = ({
  classes,
  values = {},
  errors = {},
  touched = {},
  onChange = f => f,
  editorThemes = [],
  mediaSource = [],
  mode = 'add'
}) => {
  const [contentTabs, setContentTabs] = useState([])
  const [selectedFeedId, setSelectedFeedId] = useState(null)
  const [selectedFeedContent, setSelectedFeedContent] = useState([])
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(undefined)

  const handleFeedIdChange = (event, contentId) => {
    setSelectedFeedId(contentId)
    const content = contentTabs.find(i => i.id === contentId)
    setSelectedFeedContent(content.source)
  }

  const handleSlideClick = slide => {
    onChange('contentSourceId', slide.value.id)
    if (slide.value.content) {
      const { html, css, javascript } = slide.value.content
      onChange('content', {
        ...(!!html && { html: Base64.decode(html) }),
        ...(!!css && { css: Base64.decode(css) }),
        ...(!!javascript && { js: Base64.decode(javascript) })
      })
    }
  }

  useEffect(() => {
    if (contentTabs.length) {
      handleFeedIdChange({}, selectedFeedId)
    }
    // eslint-disable-next-line
  }, [contentTabs, selectedFeedId])

  useEffect(() => {
    if (mediaSource) {
      setContentTabs(mediaSource)

      if (values.contentSourceId) {
        const selectedFeed = mediaSource.find(item => {
          const activeItem = item.source.find((i, index) => {
            if (i.id === values.contentSourceId) {
              setSelectedSlideIndex(index)
              return true
            }
            return false
          })
          return !!activeItem
        })
        if (selectedFeed && selectedFeedId !== selectedFeed.id) {
          setSelectedFeedId(selectedFeed.id)
        }
      }

      if (mediaSource[0] && !values.contentSourceId) {
        if (selectedFeedId !== mediaSource[0].id) {
          setSelectedFeedId(mediaSource[0].id)
        }

        if (mode === 'add') {
          if (values.contentSourceId !== mediaSource[0].source[0].id) {
            onChange('contentSourceId', mediaSource[0].source[0].id)
          }
          const html = _get(mediaSource[0].source[0], 'content.html')
          const css = _get(mediaSource[0].source[0], 'content.css')
          const js = _get(mediaSource[0].source[0], 'content.javascript')

          onChange('content', {
            ...(!!html && { html: Base64.decode(html) }),
            ...(!!css && { css: Base64.decode(css) }),
            ...(!!js && { js: Base64.decode(js) })
          })
        }
      }
    }
    // eslint-disable-next-line
  }, [mediaSource, values.contentSourceId])

  return (
    <>
      <Grid container justify="center" className={classes.marginTop}>
        <Grid item xs={12} className={classes.themeCardWrap}>
          {!!contentTabs.length && (
            <Grid item xs={12} className={classes.themeCardWrap}>
              <header className={classes.themeHeader}>
                <SingleIconTabs
                  value={selectedFeedId}
                  onChange={handleFeedIdChange}
                  className={classes.featureIconTabContainer}
                >
                  {contentTabs.map((tab, index) => (
                    <SingleIconTab
                      className={classes.featureIconTab}
                      icon={
                        <TabIcon iconClassName={classNames('fa', tab.icon)} />
                      }
                      disableRipple={true}
                      value={tab.id}
                      key={`tab_${index}`}
                    />
                  ))}
                </SingleIconTabs>
              </header>
              <MediaHtmlCarousel
                selectedSlideIndex={selectedSlideIndex}
                settings={{
                  infinite: false
                }}
                activeSlide={values.contentSourceId}
                slides={selectedFeedContent.map((content, index) => ({
                  name: content.id,
                  value: content,
                  content: (
                    <img
                      src={content.thumbUri}
                      alt={content.tooltip}
                      key={`selected_feed_${index}`}
                    />
                  )
                }))}
                onSlideClick={handleSlideClick}
                error={errors.contentSourceId}
                touched={touched.contentSourceId}
              />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid container justify="space-between" className={classes.marginTop}>
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
            expanded={false}
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
                {_get(errors, 'content.css') &&
                  _get(touched, 'content.css') && (
                    <ErrorMessage error={errors.content.css} />
                  )}
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
                {_get(errors, 'content.js') && _get(touched, 'content.js') && (
                  <ErrorMessage error={errors.content.js} />
                )}
              </Grid>
            }
          />
        </Grid>
      </Grid>
    </>
  )
}

export default withStyles(styles)(QuickStart)
