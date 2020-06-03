import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { translate } from 'react-i18next'
import { getNames } from 'country-list'
import { withSnackbar } from 'notistack'
import { useFormik } from 'formik'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { withStyles, Grid, Typography } from '@material-ui/core'

import { SideModal } from '../../../../Modal'
import {
  FormControlInput,
  FormControlSelect,
  SliderInputRange,
  FormControlChips
} from 'components/Form'
import { Card } from 'components/Card'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { Scrollbars } from 'components/Scrollbars'
import FooterLayout from 'components/Modal/FooterLayout'

import { routeByName } from 'constants/index'
import { getConfigFeatureDevice } from 'actions/configActions'
import { selectUtils, getUrlPrefix } from 'utils/index'
import { useCustomSnackbar } from 'hooks/index'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import * as tagsActions from 'actions/tagsActions'
import {
  getDeviceItemAction,
  clearGetDeviceItemInfoAction,
  putDeviceItemAction,
  clearPutDeviceItemInfoAction,
  getDeviceItemsAction,
  getDeviceGroupsAction,
  clearGetDeviceGroupsInfoAction
} from 'actions/deviceActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    sideModalHeader: {
      paddingTop: '12px',
      paddingBottom: '12px',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    addEditDevice: {
      height: '100%'
    },
    addEditDeviceWrap: {
      flex: '1 1 auto',
      maxHeight: '100%',
      overflow: 'hidden'
    },
    addEditDeviceContent: {
      height: '100%'
    },
    addEditDeviceContentItem: {
      overflowY: 'auto',
      overflowX: 'hidden',

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
      color: palette[type].sideModal.header.titleColor
    },
    deviceDetailCardRoot: {
      padding: '0 10px'
    },
    deviceDetailRow: {
      padding: '0 10px'
    },
    deviceConfigWrap: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
    },
    deviceConfigFields: {
      paddingTop: '20px'
    },
    deviceConfig: {
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`
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
    detailLabel: {
      color: palette[type].sideModal.switcher.label.color,
      maxWidth: 120,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    selectDropdown: {
      maxHeight: 400
    }
  }
}

const AddEditDevice = ({
  t,
  match,
  classes,
  history,
  backTo,
  itemDeviceReducer,
  getDeviceItemAction,
  clearGetDeviceItemInfoAction,
  putDeviceReducer,
  putDeviceItemAction,
  clearPutDeviceItemInfoAction,
  enqueueSnackbar,
  closeSnackbar,
  getDeviceItemsAction,
  groupsReducer,
  getDeviceGroupsAction,
  clearGetDeviceGroupsInfoAction,
  getTags,
  tags,
  deviceFeatureList,
  getConfigFeatureDevice
}) => {
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const [countriesOptions] = useState(
    getNames().map(c => ({ value: c, label: c }))
  )
  const [edit] = useState(match.path.split('/').includes('edit'))
  const [copyClientAddress] = useState(true)
  const [deviceConfig] = useState([
    { label: t('Enable Javascript Logging'), value: false },
    { label: t('VLC Location Reload'), value: false },
    { label: t('Allow Exception Log'), value: false },
    { label: t('Do Not Deduct Bandwidth'), value: false },
    { label: t('Select Specific Timeframe'), value: false },
    { label: t('Enable HTML5 Playback'), value: false },
    { label: t('Enable HTML5 Video Input'), value: false },
    { label: t('Allow Proxy'), value: false },
    { label: t('Set Device Layout'), value: false },
    { label: t('Allow Sleep Mode'), value: false }
  ])
  const [deviceConfigSliderValues] = useState([
    { label: t('4GB Upgrade'), value: 152, maxValue: 304 },
    { label: t('Firmware Update Check'), value: 152, maxValue: 304 },
    { label: t('Screen Snapshot Frequency'), value: 152, maxValue: 304 },
    { label: t('Check Device Reboot'), value: 152, maxValue: 304 },
    { label: t('Device Config Check'), value: 152, maxValue: 304 },
    { label: t('Weather Refresh Interval'), value: 152, maxValue: 304 }
  ])
  const [disableDevice, setDisableDevice] = useState(false)
  const [groupsList, setGroupsList] = useState([])
  const [tagsList, setTagsList] = useState([])

  const deviceFeatureSelectedList = useSelectedList(
    deviceFeatureList.map(({ id }) => id)
  )

  const fallback = v => v || undefined

  const form = useFormik({
    initialValues: {
      name: '',
      alias: '',
      deviceType: '',
      client: '',
      state: '',
      zip: '',
      city: '',
      country: '',
      group: [],
      tag: [],
      macAddress: [],
      address1: '',
      address2: '',
      hardwareDetails: '',
      description: ''
    },
    onSubmit: values => {
      const data = update(values, {
        $merge: {
          description: fallback(values.description),
          hardwareDetails: fallback(values.hardwareDetails),
          address1: fallback(values.address1),
          address2: fallback(values.address2),
          country: fallback(values.country)
        },
        tag: {
          $apply: tag => selectUtils.convertArr(tag, selectUtils.fromChipObj)
        },
        group: {
          $apply: group =>
            selectUtils.convertArr(group, selectUtils.fromChipObj)
        }
      })

      putDeviceItemAction({
        id: match.params.id,
        data: data
      })
    }
  })

  const intialFormValues = useRef(form.values)

  useEffect(() => {
    if (edit) {
      if (!itemDeviceReducer.response) {
        getDeviceItemAction(match.params.id)
      }
    }
    if (!groupsReducer.response) {
      getDeviceGroupsAction()
    }
    if (!deviceFeatureList.length) {
      getConfigFeatureDevice()
    }
    getTags({
      limit: 9999
    })

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (itemDeviceReducer.response) {
      const { response } = itemDeviceReducer
      intialFormValues.current = {
        name: response.name || '',
        alias: response.alias || '',
        deviceType: response.deviceType.id || '',
        client: response.client.name || '',
        state: response.state || '',
        zip: response.zip || '',
        city: response.city || '',
        country: response.country,
        group: selectUtils.convertArr(response.group, selectUtils.toChipObj),
        tag: selectUtils.convertArr(response.tag, selectUtils.toChipObj),
        macAddress: selectUtils.convertArr(
          response.macAddress,
          selectUtils.macToChipObj
        ),
        temporaryMacAddress: selectUtils.convertArr(
          response.macAddress.filter(({ temporary }) => temporary),
          selectUtils.macToChipObj
        ),
        address1: response.address1 || '',
        address2: response.address2 || '',
        teamviewerId: response.teamviewerId || '',
        hardwareDetails: response.hardwareDetails || '',
        description: response.description || ''
      }
      form.setValues(intialFormValues.current)

      deviceFeatureSelectedList.selectIds(
        response.feature ? response.feature.map(({ id }) => id) : []
      )
      // setPremiumFeatures(response.feature)

      clearGetDeviceItemInfoAction()
    } else if (itemDeviceReducer.error) {
      clearGetDeviceItemInfoAction()
    }
    // eslint-disable-next-line
  }, [itemDeviceReducer])

  useEffect(() => {
    if (putDeviceReducer.response) {
      showSnackbar(t('Successfully changed'))
      history.push(getUrlPrefix(routeByName.device.editCloseLink(backTo)))
      clearPutDeviceItemInfoAction()

      getDeviceItemsAction()
    } else if (putDeviceReducer.error) {
      showSnackbar(t('Error'))
      clearPutDeviceItemInfoAction()
    }
    // eslint-disable-next-line
  }, [putDeviceReducer])

  const handleCountrySelect = e => {
    const value = e.target.value
    form.setFieldValue('country', value, false)
  }

  useEffect(() => {
    if (groupsReducer.response) {
      const response = groupsReducer.response
      clearGetDeviceGroupsInfoAction()

      if (response.meta.total && response.meta.total !== response.data.length) {
        getDeviceGroupsAction({
          limit: response.meta.total
        })
      } else {
        setGroupsList(response.data)
      }
    } else if (groupsReducer.error) {
      clearGetDeviceGroupsInfoAction()
    }
    // eslint-disable-next-line
  }, [groupsReducer])

  useEffect(() => {
    if (tags.meta.count < tags.meta.total) {
      getTags({
        limit: tags.meta.total
      })
    } else {
      if (tags.response) {
        setTagsList(tags.response)
      }
    }
    // eslint-disable-next-line
  }, [tags])

  const title = form.values.name
    ? t('Device name', { deviceName: form.values.name })
    : t('Add New Device')

  return (
    <SideModal
      width="99%"
      title={title}
      headerClassName={classes.sideModalHeader}
      closeLink={getUrlPrefix(routeByName.device.editCloseLink(backTo))}
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={() => form.setValues(intialFormValues.current)}
          isUpdate={edit}
        />
      }
    >
      <Grid
        container
        wrap="nowrap"
        direction="column"
        alignItems="stretch"
        className={classes.addEditDevice}
      >
        <Grid item className={classes.addEditDeviceWrap}>
          <Grid
            container
            wrap="nowrap"
            className={classes.addEditDeviceContent}
          >
            <Grid item xs={4} className={classes.addEditDeviceContentItem}>
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
                          {t('Device name', { deviceName: form.values.name })}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <CheckboxSwitcher
                      label={t('Disable Device')}
                      value={disableDevice}
                      handleChange={() => setDisableDevice(!disableDevice)}
                    />
                  </Grid>
                </Grid>

                {disableDevice && (
                  <FormControlInput
                    id="reason-unique-client"
                    fullWidth={true}
                    multiline={true}
                    rows={10}
                    placeholder={t('Reason for disable')}
                  />
                )}
              </Card>

              <Card
                icon={false}
                dropdown={false}
                grayHeader={true}
                shadow={false}
                radius={false}
                removeSidePaddings={true}
                title={t('Device Details').toUpperCase()}
                rootClassName={classes.deviceDetailCardRoot}
              >
                <Grid container>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="device-name"
                      name="name"
                      fullWidth={true}
                      label={t('Device Name')}
                      value={form.values.name}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="device-alias"
                      name="alias"
                      fullWidth={true}
                      label={t('Device Alias')}
                      value={form.values.alias}
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.deviceDetailRow}>
                    <FormControlSelect
                      id="device-type"
                      name="deviceType"
                      fullWidth={true}
                      label={t('Device Type')}
                      value={form.values.deviceType}
                      options={[
                        { value: 1, label: 'Xhibit Light' },
                        { value: 2, label: 'Type 2' },
                        { value: 3, label: 'Type 3' },
                        { value: 4, label: 'Flex' }
                      ]}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="assign-client"
                      fullWidth={true}
                      label={t('Assign to Client')}
                      value={form.values.client}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <CheckboxSwitcher
                      label={t('Copy Client Address')}
                      value={copyClientAddress}
                      // handleChange={(value) => {
                      //   this.handleSwitchChange(value, 'copyClientAddress')
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="address1"
                      name="address1"
                      fullWidth={true}
                      label={t('Address 1')}
                      value={form.values.address1}
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="address2"
                      name="address2"
                      fullWidth={true}
                      label={t('Address 2')}
                      value={form.values.address2}
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="state"
                      name="state"
                      fullWidth={true}
                      label={t('State')}
                      value={form.values.state}
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={6} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="zip"
                      name="zip"
                      fullWidth={true}
                      label={t('Zip')}
                      value={form.values.zip}
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <FormControlInput
                      id="city"
                      name="city"
                      fullWidth={true}
                      label={t('City')}
                      value={form.values.city}
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <FormControlSelect
                      id="country"
                      name="country"
                      fullWidth={true}
                      label={t('Country')}
                      value={form.values.country}
                      options={countriesOptions}
                      customMenuPaperClassName={classes.selectDropdown}
                      handleChange={handleCountrySelect}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <FormControlChips
                      label={t('Create New / Add Group')}
                      options={selectUtils.convertArr(
                        groupsList,
                        selectUtils.toChipObj
                      )}
                      values={form.values.group}
                      name="group"
                      handleChange={form.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.deviceDetailRow}>
                    <FormControlChips
                      label={t('Tags')}
                      options={selectUtils.convertArr(
                        tagsList,
                        selectUtils.tagToChipObj
                      )}
                      values={form.values.tag}
                      name="tag"
                      handleChange={form.handleChange}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={4} className={classes.addEditDeviceContentItem}>
              <Scrollbars>
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
                        <CheckboxSwitcher
                          value={config.value}
                          // handleChange={(value) => {
                          //   this.deviceConfigurationStatusChanged(value, index)
                        />
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
                          // handleChange={value => this.setBandwidthSliderValue(value, index)}
                          label={t('Sec')}
                        />
                      </Grid>
                    </Grid>
                  ))}
                  <Grid container className={classes.deviceConfigFields}>
                    <Grid item xs={12}>
                      <FormControlSelect
                        id="device-layout"
                        fullWidth={true}
                        label={t('Set Device Layout')}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlChips
                        label={t('MAC Address(es)')}
                        values={form.values.macAddress}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlChips
                        label={t('Temporary MAC Address')}
                        values={form.values.temporaryMacAddress}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlInput
                        id="teamviewer-ID"
                        fullWidth={true}
                        label={t('Teamviewer ID')}
                        value={form.values.teamviewerId}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlInput
                        id="hardware-details"
                        fullWidth={true}
                        name="hardwareDetails"
                        label={t('Hardware Details')}
                        value={form.values.hardwareDetails}
                        handleChange={form.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlInput
                        id="device-description"
                        fullWidth={true}
                        name="description"
                        label={t('Device Description')}
                        value={form.values.description}
                        handleChange={form.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CheckboxSwitcher label={t('Update Firmware')} />
                    </Grid>
                  </Grid>
                </Card>
              </Scrollbars>
            </Grid>
            <Grid item xs={4} className={classes.addEditDeviceContentItem}>
              <Scrollbars>
                <Card
                  icon={false}
                  shadow={false}
                  radius={false}
                  flatHeader={true}
                  title={t('Features')}
                >
                  <Grid container>
                    {deviceFeatureList.map((feature, index) => (
                      <Grid item xs={6} key={`feature-${index}`}>
                        <Grid
                          className={classes.deviceConfig}
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          <Grid item>
                            <Typography className={classes.detailLabel}>
                              {feature.alias}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <CheckboxSwitcher
                              value={deviceFeatureSelectedList.isSelect(
                                feature.id
                              )}
                            />
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
      </Grid>
    </SideModal>
  )
}

AddEditDevice.propTypes = {
  classes: PropTypes.object,
  itemDeviceReducer: PropTypes.object,
  getDeviceItemAction: PropTypes.func,
  clearGetDeviceItemInfoAction: PropTypes.func,
  getDeviceItemsAction: PropTypes.func,
  putDeviceItemAction: PropTypes.func,
  clearPutDeviceItemInfoAction: PropTypes.func,
  putDeviceReducer: PropTypes.object,
  groupsReducer: PropTypes.object,
  getDeviceGroupsAction: PropTypes.func,
  clearGetDeviceGroupsInfoAction: PropTypes.func
}

const mapStateToProps = ({ device, tags, config }) => ({
  itemDeviceReducer: device.item,
  putDeviceReducer: device.put,
  groupsReducer: device.groups,
  tags: tags.items,
  deviceFeatureList: config.configFeatureDevice.response
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceItemAction,
      clearGetDeviceItemInfoAction,
      putDeviceItemAction,
      clearPutDeviceItemInfoAction,
      getDeviceItemsAction,
      getDeviceGroupsAction,
      clearGetDeviceGroupsInfoAction,
      getTags: tagsActions.getItems,
      getConfigFeatureDevice
    },
    dispatch
  )

export default compose(
  translate('translations'),
  withStyles(styles),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(AddEditDevice)
