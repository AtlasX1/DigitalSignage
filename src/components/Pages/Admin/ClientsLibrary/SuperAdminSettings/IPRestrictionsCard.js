import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import { CheckboxSwitcher } from '../../../../Checkboxes'
import InputWithAdornment from './InputWithAdornment'

const styles = ({ palette, type }) => ({
  root: {
    margin: '0 0 15px',
    padding: '0 0 0 15px',
    border: `5px solid ${palette[type].pages.rss.addRss.upload.border}`,
    backgroundImage: palette[type].pages.rss.addRss.upload.background,
    borderRadius: '4px'
  },
  headerText: {
    fontWeight: 'bold',
    color: palette[type].pages.rss.addRss.upload.titleColor
  },
  adornmentBtn: {
    fontSize: '18px'
  },
  edit: {
    color: '#0a84c8'
  },
  delete: {
    color: '#d0021b'
  }
})

const IPRestrictionsCard = ({ t, classes, ...props }) => {
  return (
    <Grid container direction="column" className={classes.root}>
      <Grid item>
        <CheckboxSwitcher
          label={t('IP Restrictions')}
          formControlLabelClass={classes.headerText}
        />
      </Grid>
      <Grid item>
        <InputWithAdornment
          fullWidth={true}
          id="ip-whitelist"
          label={t('IP Whitelist')}
        />
      </Grid>
    </Grid>
  )
}

export default translate('translations')(withStyles(styles)(IPRestrictionsCard))
