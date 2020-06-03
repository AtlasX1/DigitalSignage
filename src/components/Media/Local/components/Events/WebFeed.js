import React from 'react'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlInput } from '../../../../Form/index'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#9394A0'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const DownloadFileButtonClasses = ({ typography }) => ({
  DownloadFileButtonContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  DownloadFileButton: {
    marginLeft: '6px',
    fontSize: '11px',
    lineHeight: '13px',
    fontFamily: typography.fontFamily,
    color: '#74809A'
  }
})

const DownloadFileButton = withStyles(DownloadFileButtonClasses)(
  ({ iconClassName = '', text = '', classes }) => (
    <div className={classes.DownloadFileButtonContainer}>
      <TabIcon iconClassName={iconClassName} />
      <div className={classes.DownloadFileButton}>{text}</div>
    </div>
  )
)

const styles = () => ({
  themeCardWrap: {
    border: 'solid 1px #e4e9f3',
    backgroundColor: 'rgba(245, 246, 250, 0.5)',
    borderRadius: '4px'
  },
  themeHeader: {
    padding: '0 15px',
    borderBottom: '1px solid #e4e9f3'
  },
  themeHeaderText: {
    fontWeight: 'bold',
    lineHeight: '42px',
    color: '#4c5057',
    fontSize: '12px'
  },
  formControlRootClass: {
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 0
  },
  fileTypeLabel: {
    fontSize: '11px',
    lineHeight: '13px',
    fontWeight: '500',
    marginRight: '27px',
    '&:last-of-type': {
      marginRight: '0'
    }
  },
  marginTop1: {
    marginTop: '15px'
  }
})

const WebFeed = ({ classes }) => (
  <>
    <Grid container>
      <Grid item xs={12}>
        <FormControlInput
          formControlRootClass={classes.formControlRootClass}
          label={'Event URL:'}
          className={classes.formControlInput}
          fullWidth={true}
        />
      </Grid>
    </Grid>
    <Grid container className={classes.marginTop1}>
      <Grid item xs={12} className={classes.themeCardWrap}>
        <header className={classes.themeHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography className={classes.themeHeaderText}>
                Download Sample Files
              </Typography>
            </Grid>
            <Grid item>
              <Grid container>
                <Grid item className={classes.fileTypeLabel}>
                  <DownloadFileButton
                    iconClassName="icon-download-harddisk"
                    text="CSV"
                  />
                </Grid>
                <Grid item className={classes.fileTypeLabel}>
                  <DownloadFileButton
                    iconClassName="icon-download-harddisk"
                    text="XML"
                  />
                </Grid>
                <Grid item className={classes.fileTypeLabel}>
                  <DownloadFileButton
                    iconClassName="icon-download-harddisk"
                    text="JSON"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </header>
      </Grid>
    </Grid>
  </>
)

export default withStyles(styles)(WebFeed)
