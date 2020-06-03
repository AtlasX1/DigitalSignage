import React from 'react'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { CheckboxSwitcher } from '../../../../Checkboxes'
import {
  FormControlSelect,
  SliderInputRange,
  FormControlSketchColorPicker
} from '../../../../Form'

const styles = () => ({
  themeCardWrap: {
    border: 'solid 1px #e4e9f3',
    backgroundColor: 'rgba(245, 246, 250, 0.5)',
    borderRadius: '4px',
    marginBottom: '22px'
  },
  formControlLabelClass: {
    fontSize: '13px'
  },
  sliderInputLabel: {
    color: '#74809A',
    fontSize: '13px',
    lineHeight: '15px',
    marginRight: '15px'
  },
  colorPickerRoot: {
    width: '102px',
    marginBottom: '0',

    '& input': {
      height: '28px'
    },

    '& span': {
      height: '24px'
    }
  },
  digitalClockContainer: {
    padding: '0 10px 20px'
  },
  inputContainer: {
    padding: '0 7px',
    margin: '0 -7px'
  },
  inputLabel: {
    fontSize: '12px',
    display: 'block',
    color: '#4C5057',
    marginRight: '10px'
  },
  marginTop1: {
    marginTop: '20px'
  },
  marginTop2: {
    marginTop: '15px'
  }
})

const Digital = ({ classes }) => (
  <Grid container>
    <Grid
      item
      xs={12}
      className={[classes.themeCardWrap, classes.digitalClockContainer].join(
        ' '
      )}
    >
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={classes.marginTop1}
      >
        <Grid item xs={6} className={classes.inputContainer}>
          <FormControlSelect label="Date/Time Format:" marginBottom={false} />
        </Grid>
        <Grid item xs={6} className={classes.inputContainer}>
          <FormControlSelect label="Text:" marginBottom={false} />
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={classes.marginTop2}
      >
        <Grid item xs={6} className={classes.inputContainer}>
          <Grid
            container
            justify="flex-start"
            alignItems="center"
            className={classes.sliderRootClass}
          >
            <Grid item>
              <Typography className={classes.sliderInputLabel}>
                Text Size:
              </Typography>
            </Grid>
            <Grid item>
              <SliderInputRange
                maxValue={100}
                minValue={0}
                step={1}
                label={''}
                numberWraperStyles={{ width: 55 }}
                inputRangeContainerSASS="CreateMediaSettings__slider--Wrap"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} className={classes.inputContainer}>
          <Grid container justify="flex-end" alignItems="center">
            <Grid item>
              <CheckboxSwitcher
                label="Transparent Background"
                formControlLabelClass={classes.formControlLabelClass}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={classes.marginTop2}
      >
        <Grid item xs={4}>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <Typography className={classes.inputLabel}>
                Text-Color:
              </Typography>
            </Grid>
            <Grid item>
              <FormControlSketchColorPicker
                rootClass={classes.colorPickerRoot}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <Typography className={classes.inputLabel}>
                Background:
              </Typography>
            </Grid>
            <Grid item>
              <FormControlSketchColorPicker
                rootClass={classes.colorPickerRoot}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid container justify="center" alignItems="center">
            <Grid item>
              <Typography className={classes.inputLabel}>Border:</Typography>
            </Grid>
            <Grid item>
              <FormControlSketchColorPicker
                rootClass={classes.colorPickerRoot}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)

export default withStyles(styles)(Digital)
