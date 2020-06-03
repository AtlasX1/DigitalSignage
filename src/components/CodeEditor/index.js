import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import ExpansionPanel from '../Pages/Template/CreateTemplate/SettingsSide/ExpansionPanel'
import AceEditor from 'react-ace'

const styles = ({ palette, type }) => ({
  themeCardWrap: {
    border: `1px solid ${palette[type].formControls.input.border}`,
    backgroundColor: palette[type].formControls.input.background,
    borderRadius: '4px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: `1px solid ${palette[type].formControls.input.border}`,
    color: palette[type].formControls.input.color,
    fontSize: '12px'
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: palette[type].formControls.input.color
  },
  marginTop2: {
    marginTop: '21px'
  }
})

const CodeEditor = ({
  classes,
  t,
  valueJS = '',
  valueCSS = '',
  valueHTML = '',
  nameCSS = 'css',
  nameJS = 'javascript',
  nameHTML = 'html',
  onChange
}) => {
  const handleChangeCSS = useCallback(
    value => {
      onChange({ target: { name: nameCSS, value } })
    },
    [nameCSS, onChange]
  )

  const handleChangeJS = useCallback(
    value => {
      onChange({ target: { name: nameJS, value } })
    },
    [nameJS, onChange]
  )

  const handleChangeHTML = useCallback(
    value => {
      onChange({ target: { name: nameHTML, value } })
    },
    [nameHTML, onChange]
  )

  return (
    <Grid container justify="space-between" className={classes.marginTop2}>
      <Grid item xs={12} className={classes.themeCardWrap}>
        <header className={classes.themeHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography className={classes.themeHeaderText}>
                {t('Editor')}
              </Typography>
            </Grid>
          </Grid>
        </header>
        <ExpansionPanel
          expanded={false}
          title={'HTML'}
          children={
            <Grid item xs={12}>
              <AceEditor
                name={nameHTML}
                theme="chrome"
                mode="html"
                width="auto"
                height="225px"
                value={valueHTML}
                onChange={handleChangeHTML}
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
              />
            </Grid>
          }
        />
        <ExpansionPanel
          expanded={false}
          title={'CSS'}
          children={
            <Grid item xs={12}>
              <AceEditor
                name={nameCSS}
                theme="chrome"
                mode="css"
                width="auto"
                height="225px"
                showPrintMargin={false}
                value={valueCSS}
                onChange={handleChangeCSS}
                editorProps={{ $blockScrolling: true }}
              />
            </Grid>
          }
        />
        <ExpansionPanel
          expanded={false}
          title={'Javascript'}
          children={
            <Grid item xs={12}>
              <AceEditor
                name={nameJS}
                theme="chrome"
                mode="javascript"
                width="auto"
                height="225px"
                showPrintMargin={false}
                value={valueJS}
                onChange={handleChangeJS}
                editorProps={{ $blockScrolling: true }}
              />
            </Grid>
          }
        />
      </Grid>
    </Grid>
  )
}

CodeEditor.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  valueJS: PropTypes.string,
  valueCSS: PropTypes.string,
  valueHTML: PropTypes.string,
  nameCSS: PropTypes.string,
  nameJS: PropTypes.string,
  nameHTML: PropTypes.string,
  onChange: PropTypes.func
}

export default translate('translations')(withStyles(styles)(CodeEditor))
