import React, { useEffect, useState } from 'react'

import { isArray as _isArray, isNull as _isNull } from 'lodash'

import update from 'immutability-helper'

import moment from 'moment'

import {
  withStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
  Typography
} from '@material-ui/core'

import { BlueButton, WhiteButton } from 'components/Buttons'
import {
  FormControlDateRangePickers,
  FormControlInput,
  FormControlReactSelect
} from 'components/Form'
import { CheckboxSwitcher } from 'components/Checkboxes'
import classNames from 'classnames'

const styles = theme => {
  const { palette, type } = theme

  return {
    dialog: {
      overflowY: 'visible'
    },
    label: {
      textTransform: 'capitalize',
      lineHeight: '24px',
      color: palette[type].formControls.label.color,
      whiteSpace: 'pre'
    }
  }
}

const SocialWallNetworkSettings = props => {
  const { open, onClose, onSave, settings, classes, values } = props

  useEffect(() => {
    setData(values)
  }, [values])

  const [data, setData] = useState({})

  const keyToLabel = key => key.replace(/_/g, ' ')

  const handleCheckbox = (item, value, key) => {
    const values = data[key]

    if (value) {
      if (!values.includes(item)) {
        const temp = values.split(',')
        temp.push(item)

        setData(
          update(data, {
            [key]: { $set: temp.join(',') }
          })
        )
      }
    } else {
      if (values.includes(item)) {
        const temp = values.split(',')
        const index = temp.indexOf(item)
        temp.splice(index, 1)

        setData(
          update(data, {
            [key]: { $set: temp.join(',') }
          })
        )
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={'sm'}
      fullWidth
      PaperProps={{
        className: classes.dialog
      }}
    >
      <DialogTitle>
        <Typography>Network Settings</Typography>
      </DialogTitle>
      <DialogContent className={classes.dialog}>
        <Grid container spacing={16}>
          {settings &&
            data &&
            Object.keys(settings).map(key => {
              const value = settings[key]

              if (_isArray(value)) {
                return (
                  <Grid item xs={6} key={key}>
                    <FormControlReactSelect
                      fullWidth
                      label={`${keyToLabel(key)}`}
                      value={data[key]}
                      formControlLabelClass={classes.label}
                      isSearchable={true}
                      handleChange={e =>
                        setData(
                          update(data, {
                            [key]: { $set: e.target.value }
                          })
                        )
                      }
                      options={value}
                      marginBottom={15}
                    />
                  </Grid>
                )
              }

              if (key.includes('datetime') && key !== 'facebook_datetime_to') {
                return (
                  <Grid item xs={12} key={key}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography className={classes.label}>
                          {keyToLabel(key)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlDateRangePickers
                          anchorDirection="left"
                          label={null}
                          startDate={moment(data.facebook_datetime_from)}
                          endDate={moment(data.facebook_datetime_to)}
                          onDatesChange={({ startDate, endDate }) => {
                            setData(
                              update(data, {
                                facebook_datetime_from: {
                                  $set: startDate.format('YYYY/MM/DD')
                                },
                                facebook_datetime_to: {
                                  $set: !_isNull(endDate)
                                    ? endDate.format('YYYY/MM/DD')
                                    : moment(data.facebook_datetime_to)
                                }
                              })
                            )
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }

              if (typeof value === 'string' && !key.includes('datetime')) {
                return (
                  <Grid item xs={4} key={key}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography className={classes.label}>
                          {keyToLabel(key)}
                        </Typography>
                      </Grid>
                      {value.split(',').map(i => (
                        <Grid
                          container
                          key={key + '_' + i}
                          alignItems={'center'}
                          justify={'space-between'}
                        >
                          <Grid item>
                            <Typography className={classes.label}>
                              {i}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CheckboxSwitcher
                              label={null}
                              handleChange={val => handleCheckbox(i, val, key)}
                              value={data[key].includes(i)}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                )
              }

              if (typeof value === 'number') {
                return (
                  <Grid item xs={6} key={key}>
                    <FormControlInput
                      custom
                      labelPosition="left"
                      name="attributes.theme_settings.duration"
                      marginBottom={false}
                      value={data[key]}
                      handleChange={val => {
                        setData(
                          update(data, {
                            [key]: { $set: val }
                          })
                        )
                      }}
                      label={`${keyToLabel(key)}`}
                      formControlLabelClass={classes.label}
                      formControlRootClass={classNames(
                        classes.formControlRootClass,
                        classes.numberInput
                      )}
                    />
                  </Grid>
                )
              }

              if (typeof value === 'boolean') {
                return (
                  <Grid item xs={4} key={key}>
                    <Grid
                      container
                      alignItems={'center'}
                      justify={'space-between'}
                    >
                      <Grid item>
                        <Typography className={classes.label}>
                          {keyToLabel(key)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <CheckboxSwitcher
                          label={null}
                          handleChange={val =>
                            setData(
                              update(data, {
                                [key]: { $set: val }
                              })
                            )
                          }
                          value={data[key]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )
              }

              return null
            })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <BlueButton onClick={() => onSave(data)}>Save</BlueButton>
        <WhiteButton onClick={onClose}>Cancel</WhiteButton>
      </DialogActions>
    </Dialog>
  )
}

export default withStyles(styles)(SocialWallNetworkSettings)
