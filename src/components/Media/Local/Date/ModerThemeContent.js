import React from 'react'
import { Grid, InputLabel, Typography } from '@material-ui/core'
import FormControlSelect from '../../../Form/FormControlSelect'
import FormControlSketchColorPicker from '../../../Form/FormControlSketchColorPicker'

const ModernThemeContent = props => {
  const {
    classes,
    values,
    allowedThemeSetting,
    isLoading,
    handleChange
  } = props

  return (
    <Grid container className={classes.marginTop2}>
      <Grid item xs={12}>
        <Typography className={classes.templateLabel}>
          Template Style
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container className={classes.borderBottom}>
          <Grid item xs>
            <Grid container className={classes.templateContainer}>
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  className={classes.marginTop3}
                >
                  <Grid item xs={4}>
                    <InputLabel className={classes.inputLabel}>
                      Font Family
                    </InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControlSelect
                      label=""
                      formControlContainerClass={classes.selectInput}
                      marginBottom={false}
                      custom={true}
                      value={values.theme_settings.font_family}
                      options={
                        isLoading
                          ? []
                          : allowedThemeSetting.font_family.map(name => ({
                              component: (
                                <span style={{ fontFamily: name }}>{name}</span>
                              ),
                              value: name
                            }))
                      }
                      handleChange={e =>
                        handleChange(
                          `theme_settings.font_family`,
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  className={classes.marginTop3}
                >
                  <Grid item xs={4}>
                    <InputLabel className={classes.inputLabel}>
                      Text Color
                    </InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControlSketchColorPicker
                      rootClass={classes.colorPickerRoot}
                      color={values.theme_settings.text_color}
                      onColorChange={value =>
                        handleChange(`theme_settings.text_color`, value)
                      }
                      formControlInputClass={
                        classes.formControlColorPickerInputClass
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ModernThemeContent
