import React, { useCallback, Fragment } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'
import { useDropzone } from 'react-dropzone'
import classNames from 'classnames'
import {
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Folder, Close as CloseIcon } from '@material-ui/icons'

import UploadMediaSVG from '../../../../../common/icons/img_drag_and_drop_upload.svg'
import PropTypes from 'prop-types'

const dropzoneStatusColor = ({
  isDragActive,
  isDragAccept,
  isDragReject,
  error,
  touched
}) => {
  if (isDragAccept) return '#00e676'
  if (isDragReject || (error && touched)) return '#ff1744'
  if (isDragActive) return '#0378ba'
  return '#0378ba'
}

const DropzoneStyles = makeStyles({
  dropFilesWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '280px',
    marginTop: '16px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    color: '#0378ba',
    outline: 'none',
    transition: 'border .2s ease-in-out',
    cursor: props => (props.noClick ? 'default' : 'pointer')
  },
  dropzoneText: {
    marginTop: '20px',
    fontSize: '0.8125rem',
    color: '#0378ba'
  },
  filesItemRemove: {
    marginRight: 0,
    marginLeft: 'auto',
    cursor: 'pointer',
    '&:hover': {
      color: '#0378ba'
    }
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: '5px'
  }
})

const DropzoneWithoutClick = translate('translations')(
  ({
    t,
    name,
    noClick,
    multiple,
    error,
    touched,
    onChange,
    files,
    customClass,
    dropZoneText
  }) => {
    const classes = DropzoneStyles({ noClick })
    const onDrop = useCallback(
      acceptedFiles => {
        const newFiles = multiple ? [...files, ...acceptedFiles] : acceptedFiles
        onChange({ target: { name, value: newFiles } })
      },
      // eslint-disable-next-line
      [name, files, onChange]
    )

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject
    } = useDropzone({ onDrop, noClick, multiple })

    const handleRemoveFile = index => {
      onChange({
        target: {
          name,
          value: update(files, {
            $splice: [[index, 1]]
          })
        }
      })
    }

    return (
      <Fragment>
        <div
          {...getRootProps({
            className: classNames(classes.dropFilesWrap, customClass)
          })}
          style={{
            borderColor: dropzoneStatusColor({
              isDragActive,
              isDragAccept,
              isDragReject,
              error,
              touched
            })
          }}
        >
          <input {...getInputProps()} />
          <img src={UploadMediaSVG} alt={t('Drop and Drop your image here')} />
          <Typography className={classes.dropzoneText}>
            {dropZoneText ? dropZoneText : t('Drop files to Upload')}
          </Typography>
        </div>
        <List>
          {files &&
            !!files.length &&
            files.map((file, index) => (
              <ListItem key={file.path + index}>
                <ListItemIcon>
                  <Folder />
                </ListItemIcon>
                <ListItemText primary={file.path} />
                <ListItemIcon
                  className={classes.filesItemRemove}
                  onClick={handleRemoveFile.bind(null, index)}
                >
                  <CloseIcon />
                </ListItemIcon>
              </ListItem>
            ))}
        </List>
        {error && touched && (
          <Typography className={classes.error}>{error}</Typography>
        )}
      </Fragment>
    )
  }
)

DropzoneWithoutClick.propTypes = {
  name: PropTypes.string,
  files: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  noClick: PropTypes.bool,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  customClass: PropTypes.string,
  error: PropTypes.string,
  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  dropZoneText: PropTypes.string
}

DropzoneWithoutClick.defaultProps = {
  name: '',
  files: [],
  multiple: false,
  noClick: false,
  onChange: f => f,
  customClass: '',
  touched: false,
  error: ''
}

const FileUpload = props => (
  <Grid container>
    <Grid item xs={12}>
      <DropzoneWithoutClick {...props} />
    </Grid>
  </Grid>
)

export default FileUpload
