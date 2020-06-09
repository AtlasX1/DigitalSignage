import React from 'react'

import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'

import {
  FormControlInput,
  FormControlTimeDurationPicker
} from '../../../../Form'

const styles = () => ({
  root: {
    margin: '15px 30px'
  },
  formControlLabelClass: {
    fontSize: '1.0833rem',
    lineHeight: '24px',
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
    padding: '0 8px'
  },
  themeCardWrap: {
    border: 'solid 1px #e4e9f3',
    backgroundColor: 'rgba(245, 246, 250, 0.5)',
    borderRadius: '4px',
    padding: 15
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
  label: {
    whiteSpace: 'nowrap'
  }
})

const LocalFilePath = ({
  classes,
  errors,
  values,
  touched,
  onChange,
  onShowModal
}) => {
  return (
    <>
      <Grid container justify="center" className={classes.marginTop}>
        <Grid item xs={12}>
          <FormControlInput
            className={classes.formControlInput}
            formControlRootClass={classes.formControlRootClass}
            formControlLabelClass={classes.formControlLabelClass}
            fullWidth={true}
            label={'Local File Path (requires local webserver):'}
            value={values.localFileUrl}
            error={errors.localFileUrl}
            touched={touched.localFileUrl}
            handleChange={e => onChange('localFileUrl', e.target.value)}
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
      <Grid container justify="space-between" className={classes.marginTop}>
        <Grid item xs={12} className={classes.themeCardWrap}>
          <Grid container justify="space-between">
            <Grid item xs={6} className={classes.inputContainer}>
              <FormControlTimeDurationPicker
                id={'duration'}
                label={
                  <div className={classes.label}>
                    <span
                      className={classes.formControlLabelLink}
                      onClick={() => onShowModal(true)}
                    >
                      Media Update Duration:
                    </span>
                    <small className={classes.formControlLabelSmall}>
                      (hh:mm:ss)
                    </small>
                  </div>
                }
                value={values.duration}
                onChange={val => onChange('duration', val)}
              />
            </Grid>
            <Grid item xs={6} className={classes.inputContainer}>
              <FormControlTimeDurationPicker
                id={'updateDuration'}
                label={
                  <div className={classes.label}>
                    Media Update Frequency:
                    <small className={classes.formControlLabelSmall}>
                      (hh:mm:ss)
                    </small>
                  </div>
                }
                value={values.updateFrequency}
                onChange={val => onChange('updateFrequency', val)}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

LocalFilePath.defaultProps = {
  values: {},
  errors: {},
  touched: {},
  onChange: () => {},
  onShowModal: () => {}
}

export default withStyles(styles)(LocalFilePath)
