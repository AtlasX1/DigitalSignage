import React, { Fragment, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

import {
  withStyles,
  withTheme,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { Close as CloseIcon, Folder } from '@material-ui/icons'

import Icon from './Icon'

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

const DropzoneWithoutClickStyles = ({ palette, type }) => ({
  dropFilesWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '280px',
    padding: '20px',
    borderWidth: '1px',
    borderStyle: 'dashed',
    color: '#0378ba',
    outline: 'none',
    transition: 'border .2s ease-in-out'
  },
  filesItemRemove: {
    marginRight: 0,
    marginLeft: 'auto',
    cursor: 'pointer',
    color: palette[type].formControls.label.color,
    '&:hover': {
      color: '#0378ba'
    }
  },
  dropzoneText: {
    marginTop: '20px',
    fontSize: '0.8125rem',
    color: '#0378ba'
  },
  listItemText: {
    color: palette[type].formControls.label.color
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: '5px'
  }
})

const Dropzone = translate('translations')(
  withStyles(DropzoneWithoutClickStyles)(
    withTheme()(
      ({
        t,
        classes,
        theme,
        onChange,
        name,
        touched,
        error,
        value = {},
        noClick,
        handleDropzoneRef
      }) => {
        const onDrop = useCallback(
          acceptedFiles => {
            onChange({ target: { name, value: acceptedFiles[0] } })
          },
          // eslint-disable-next-line
          [name, onChange]
        )

        const {
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
          inputRef
        } = useDropzone({ onDrop, noClick })

        const handleRemoveFile = useCallback(() => {
          onChange({ target: { name, value: null } })
        }, [name, onChange])

        const { palette, type } = theme

        useEffect(() => {
          handleDropzoneRef(inputRef)
          //eslint-disable-next-line
        }, [inputRef])
        return (
          <Fragment>
            <div
              {...getRootProps({ className: classes.dropFilesWrap })}
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
              <Icon fill={palette[type].sideModal.background} />
              <Typography className={classes.dropzoneText}>
                {t('Drag and Drop your image here')}
              </Typography>
            </div>
            {value && (value.name || value.path) ? (
              <List>
                <ListItem>
                  <ListItemIcon className={classes.listItemText}>
                    <Folder />
                  </ListItemIcon>
                  <ListItemText
                    primary={value.name || value.path}
                    classes={{ primary: classes.listItemText }}
                  />
                  <ListItemIcon
                    className={classes.filesItemRemove}
                    onClick={handleRemoveFile}
                  >
                    <CloseIcon />
                  </ListItemIcon>
                </ListItem>
              </List>
            ) : null}
            {error && touched ? (
              <Typography className={classes.error}>{error}</Typography>
            ) : null}
          </Fragment>
        )
      }
    )
  )
)

const ImageUpload = ({ ...props }) => {
  return (
    <div
      style={{
        margin: '0 15px',
        cursor: 'pointer'
      }}
    >
      <Dropzone {...props} />
    </div>
  )
}

ImageUpload.propTypes = {
  name: PropTypes.string,
  error: PropTypes.string,
  value: PropTypes.object,
  noClick: PropTypes.bool,
  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onChange: PropTypes.func,
  handleDropzoneRef: PropTypes.func,
  customClass: PropTypes.string
}

ImageUpload.defaultProps = {
  name: '',
  error: '',
  value: {},
  noClick: false,
  touched: false,
  onChange: f => f,
  handleDropzoneRef: f => f,
  customClass: ''
}

export default translate('translations')(ImageUpload)
