import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { SingleDatePicker } from 'react-dates'

import { withStyles, Grid, Typography, InputLabel } from '@material-ui/core'

import { SideModal } from '../../../../Modal'
import { FormControlInput, SliderInputRange } from '../../../../Form'
import { Card } from '../../../../Card'
import { CheckboxSwitcher } from '../../../../Checkboxes'
import Actions from './Actions'
import { Scrollbars } from 'components/Scrollbars'

const styles = theme => {
  const { palette, type } = theme
  return {
    sideModalHeader: {
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    addEditOEMClient: {
      height: '100%'
    },
    addEditOEMClientWrap: {
      flex: '1 1 auto',
      maxHeight: '100%',
      overflow: 'hidden'
    },
    addEditOEMClientContent: {
      height: '100%'
    },
    addEditOEMClientContentItem: {
      overflowX: 'auto',

      '&:not(:last-child)': {
        borderRight: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    deviceIcon: {
      marginRight: '30px',
      fontSize: '40px',
      color: '#0a83c8'
    },
    deviceName: {
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '55px',
      color: palette[type].card.greyHeader.color
    },
    clientDetailCardRoot: {
      padding: '0 10px'
    },
    clientDetailRow: {
      padding: '0 10px'
    },
    deviceConfig: {
      borderBottom: `1px solid ${palette[type].pages.oem.addClient.item.border}`
    },
    deviceConfigLabel: {
      lineHeight: '42px',
      color: '#74809a'
    },
    deviceConfigSlider: {
      padding: '18px 0',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    deviceConfigSliderLabel: {
      fontSize: '13px',
      color: '#74809a'
    },
    expireDateLabel: {
      display: 'block',
      marginBottom: '10px',
      fontSize: '13px',
      color: '#74809a',
      transform: 'none !important'
    },
    detailLabel: {
      color: palette[type].pages.oem.addClient.features.item.color
    }
  }
}

class AddEditOEMClient extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    // Dummy data
    this.state = {
      expireDate: null,
      expireDateFocused: null,
      deviceStatus: true,
      deviceConfig: [
        { label: props.t('Xhibit Lite'), value: false },
        { label: props.t('Xhibit - Legacy'), value: false },
        { label: props.t('Xhibit Premium - Legacy'), value: false },
        { label: props.t('Xhibit Mykro'), value: false },
        { label: props.t('Xhibit 4K'), value: false }
      ],
      deviceConfigSliderValues: [
        { label: props.t('Number of Devices'), value: 15, maxValue: 30 }
      ],
      premiumFeatures: [
        { label: props.t('4K Feature'), value: true },
        { label: props.t('Font Library Feature'), value: true },
        { label: props.t('Alert System Feature'), value: false },
        { label: props.t('Google Docs Feature'), value: false },
        { label: props.t('Analytics Feature'), value: true },
        { label: props.t('HTML Code Feature'), value: true },
        { label: props.t('Announcements Feature'), value: true },
        { label: props.t('Instagram Feature'), value: true },
        { label: props.t('Box Office Feature'), value: true },
        { label: props.t('Interective Tec Feature'), value: false },
        { label: props.t('Button Feature'), value: true },
        { label: props.t('Licensed Channel Feature'), value: true },
        { label: props.t('CAP Alert Feature'), value: true },
        { label: props.t('Media Approval Feature'), value: true },
        { label: props.t('Channels Feature'), value: false },
        { label: props.t('Media RSS Feature'), value: false },
        { label: props.t('Button Feature'), value: true },
        { label: props.t('Licensed Channel Feature'), value: true },
        { label: props.t('CAP Alert Feature'), value: true },
        { label: props.t('Media Approval Feature'), value: true },
        { label: props.t('Channels Feature'), value: false },
        { label: props.t('Media RSS Feature'), value: false },
        { label: props.t('Clock Feature'), value: true },
        { label: props.t('MS Office Feature'), value: true },
        { label: props.t('Currency Convert Feature'), value: true },
        { label: props.t('Picasa Feature'), value: true },
        { label: props.t('Custom Kiosk Feature'), value: false },
        { label: props.t('Pinterest Feature'), value: false },
        { label: props.t('Announcements Feature'), value: true },
        { label: props.t('Instagram Feature'), value: true },
        { label: props.t('Box Office Feature'), value: true },
        { label: props.t('Interective Tec Feature'), value: false },
        { label: props.t('Button Feature'), value: true },
        { label: props.t('Licensed Channel Feature'), value: true },
        { label: props.t('CAP Alert Feature'), value: true },
        { label: props.t('Media Approval Feature'), value: true },
        { label: props.t('Channels Feature'), value: false },
        { label: props.t('Media RSS Feature'), value: false },
        { label: props.t('Button Feature'), value: true },
        { label: props.t('Licensed Channel Feature'), value: true },
        { label: props.t('CAP Alert Feature'), value: true },
        { label: props.t('Media Approval Feature'), value: true }
      ]
    }
  }

  setBandwidthSliderValue = (value, index) => {
    this.setState(state => ({
      deviceConfigSliderValues: state.deviceConfigSliderValues.map(
        (item, i) => {
          if (index === i) item.value = value
          return item
        }
      )
    }))
  }

  render() {
    const { t, classes } = this.props
    const {
      expireDate,
      expireDateFocused,
      deviceStatus,
      deviceConfig,
      deviceConfigSliderValues,
      premiumFeatures
    } = this.state

    const OEMClientID = this.props.match.params.id

    return (
      <SideModal
        width="99%"
        title={OEMClientID ? t('Update OEM Client') : t('Add New OEM Client')}
        headerClassName={classes.sideModalHeader}
        closeLink="/system/oem-clients-library"
      >
        <Grid
          container
          wrap="nowrap"
          direction="column"
          alignItems="stretch"
          className={classes.addEditOEMClient}
        >
          <Grid item className={classes.addEditOEMClientWrap}>
            <Grid
              container
              wrap="nowrap"
              className={classes.addEditOEMClientContent}
            >
              <Grid
                item
                xs={4}
                className={classes.addEditOEMClientContentItem}
                style={{ overflowX: 'hidden' }}
              >
                <Card shadow={false} radius={false} icon={false}>
                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Grid container>
                        <Grid item>
                          <i
                            className={`icon-computer-screen-1 ${classes.deviceIcon}`}
                          />
                        </Grid>
                        <Grid item>
                          <Typography className={classes.deviceName}>
                            {t('OEM Client id', { id: OEMClientID })}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <CheckboxSwitcher
                        label={t('Status')}
                        value={deviceStatus}
                      />
                    </Grid>
                  </Grid>
                </Card>

                <Card
                  icon={false}
                  dropdown={false}
                  grayHeader={true}
                  shadow={false}
                  radius={false}
                  removeSidePaddings={true}
                  title={t('Client Details').toUpperCase()}
                  rootClassName={classes.clientDetailCardRoot}
                >
                  <Grid container>
                    <Grid item xs={12} className={classes.clientDetailRow}>
                      <FormControlInput
                        id="device-name"
                        fullWidth={true}
                        label={t('Client Name')}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.clientDetailRow}>
                      <FormControlInput
                        id="device-alias"
                        fullWidth={true}
                        label={t('Client Type')}
                      />
                    </Grid>
                    <Grid item xs={12} className={classes.clientDetailRow}>
                      <Grid container direction="column">
                        <Grid item>
                          <InputLabel
                            shrink
                            variant="filled"
                            className={classes.expireDateLabel}
                          >
                            {t('Expire On')}
                          </InputLabel>
                        </Grid>
                        <Grid item>
                          <SingleDatePicker
                            id="expiration-date"
                            showDefaultInputIcon
                            inputIconPosition="after"
                            placeholder={null}
                            numberOfMonths={1}
                            date={expireDate}
                            onDateChange={expireDate =>
                              this.setState({ expireDate })
                            }
                            focused={expireDateFocused}
                            onFocusChange={({ focused }) =>
                              this.setState({ expireDateFocused: focused })
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={4} className={classes.addEditOEMClientContentItem}>
                <Card
                  icon={false}
                  shadow={false}
                  radius={false}
                  flatHeader={true}
                  title={t('Device Configuration')}
                  rootClassName={classes.deviceConfigWrap}
                >
                  {deviceConfig.map((config, index) => (
                    <Grid
                      key={`bandwidth-plan-${index}`}
                      container
                      justify="space-between"
                      alignItems="center"
                      className={classes.deviceConfig}
                    >
                      <Grid item>
                        <Typography className={classes.deviceConfigLabel}>
                          {config.label}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <CheckboxSwitcher value={config.value} />
                      </Grid>
                    </Grid>
                  ))}
                  {deviceConfigSliderValues.map((deviceConfigSlider, index) => (
                    <Grid
                      key={`device-conf-slider-${index}`}
                      container
                      justify="space-between"
                      className={classes.deviceConfigSlider}
                    >
                      <Grid item>
                        <Typography className={classes.deviceConfigSliderLabel}>
                          {deviceConfigSlider.label}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <SliderInputRange
                          maxValue={deviceConfigSlider.maxValue}
                          minValue={0}
                          step={1}
                          value={deviceConfigSlider.value}
                          onChange={value =>
                            this.setBandwidthSliderValue(value, index)
                          }
                          label={false}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Card>
              </Grid>

              <Grid item xs={4} className={classes.addEditOEMClientContentItem}>
                <Scrollbars>
                  <Card
                    icon={false}
                    shadow={false}
                    radius={false}
                    flatHeader={true}
                    title={t('Features')}
                  >
                    <Grid container>
                      {premiumFeatures.map((feature, index) => (
                        <Grid item xs={6} key={`feature-${index}`}>
                          <Grid
                            className={classes.detailRow}
                            container
                            justify="space-between"
                            alignItems="center"
                          >
                            <Grid item>
                              <Typography className={classes.detailLabel}>
                                {feature.label}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <CheckboxSwitcher value={feature.value} />
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                </Scrollbars>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Actions />
          </Grid>
        </Grid>
      </SideModal>
    )
  }
}

export default translate('translations')(withStyles(styles)(AddEditOEMClient))
