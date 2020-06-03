import React from 'react'
import { translate } from 'react-i18next'
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'

import {
  withStyles,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { Folder } from '@material-ui/icons'

import UploadMediaSVG from 'common/icons/img_drag_drop_files_playlist.svg'

const dropzoneStatusColor = ({ isDragActive, isDragAccept, isDragReject }) => {
  if (isDragAccept) return '#00e676'
  if (isDragReject) return '#ff1744'
  if (isDragActive) return '#0378ba'
  return '#0378ba'
}

const DropzoneWithoutClickStyles = theme => {
  const { palette, type } = theme
  return {
    dropFilesWrap: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '90px',
      marginTop: '30px',
      padding: '20px',
      borderWidth: '1px',
      borderStyle: 'dashed',
      background: palette[type].sideModal.background,
      color: '#0378ba',
      outline: 'none',
      transition: 'border .2s ease-in-out'
    },
    dropzoneText: {
      margin: '25px 0 0 20px',
      fontSize: '14px',
      color: '#0378ba'
    },
    hidden: {
      opacity: 0,
      cursor: 'default'
    }
  }
}

const DropzoneWithoutClick = translate('translations')(
  withStyles(DropzoneWithoutClickStyles)(({ t, classes, hidden }) => {
    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles
    } = useDropzone({ noClick: true })

    return (
      <>
        <div
          {...getRootProps({
            className: classNames(classes.dropFilesWrap, {
              [classes.hidden]: hidden
            })
          })}
          style={{
            borderColor: dropzoneStatusColor({
              isDragActive,
              isDragAccept,
              isDragReject
            })
          }}
        >
          <input {...getInputProps()} />
          <Grid container justify="center" alignContent="center">
            <Grid item>
              <img
                src={UploadMediaSVG}
                alt={t('Drag and drop files to playlist')}
              />
            </Grid>
            <Grid item>
              <Typography className={classes.dropzoneText}>
                {t('Drag and drop files to playlist')}
              </Typography>
            </Grid>
          </Grid>
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
      </>
    )
  })
)

const styles = theme => ({
  root: {
    margin: '15px 30px'
  }
})

const UploadPlaylistFiles = ({ classes, containerHeight, hidden }) => (
  <div
    className={classes.root}
    style={containerHeight ? { height: containerHeight } : undefined}
  >
    <DropzoneWithoutClick hidden={hidden} />
  </div>
)

export default withStyles(styles)(UploadPlaylistFiles)
