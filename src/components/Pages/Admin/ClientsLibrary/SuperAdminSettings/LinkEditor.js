import React, { useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { FormControlInput, WysiwygEditor } from '../../../../Form'
import { TabToggleButton, TabToggleButtonGroup } from '../../../../Buttons'

const styles = ({ palette, type }) => ({
  root: {
    margin: '0 0 15px',
    border: `5px solid ${palette[type].pages.rss.addRss.upload.border}`,
    backgroundImage: palette[type].pages.rss.addRss.upload.background,
    borderRadius: '4px'
  },
  header: {
    padding: '10px 15px 20px'
  },
  headerText: {
    fontWeight: 'bold',
    color: palette[type].pages.rss.addRss.upload.titleColor
  },
  inputWrap: {
    paddingLeft: '15px',
    paddingRight: '15px'
  }
})

const LinkEditor = ({ t, classes, ...props }) => {
  const { id, type, title } = props
  const [linkEditor, setLinkEditor] = useState(type ? t('Link') : t('Editor'))

  return (
    <div className={classes.root}>
      <Grid container justify="space-between" className={classes.header}>
        <Grid item>
          <Typography className={classes.headerText}>{title}</Typography>
        </Grid>
        <Grid item>
          <TabToggleButtonGroup
            exclusive
            value={linkEditor}
            onChange={(event, type) => setLinkEditor(type)}
          >
            <TabToggleButton value={t('Link')}>{t('Link')}</TabToggleButton>
            <TabToggleButton value={t('Editor')}>{t('Editor')}</TabToggleButton>
          </TabToggleButtonGroup>
        </Grid>
      </Grid>

      {linkEditor === t('Link') ? (
        <div className={classes.inputWrap}>
          <FormControlInput id={`link-${id}`} fullWidth={true} label={false} />
        </div>
      ) : (
        <WysiwygEditor />
      )}
    </div>
  )
}

export default translate('translations')(withStyles(styles)(LinkEditor))
