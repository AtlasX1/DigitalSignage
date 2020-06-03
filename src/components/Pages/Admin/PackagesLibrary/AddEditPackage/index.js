import React, { useCallback, useEffect, useRef } from 'react'
import { translate } from 'react-i18next'
import {
  CLIENT_PACKAGE,
  DEVICE_PACKAGE,
  BANDWIDTH_PACKAGE
} from 'constants/packageConstants'
import { withStyles, Grid, Typography } from '@material-ui/core'

import { SideModal } from 'components/Modal'
import { FormControlInput, SliderInputRange } from 'components/Form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FeatureItem from './FeatureItem'

import {
  postClientPackages,
  getClientPackageById,
  putClientPackage
} from 'actions/clientPackagesActions'

import {
  postDevicePackage,
  getDevicePackageById,
  putDevicePackage
} from 'actions/devicePackageActions'

import {
  postBandwidthPackage,
  getBandwidthPackageById,
  putBandwidthPackage
} from 'actions/bandwidthPackageActions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import FooterLayout from 'components/Modal/FooterLayout'
import { Scrollbars } from 'components/Scrollbars'

const styles = ({ palette, type }) => ({
  addHelpPageWrap: {
    height: '100%'
  },
  addHelpPageDetails: {
    padding: '0 30px',
    overflow: 'auto',
    height: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  marginBottom40: {
    marginBottom: '40px'
  },
  bandwidthWrap: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  bandwidthLabel: {
    lineHeight: '55px',
    color: '#74809a'
  },
  sliderInputRangeRoot: {
    marginTop: '15px'
  },

  actionsWrap: {
    width: '100%',
    padding: '15px 40px'
  },
  actionWrap: {
    paddingRight: '16px'
  },
  action: {
    width: '142px',
    paddingTop: '9px',
    paddingBottom: '9px'
  },
  actionCancel: {
    borderColor: palette[type].pages.users.addUser.button.border,
    boxShadow: 'none',
    backgroundImage: palette[type].pages.users.addUser.button.background,
    color: palette[type].pages.users.addUser.button.color
  },
  amountLabel: {
    fontSize: '17px',
    fontStyle: 'italic',
    color: '#74809a',
    marginLeft: '15px'
  },
  amountInput: {
    display: 'flex',
    alignItems: 'center'
  },
  featureList: {
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  }
})

const AddEditPackage = ({
  t,
  classes,
  match: {
    params: { id, variant }
  },
  history,
  putClientPackage,
  putDevicePackage,
  postDevicePackage,
  deviceFeatureList,
  clientFeatureList,
  postClientPackages,
  devicePackageItem,
  clientPackageItem,
  putBandwidthPackage,
  postBandwidthPackage,
  getClientPackageById,
  getDevicePackageById,
  bandwidthPackageItem,
  getBandwidthPackageById
}) => {
  const form = useFormik({
    initialValues: {
      featureList: [],
      featureName: '',
      bandwidth: 1,
      amount: 1
    },
    validationSchema: Yup.object().shape({
      featureName: Yup.string().required('Please enter field')
    }),
    onSubmit: ({ featureList, featureName, bandwidth, amount }) => {
      const ids = []
      featureList.forEach(({ id, selected }) => !selected || ids.push(id))

      const data = {
        title: featureName,
        bandwidth: bandwidth,
        amount: amount,
        feature: [...ids]
      }

      const editData = {
        ...data,
        status: 'Active'
      }

      switch (variant) {
        case CLIENT_PACKAGE: {
          id ? putClientPackage(id, editData) : postClientPackages(data)
          break
        }
        case DEVICE_PACKAGE: {
          id ? putDevicePackage(id, editData) : postDevicePackage(data)
          break
        }
        case BANDWIDTH_PACKAGE: {
          id ? putBandwidthPackage(id, editData) : postBandwidthPackage(data)
          break
        }
        default:
          break
      }
      history.goBack()
    }
  })

  // Send req on fetch data
  useEffect(() => {
    switch (variant) {
      case CLIENT_PACKAGE: {
        getClientPackageById(id)
        break
      }
      case DEVICE_PACKAGE: {
        getDevicePackageById(id)
        break
      }
      case BANDWIDTH_PACKAGE: {
        getBandwidthPackageById(id)
        break
      }
      default:
        break
    }
  }, [
    getBandwidthPackageById,
    getClientPackageById,
    getDevicePackageById,
    id,
    variant
  ])

  const intialFormValues = useRef(form.values)

  // Fetch data
  useEffect(() => {
    if (id) {
      let data = {}
      switch (variant) {
        case CLIENT_PACKAGE: {
          if (Object.keys(clientPackageItem).length) {
            const { feature, title, bandwidth } = clientPackageItem

            data = {
              bandwidth: Number.parseInt(bandwidth),
              featureName: title,
              featureList: form.values.featureList.map(item =>
                feature.map(({ id }) => id).includes(item.id)
                  ? { ...item, selected: true }
                  : item
              )
            }
          }
          break
        }
        case DEVICE_PACKAGE: {
          const { feature, title } = devicePackageItem
          data = {
            featureName: title,
            featureList: form.values.featureList.map(item =>
              feature.map(({ id }) => id).includes(item.id)
                ? { ...item, selected: true }
                : item
            )
          }
          break
        }
        case BANDWIDTH_PACKAGE: {
          const { title, amount, bandwidth } = bandwidthPackageItem
          data = {
            featureName: title,
            amount,
            bandwidth: Number.parseInt(bandwidth)
          }
          break
        }
        default:
          break
      }

      intialFormValues.current = {
        ...form.values,
        ...data
      }
      form.setValues(intialFormValues.current)
    }
    // eslint-disable-next-line
  }, [bandwidthPackageItem, devicePackageItem, clientPackageItem, id, variant])

  // Snap featureList config to state
  useEffect(() => {
    switch (variant) {
      case CLIENT_PACKAGE: {
        intialFormValues.current.featureList = clientFeatureList.map(item => {
          return {
            ...item,
            selected: false
          }
        })
        break
      }
      case DEVICE_PACKAGE: {
        intialFormValues.current.featureList = deviceFeatureList.map(item => {
          return {
            ...item,
            selected: false
          }
        })
        break
      }
      default:
        break
    }
    form.setFieldValue('featureList', intialFormValues.current.featureList)
    // eslint-disable-next-line
  }, [clientFeatureList, deviceFeatureList, variant])

  const handleToggleSwitcher = useCallback(
    (value, id) => {
      const modifiedFeaturesList = form.values.featureList.map(item =>
        item.id === id ? { ...item, selected: value } : item
      )

      form.setFieldValue('featureList', modifiedFeaturesList)
    },
    [form]
  )

  const handleChangeBandwidth = useCallback(
    value => {
      form.setFieldValue('bandwidth', value)
    },
    [form]
  )

  const handleChangeAmount = useCallback(
    ({ target: { value } }) => {
      form.setFieldValue('amount', value)
    },
    [form]
  )

  return (
    <SideModal
      width="35%"
      title={id ? t('Edit Feature Package') : t('Add New Package')}
      closeLink="/system/packages-library"
      footerLayout={
        <FooterLayout
          onSubmit={form.handleSubmit}
          onReset={() => form.setValues(intialFormValues.current)}
          isUpdate={!!id}
        />
      }
    >
      <Grid
        container
        direction="column"
        justify="space-between"
        className={classes.addHelpPageWrap}
      >
        <Scrollbars>
          <Grid item className={classes.addHelpPageDetails}>
            <Grid container className={classes.marginBottom40}>
              <Grid item xs={12}>
                <FormControlInput
                  id="featureName"
                  fullWidth
                  label={t('Package Name')}
                  value={form.values.featureName}
                  error={form.errors.featureName}
                  touched={form.touched.featureName}
                  handleChange={form.handleChange}
                />
              </Grid>
              {variant === DEVICE_PACKAGE ? null : (
                <Grid item xs={12}>
                  <Grid
                    container
                    justify="space-between"
                    className={classes.bandwidthWrap}
                  >
                    <Grid item>
                      <Typography className={classes.bandwidthLabel}>
                        {t('Bandwidth')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <SliderInputRange
                        rootClass={classes.sliderInputRangeRoot}
                        value={form.values.bandwidth}
                        onChange={handleChangeBandwidth}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
              {variant !== BANDWIDTH_PACKAGE ? null : (
                <Grid item xs={12}>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.bandwidthWrap}
                  >
                    <Grid item>
                      <Typography className={classes.bandwidthLabel}>
                        {t('Amount')}
                      </Typography>
                    </Grid>
                    <Grid item className={classes.amountInput}>
                      <FormControlInput
                        type="number"
                        marginBottom={false}
                        value={form.values.amount}
                        handleChange={handleChangeAmount}
                      />
                      <Grid item>
                        <Typography className={classes.amountLabel}>
                          $
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
            {variant === BANDWIDTH_PACKAGE ? null : (
              <>
                <div className={classes.featureList}>
                  {form.values.featureList.map(feature => (
                    <FeatureItem
                      key={`feature-item${feature.name}-${feature.selected}`}
                      feature={feature}
                      toggleSwitcher={handleToggleSwitcher}
                    />
                  ))}
                </div>
              </>
            )}
          </Grid>
        </Scrollbars>
      </Grid>
    </SideModal>
  )
}

export default translate('translations')(
  withStyles(styles)(
    connect(
      ({
        config: { configFeatureClient, configFeatureDevice },
        clientPackage: {
          item: { response: clientPackageItem }
        },
        devicePackage: {
          item: { response: devicePackageItem }
        },
        bandwidthPackage: {
          item: { response: bandwidthPackageItem }
        }
      }) => ({
        clientFeatureList: configFeatureClient.response,
        deviceFeatureList: configFeatureDevice.response,
        clientPackageItem,
        devicePackageItem,
        bandwidthPackageItem
      }),
      dispatch =>
        bindActionCreators(
          {
            postClientPackages,
            putClientPackage,
            putDevicePackage,
            postDevicePackage,
            putBandwidthPackage,
            postBandwidthPackage,
            getClientPackageById,
            getDevicePackageById,
            getBandwidthPackageById
          },
          dispatch
        )
    )(AddEditPackage)
  )
)
