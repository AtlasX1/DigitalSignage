import React, { Fragment } from 'react'
import { translate } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'

import { Folder } from '@material-ui/icons'

import UploadMediaSVG from '../../../../../common/icons/img_drag_and_drop_upload.svg'

const dropzoneStatusColor = ({ isDragActive, isDragAccept, isDragReject }) => {
  if (isDragAccept) return '#00e676'
  if (isDragReject) return '#ff1744'
  if (isDragActive) return '#0378ba'
  return '#0378ba'
}

const DropzoneWithoutClickStyles = () => ({
  dropFilesWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '182px',
    marginTop: '16px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    color: '#0378ba',
    outline: 'none',
    transition: 'border .2s ease-in-out'
  },
  dropzoneText: {
    marginTop: '20px',
    fontSize: '0.8125rem',
    color: '#0378ba'
  }
})

const DropzoneWithoutClick = translate('translations')(
  withStyles(DropzoneWithoutClickStyles)(({ t, classes }) => {
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles
    } = useDropzone({ noClick: true })

    return (
      <Fragment>
        <div
          {...getRootProps({ className: classes.dropFilesWrap })}
          style={{
            borderColor: dropzoneStatusColor({
              isDragActive,
              isDragAccept,
              isDragReject
            })
          }}
        >
          <input {...getInputProps()} />
          <img src={UploadMediaSVG} alt={t('Drop and Drop your image here')} />
          <Typography className={classes.dropzoneText}>
            {t('Drop files to Upload')}
          </Typography>
        </div>
        <List>
          {acceptedFiles.map(file => (
            <ListItem key={file.path}>
              <ListItemIcon>
                <Folder />
              </ListItemIcon>
              <ListItemText primary={file.path} />
            </ListItem>
          ))}
        </List>
      </Fragment>
    )
  })
)

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
  fileTypeLabel: {
    fontSize: '11px',
    lineHeight: '13px',
    fontWeight: '500',
    marginRight: '27px',
    '&:last-of-type': {
      marginRight: '0'
    }
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
  }
})

const ImportFile = ({ classes }) => (
  <>
    <Grid container>
      <Grid item xs={12}>
        <DropzoneWithoutClick />
      </Grid>
    </Grid>
    <Grid container>
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

export default withStyles(styles)(ImportFile)
