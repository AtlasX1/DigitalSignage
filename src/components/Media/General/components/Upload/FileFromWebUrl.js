import React from 'react'
import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'

import {
  FormControlInput,
  FormControlTimeDurationPicker
} from '../../../../Form/index'

const styles = () => ({
  formControlLabelClass: {
    fontSize: '1.0833rem',
    color: '#74809A',
    paddingRight: '15px'
  },
  formControlLabelSmall: {
    display: 'inline-block',
    marginLeft: '4px',
    color: '#818ca4'
  },
  formControlLabelLink: {
    textDecoration: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: '#0378ba',
    '&:hover': {
      cursor: 'pointer',
      textDecorationStyle: 'solid'
    }
  },
  formControlRootClass: {
    marginBottom: '0'
  },
  marginTop: {
    marginTop: 16
  },
  inputContainer: {
    padding: '0 8px',
    margin: '0 -8px'
  },
  themeCardWrap: {
    border: 'solid 1px #e4e9f3',
    backgroundColor: 'rgba(245, 246, 250, 0.5)',
    borderRadius: '4px',
    padding: '15px 23px'
  },
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
  formContainer: {
    marginRight: '14px',
    '&:last-of-type': {
      marginRight: 0
    }
  }
})

const FileFromWebUrl = ({
  classes,
  errors,
  values,
  touched,
  onChange,
  onShowModal
}) => {
  return (
    <>
      <Grid
        container
        justify="center"
        className={classes.marginTop}
        spacing={16}
      >
        <Grid item xs={12}>
          <FormControlInput
            className={classes.formControlInput}
            formControlRootClass={classes.formControlRootClass}
            formControlLabelClass={classes.formControlLabelClass}
            id="text-title"
            fullWidth={true}
            label={'Media File URL:'}
            value={values.webFileUrl}
            error={errors.webFileUrl}
            touched={touched.webFileUrl}
            handleChange={e => onChange('webFileUrl', e.target.value)}
          />
        </Grid>
      </Grid>
      <Grid container className={classes.marginTop}>
        <Grid item xs={12} className={classes.helperCardWrap}>
          <Grid container>
            <Grid item xs={3}>
              <Typography className={classes.helperTitle}>
                Supported formats
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography className={classes.helperText}>
                bmp, .gif, .jpeg, .jpg, .mp3, .mp4(H.264), .ogg, .png, .svg,
                .wav, .webm
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              <Tooltip
                title={
                  'Legacy formats are not compatible with all digital signage players. We recommend using the supported formats to ensure compatibility.'
                }
                placement="top"
              >
                <Typography className={classes.helperTitle}>
                  <span className={classes.formControlLabelLink}>
                    Legacy formats
                  </span>
                </Typography>
              </Tooltip>
            </Grid>
            <Grid item xs={9}>
              <Typography className={classes.helperText}>
                avi, .flv, .mov, .mpeg, .mpg, .swf, .wma, .wmv
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.marginTop}>
        <Grid item xs={12} className={classes.themeCardWrap}>
          <Grid item xs={6}>
            <FormControlTimeDurationPicker
              id={'updateDuration'}
              label={
                <>
                  <span
                    className={classes.formControlLabelLink}
                    onClick={() => onShowModal(true)}
                  >
                    Media Update Duration:
                  </span>
                  <small className={classes.formControlLabelSmall}>
                    (hh:mm:ss)
                  </small>
                </>
              }
              value={values.updateDuration}
              onChange={val => onChange('updateDuration', val)}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

FileFromWebUrl.defaultProps = {
  values: {},
  errors: {},
  touched: {},
  onControlChange: () => {},
  onShowModal: () => {}
}

export default withStyles(styles)(FileFromWebUrl)
