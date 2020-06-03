import React, { Fragment, useState } from 'react'
import { translate } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

import {
  withStyles,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  DialogTitle,
  DialogContent,
  Dialog
} from '@material-ui/core'
import { Folder } from '@material-ui/icons'

import UploadMediaSVG from '../../../../../common/icons/img_drag_and_drop_upload.svg'

const packageHelp = require('../../../../../common/assets/images/package_help.png')

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
    height: '280px',
    marginTop: '30px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    color: '#0378ba',
    outline: 'none',
    transition: 'border .2s ease-in-out'
  },
  dropzoneText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#0378ba'
  }
})

const DropzoneWithoutClick = translate('translations')(
  withStyles(DropzoneWithoutClickStyles)(({ t, classes, onChange }) => {
    const onDrop = acceptedFiles => {
      onChange('file', acceptedFiles[0])
    }

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles
    } = useDropzone({ onDrop })

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
          <img src={UploadMediaSVG} alt={'Drop and Drop your package here'} />
          <Typography className={classes.dropzoneText}>
            {'Drop package to Upload'}
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

const styles = theme => ({
  helperCardWrap: {
    backgroundColor: '#f5fcff',
    borderRadius: '4px',
    padding: '13px 15px 20px'
  },
  helperTitle: {
    fontSize: '12px',
    color: '#0378BA',
    fontStyle: 'italic',
    fontWeight: 'bold',
    lineHeight: '15px'
  },
  helperText: {
    fontSize: '12px',
    color: '#0378BA',
    lineHeight: '15px'
  },
  errorText: {
    color: 'red'
  }
})

const Package = ({ classes, values, touched, errors, onChange }) => {
  const [isDialog, setDialog] = useState(false)

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <DropzoneWithoutClick onChange={onChange} />
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        className={classes.helperCardWrap}
        onClick={() => setDialog(true)}
      >
        <Typography className={classes.helperTitle}>
          A zip file package may contain the following file formats:
        </Typography>
        <Typography className={classes.helperText}>
          .css, .js, .png, .gif, .jpeg, .jpg, .tpl, .html, .swf, .less, .json,
          .scss, .map, .otf, .eot, .svg, .ttf, .woff, .woff2, .txt, .ico
        </Typography>
      </Grid>

      <Dialog
        open={isDialog}
        classes={{
          paper: classes.dialog
        }}
        maxWidth={false}
        onClose={() => setDialog(false)}
      >
        <Grid container direction="column" className={classes.dialogContainer}>
          <DialogTitle className={classes.dialogTitle}>
            Zip Folder Structure
          </DialogTitle>
          <DialogContent>
            <Typography className={classes.dialogText}>
              <a href="https://server2.xhibitsignage.com/~xhibit/dev/assets/sample/package.zip">
                Click me to download sample package file.
              </a>
            </Typography>
            <Typography>
              <img src={packageHelp} alt="structure" />
            </Typography>
            <Typography className={classes.errorText}>
              Note: If folder structure and files are not in proper format then
              it will be store automatically corrupted.
            </Typography>
          </DialogContent>
        </Grid>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(Package)
