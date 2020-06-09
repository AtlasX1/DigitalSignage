import React from 'react'
import { Grid, InputLabel, Typography } from '@material-ui/core'
import { TabToggleButton, TabToggleButtonGroup } from '../../../Buttons'
import FormControlInput from '../../../Form/FormControlInput'
import FormControlSelect from '../../../Form/FormControlSelect'
import FormControlSketchColorPicker from '../../../Form/FormControlSketchColorPicker'

const LegacyThemeContent = props => {
  const {
    classes,
    values,
    selectedPeriodType,
    handlePeriodTypeChanges,
    allowedThemeSetting,
    isLoading,
    errors,
    touched,
    handleChange
  } = props

  return (
    <Grid container className={classes.marginTop}>
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
                <TabToggleButtonGroup
                  className={[
                    classes.tabToggleButtonContainer,
                    classes.periodTypeContainer
                  ].join(' ')}
                  value={selectedPeriodType}
                  exclusive
                  onChange={handlePeriodTypeChanges}
                >
                  {!isLoading &&
                    Object.keys(values.theme_settings).map(key => {
                      if (key === 'width') return null
                      return (
                        <TabToggleButton
                          style={{ textTransform: 'capitalise' }}
                          value={key}
                          key={key}
                        >
                          {key}
                        </TabToggleButton>
                      )
                    })}
                </TabToggleButtonGroup>
              </Grid>
              <Grid item xs={12}>
                <Grid container alignItems="center">
                  <Grid item xs={4}>
                    <InputLabel className={classes.inputLabel}>
                      Width
                    </InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControlInput
                      custom={true}
                      formControlRootClass={[
                        classes.templateStyleInputRoot,
                        classes.numberInput
                      ].join(' ')}
                      value={values.theme_settings.width}
                      error={
                        errors.theme_settings && errors.theme_settings.width
                      }
                      touched={
                        touched.theme_settings && touched.theme_settings.width
                      }
                      handleChange={val =>
                        handleChange('theme_settings.width', val)
                      }
                      formControlInputClass={classes.formControlInputClass}
                      formControlNumericInputRootClass={
                        classes.formControlNumericInputRootClass
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  className={classes.marginTop}
                >
                  <Grid item xs={4}>
                    <InputLabel className={classes.inputLabel}>
                      Height
                    </InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControlInput
                      custom={true}
                      formControlRootClass={[
                        classes.templateStyleInputRoot,
                        classes.numberInput
                      ].join(' ')}
                      value={values.theme_settings[selectedPeriodType].height}
                      error={
                        errors.theme_settings &&
                        errors.theme_settings[selectedPeriodType].height
                      }
                      touched={
                        touched.theme_settings &&
                        touched.theme_settings[selectedPeriodType].height
                      }
                      handleChange={val =>
                        handleChange(
                          `theme_settings.${selectedPeriodType}.height`,
                          val
                        )
                      }
                      formControlInputClass={classes.formControlInputClass}
                      formControlNumericInputRootClass={
                        classes.formControlNumericInputRootClass
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  className={classes.marginTop}
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
                      value={
                        values.theme_settings[selectedPeriodType].font_family
                      }
                      options={
                        isLoading
                          ? []
                          : allowedThemeSetting[
                              selectedPeriodType
                            ].font_family.map(name => ({
                              component: (
                                <span style={{ fontFamily: name }}>{name}</span>
                              ),
                              value: name
                            }))
                      }
                      handleChange={e =>
                        handleChange(
                          `theme_settings.${selectedPeriodType}.font_family`,
                          e.target.value
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  className={classes.marginTop}
                >
                  <Grid item xs={4}>
                    <InputLabel className={classes.inputLabel}>
                      Text Style
                    </InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item>
                        <FormControlInput
                          custom={true}
                          formControlRootClass={[
                            classes.templateStyleInputRoot,
                            classes.numberInput,
                            classes.marginRight1
                          ].join(' ')}
                          value={
                            values.theme_settings[selectedPeriodType].text_size
                          }
                          error={
                            errors.theme_settings &&
                            errors.theme_settings[selectedPeriodType].text_size
                          }
                          touched={
                            touched.theme_settings &&
                            touched.theme_settings[selectedPeriodType].text_size
                          }
                          handleChange={val =>
                            handleChange(
                              `theme_settings.${selectedPeriodType}.text_size`,
                              val
                            )
                          }
                          max={
                            isLoading
                              ? 0
                              : allowedThemeSetting[selectedPeriodType]
                                  .max_text_size
                          }
                          min={
                            isLoading
                              ? 0
                              : allowedThemeSetting[selectedPeriodType]
                                  .min_text_size
                          }
                          formControlInputClass={classes.formControlInputClass}
                          formControlNumericInputRootClass={
                            classes.formControlNumericInputRootClass
                          }
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.marginTop}>
                        <FormControlSketchColorPicker
                          rootClass={classes.colorPickerRoot}
                          color={
                            values.theme_settings[selectedPeriodType].text_color
                          }
                          onColorChange={value =>
                            handleChange(
                              `theme_settings.${selectedPeriodType}.text_color`,
                              value
                            )
                          }
                          formControlInputClass={
                            classes.formControlColorPickerInputClass
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  alignItems="center"
                  className={classes.marginTop}
                >
                  <Grid item xs={4}>
                    <InputLabel className={classes.inputLabel}>
                      Background Color
                    </InputLabel>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControlSketchColorPicker
                      rootClass={classes.colorPickerRoot}
                      color={
                        values.theme_settings[selectedPeriodType]
                          .background_color
                      }
                      onColorChange={value =>
                        handleChange(
                          `theme_settings.${selectedPeriodType}.background_color`,
                          value
                        )
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
          {/*<Grid item>*/}
          {/*  <div className={classes.calendarBackground}></div>*/}
          {/*</Grid>*/}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default LegacyThemeContent
