import React from 'react'
import { get as _get } from 'lodash'
import { Grid, Typography } from '@material-ui/core'

import { TabToggleButton, TabToggleButtonGroup } from '../../Buttons'
import FormControlSketchColorPicker from '../../Form/FormControlSketchColorPicker'
import { FormControlInput } from '../../Form'

const getHeaderTabs = classes => {
  const tabs = ['Title', 'Handle', 'Time', 'Text', 'Text Link', 'Background']

  return tabs.map((tabName, key) => {
    const value = tabName.toLowerCase().replace(/\s/g, '')
    return (
      <TabToggleButton
        key={key + value}
        className={classes.tabToggleButton}
        value={value}
      >
        {tabName}
      </TabToggleButton>
    )
  })
}

const TwitterSettings = ({ classes, onChange, data, activeTab }) => {
  const values = _get(data, `values.${activeTab}`, {})
  const errors = _get(data, `errors.${activeTab}`, {})
  const touched = _get(data, `touched.${activeTab}`, {})
  const currentPath = `settings.${activeTab}`

  return (
    <Grid container justify="center" className={classes.tweetSettingsContainer}>
      <Grid item xs={12} className={classes.themeCardWrap}>
        <header className={classes.themeHeader}>
          <Typography className={classes.themeHeaderText}>
            Tweet Settings
          </Typography>
        </header>

        <Grid container justify="center" className={classes.marginTop1}>
          <Grid item>
            <TabToggleButtonGroup
              className={classes.tabToggleButtonGroup}
              value={activeTab}
              exclusive
              onChange={(e, val) => val && onChange('settingsType', val)}
            >
              {getHeaderTabs(classes)}
            </TabToggleButtonGroup>
          </Grid>
        </Grid>

        <Grid container spacing={16} className={classes.themeCardBodyContainer}>
          {activeTab !== 'background' ? (
            <>
              <Grid item xs={6}>
                <Grid container justify="flex-start" alignItems="center">
                  <Grid item>
                    <Typography className={classes.formInputLabel}>
                      Font Color
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlSketchColorPicker
                      rootClass={classes.colorPickerRootClass}
                      formControlInputClass={classes.formControlInputClass}
                      color={values.fontColor}
                      onColorChange={color =>
                        onChange(`${currentPath}.fontColor`, color)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography className={classes.formInputLabel}>
                      Font size
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <FormControlInput
                      custom
                      formControlRootClass={classes.formControlRootClass}
                      formControlContainerClass={classes.formControlInputNumber}
                      formControlLabelClass={classes.formControlLabelClass}
                      formControlInputClass={classes.formControlInputClass}
                      value={values.fontSize}
                      error={errors.fontSize}
                      touched={touched.fontSize}
                      handleChange={value =>
                        onChange(`${currentPath}.fontSize`, value)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={4}>
                <Grid container direction={'column'}>
                  <Grid item>
                    <Typography className={classes.formInputLabel}>
                      Odd row:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlSketchColorPicker
                      formControlInputClass={classes.formControlInputClass}
                      rootClass={classes.colorPickerRootClass}
                      color={values.oddRow}
                      error={errors.oddRow}
                      touched={touched.oddRow}
                      onColorChange={color =>
                        onChange(`${currentPath}.oddRow`, color)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container direction={'column'}>
                  <Grid item>
                    <Typography className={classes.formInputLabel}>
                      Even row:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlSketchColorPicker
                      formControlInputClass={classes.formControlInputClass}
                      rootClass={classes.colorPickerRootClass}
                      color={values.evenRow}
                      error={errors.evenRow}
                      touched={touched.evenRow}
                      onColorChange={color =>
                        onChange(`${currentPath}.evenRow`, color)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Grid container direction={'column'}>
                  <Grid item>
                    <Typography className={classes.formInputLabel}>
                      Title:
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormControlSketchColorPicker
                      formControlInputClass={classes.formControlInputClass}
                      rootClass={classes.colorPickerRootClass}
                      color={values.title}
                      error={errors.title}
                      touched={touched.title}
                      onColorChange={color =>
                        onChange(`${currentPath}.title`, color)
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default TwitterSettings
