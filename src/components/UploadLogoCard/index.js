import React, { useCallback, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { useDropzone } from 'react-dropzone'

import { withStyles, Grid, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { FormControlInput } from 'components/Form'
import PropTypes from 'prop-types'

const FileUploadStyles = ({ palette, type }) => ({
  filePreview: {
    maxHeight: '100px',
    maxWidth: '140px'
  },
  rightBorder: {
    borderRight: `1px solid ${palette[type].pages.adminSettings.content.border}`
  },
  uploadCardHeader: {
    margin: '20px 0 15px'
  },
  uploadCardHeaderText: {
    fontWeight: 'bold',
    color: palette[type].pages.rss.addRss.upload.titleColor
  },
  fileInputWrap: {
    marginBottom: '15px'
  },
  fileInputControl: {
    width: 'auto',
    marginBottom: 0
  },
  fileInput: {
    width: '180px',
    height: '42px',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRight: 'none'
  },
  fileInputButton: {
    width: '100px',
    marginBottom: 0,
    padding: '10px 30px',
    borderRadius: '0 4px 4px 0',
    border: `1px solid ${palette[type].formControls.input.border}`,
    backgroundImage: palette[type].pages.rss.addRss.upload.background,
    textAlign: 'center',
    color: palette[type].tabs.toggleButton.color
  },
  errorLabel: {
    color: 'red'
  },
  previewWrapper: {
    display: 'flex',
    alignItems: 'center'
  }
})

const FileUpload = translate('translations')(
  withStyles(FileUploadStyles)(
    ({ t, classes, formValue, onChange, name, title, error, touched }) => {
      const [file, setFile] = useState(null)

      useEffect(() => {
        if (formValue) {
          const value =
            typeof formValue === 'object'
              ? {
                  ...formValue,
                  name: formValue.name || '',
                  preview: URL.createObjectURL(formValue)
                }
              : { preview: formValue }
          setFile(value)
        } else {
          setFile(null)
        }
      }, [formValue])

      const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        multiple: false,
        noDrag: true,
        onDrop: acceptedFiles => {
          onChange(acceptedFiles[0])
        }
      })

      useEffect(
        () => () => {
          if (!!file) {
            URL.revokeObjectURL(file.preview)
          }
        },
        [file]
      )

      return (
        <Grid container className="container">
          <Grid item className={classes.rightBorder} xs={8}>
            <Grid container direction="column">
              <Grid item>
                <header className={classes.uploadCardHeader}>
                  <Typography
                    className={classNames(classes.uploadCardHeaderText, {
                      [classes.errorLabel]: error && touched
                    })}
                  >
                    {title}
                  </Typography>
                </header>
              </Grid>
              <Grid item>
                <Grid
                  container
                  {...getRootProps()}
                  className={classes.fileInputWrap}
                >
                  <Grid item>
                    <FormControlInput
                      readOnly
                      id={name}
                      value={file ? file.name : ''}
                      formControlInputClass={classes.fileInput}
                      formControlRootClass={classes.fileInputControl}
                    />
                  </Grid>
                  <Grid item>
                    <input {...getInputProps()} />
                    <Typography className={classes.fileInputButton}>
                      Browse
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.previewWrapper}>
            <Grid container justify="center" alignContent="center">
              <Grid item>
                {file && (
                  <img
                    src={file.preview}
                    alt=""
                    className={classes.filePreview}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )
    }
  )
)

const styles = ({ palette, type }) => ({
  root: {
    padding: '0 0 0 15px',
    border: `5px solid ${palette[type].pages.rss.addRss.upload.border}`,
    backgroundImage: palette[type].pages.rss.addRss.upload.background,
    borderRadius: '4px'
  },
  container: {
    position: 'relative',
    marginBottom: 15
  },
  error: {
    color: 'red',
    fontSize: 9,
    margin: '10px 0 0 0',
    position: 'absolute',
    left: '5px',
    bottom: '-17px'
  },
  rebBorder: {
    border: `1px solid red`
  }
})

const UploadLogoCard = ({
  classes,
  title,
  name,
  onChange,
  formValue,
  error,
  touched
}) => {
  const handleChange = useCallback(
    value => {
      onChange({ target: { name, value } })
    },
    [name, onChange]
  )

  return (
    <div className={classes.container}>
      <div
        className={classNames(classes.root, {
          [classes.rebBorder]: error && touched
        })}
      >
        <FileUpload
          title={title}
          formValue={formValue}
          onChange={handleChange}
          name={name}
          error={error}
          touched={touched}
        />
      </div>
      {error && touched ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : null}
    </div>
  )
}

UploadLogoCard.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  error: PropTypes.string,
  formValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  onChange: PropTypes.func
}

UploadLogoCard.defaultProps = {
  name: '',
  error: '',
  formValue: {},
  title: '',
  touched: false,
  onChange: f => f
}

export default translate('translations')(withStyles(styles)(UploadLogoCard))
