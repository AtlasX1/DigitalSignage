import React, { Fragment, useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import isObject from 'lodash/isObject'
import { withStyles, Grid, Typography, Button } from '@material-ui/core'

import { WysiwygEditor, FormControlInput } from 'components/Form'
import { Card } from 'components/Card'
import { CheckboxSwitcher } from 'components/Checkboxes'
import Actions from './Actions'
import UploadLogoCard from 'components/UploadLogoCard'
import IPRestrictionsCard from './IPRestrictionsCard'
import InputWithAdornment from './InputWithAdornment'
import LinkEditor from './LinkEditor'

import 'react-input-range/lib/bundle/react-input-range.css'
import 'styles/forms/_slider-input-range.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  clearPutSettingsInfoAction,
  clearSettingsAction,
  getSettingsAction,
  putSettingsAction
} from 'actions/settingsActions'
import Loader from 'components/Loader'
import { useFormik } from 'formik'
import { withSnackbar } from 'notistack'

const styles = ({ palette, type, spacing }) => ({
  pageHeader: {
    padding: `${spacing.unit * 3}px ${spacing.unit * 3}px 0`
  },
  superAdminSettings: {
    height: '100%'
  },
  superAdminSettingsWrap: {
    flex: '1 1 auto',
    maxHeight: '100%',
    overflow: 'hidden'
  },
  superAdminSettingsContent: {
    height: '100%',
    borderTop: `1px solid ${palette[type].pages.adminSettings.content.border}`
  },
  superAdminSettingsContentItem: {
    overflowX: 'auto',

    '&:not(:last-child)': {
      borderRight: `1px solid ${palette[type].pages.adminSettings.content.border}`
    }
  },
  signatureWrap: {
    paddingBottom: '15px'
  },
  leftSettingsWrap: {
    paddingTop: '15px',
    paddingLeft: '25px',
    paddingRight: '25px'
  },
  cardRoot: {
    padding: '0 10px'
  },
  clientDetailRow: {
    padding: `0 ${spacing.unit * 3}px`
  },
  bgImageInputWrap: {
    paddingLeft: '15px'
  },
  allowSocialCard: {
    padding: '0 25px'
  },
  allowSocialWrap: {
    padding: '0 10px',
    borderBottom: `1px solid ${palette[type].pages.adminSettings.content.border}`
  },
  allowSocialText: {
    fontSize: '13px',
    color: '#74809a'
  },
  noPaddings: {
    padding: 0
  }
})

const initValues = {
  headerLogo: '',
  footerLogo: '',
  backgroundImage: '',
  domain: '',
  windowTitle: '',
  loginBackgroundImage: {
    morning: [],
    afternoon: [],
    night: []
  },
  email: '',
  emailSignature: '',
  smtpHost: '',
  smtpUser: '',
  support: {
    uri: '',
    email: ''
  },
  helpPage: '',
  privacyPolicy: {
    preferred: 'text',
    link: '',
    text: ''
  },
  termsCondition: {
    preferred: 'text',
    link: '',
    text: ''
  },
  aboutPage: {
    preferred: 'text',
    link: '',
    text: ''
  }
}

const SuperAdminSettings = ({
  t,
  classes,
  match,
  settings,
  putReducer,
  getSettingsAction,
  clearSettingsAction,
  putSettingsAction,
  clearPutSettingsInfoAction,
  enqueueSnackbar,
  closeSnackbar
}) => {
  // const accountID = this.props.match.params.id
  const urlArray = match.url.split('/')
  const url = urlArray[urlArray.length - 1]

  const [backgroundImages] = useState([
    { imagePath: 'https://picsum.photos/76/38' },
    { imagePath: 'https://picsum.photos/76/38' },
    { imagePath: 'https://picsum.photos/76/38' }
  ])

  const [loading, setLoading] = useState(true)
  const [initialFormValues, setInitialFormValues] = useState(initValues)

  const form = useFormik({
    initialValues: initialFormValues,
    onSubmit: formValues => {
      const formData = new FormData()
      formData.append('_method', 'PUT')
      Object.keys(formValues).forEach(key => {
        const value = formValues[key]
        if (value !== initialFormValues[key]) {
          if (isObject(value) && !isImg(key)) {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, value)
          }
        }
      })
      putSettingsAction(formData)
    }
  })

  const isImg = useCallback(
    key =>
      key === 'headerLogo' || key === 'footerLogo' || key === 'backgroundImage',
    []
  )

  useEffect(() => {
    getSettingsAction()
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (settings.response) {
      setInitialFormValues(settings.response)
      form.setValues(settings.response)

      setLoading(false)
    } else if (settings.error) {
      clearSettingsAction()
    }
    //eslint-disable-next-line
  }, [settings])

  useEffect(() => {
    if (putReducer.response) {
      getSettingsAction()

      showSnackbar(t('Successfully changed'))
      clearPutSettingsInfoAction()
    } else if (putReducer.error) {
      showSnackbar(t('Error'))
      clearPutSettingsInfoAction()
    }
    //eslint-disable-next-line
  }, [putReducer])

  const showSnackbar = title => {
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  return loading ? (
    <Loader />
  ) : (
    <Card
      icon={false}
      flatHeader={true}
      title={t('Super Admin Settings')}
      rootClassName={classes.noPaddings}
      headerClasses={[classes.pageHeader]}
    >
      <Grid
        container
        wrap="nowrap"
        direction="column"
        alignItems="stretch"
        className={classes.superAdminSettings}
      >
        <Grid item className={classes.superAdminSettingsWrap}>
          <Grid
            container
            wrap="nowrap"
            className={classes.superAdminSettingsContent}
          >
            <Grid item xs={4} className={classes.superAdminSettingsContentItem}>
              <Grid container className={classes.leftSettingsWrap}>
                <Grid item xs={12}>
                  <UploadLogoCard
                    title={t('Header Logo')}
                    name="headerLogo"
                    formValue={form.values.headerLogo}
                    onChange={form.setFieldValue}
                  />
                </Grid>
                <Grid item xs={12}>
                  <UploadLogoCard
                    title={t('Footer Logo')}
                    name="footerLogo"
                    formValue={form.values.footerLogo}
                    onChange={form.setFieldValue}
                  />
                </Grid>
                <Grid item xs={12}>
                  <UploadLogoCard
                    title={t('Background Image')}
                    name="backgroundImage"
                    formValue={form.values.backgroundImage}
                    onChange={form.setFieldValue}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlInput
                    id="domain-name"
                    value={form.values.domain}
                    handleChange={form.handleChange}
                    name="domain"
                    fullWidth={true}
                    label={t('Domain Name')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlInput
                    id="window-title"
                    value={form.values.windowTitle}
                    handleChange={form.handleChange}
                    name="windowTitle"
                    fullWidth={true}
                    label={t('Window Title')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlInput
                    id="copyright-text"
                    value={form.values.copyrightText}
                    handleChange={form.handleChange}
                    name="copyrightText"
                    fullWidth={true}
                    label={t('Copyright Text')}
                  />
                </Grid>
                {url === 'settings' && (
                  <Fragment>
                    <Grid item xs={12}>
                      <CheckboxSwitcher
                        label={t('Allow Media to Copy to Clients')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <IPRestrictionsCard />
                    </Grid>
                  </Fragment>
                )}
              </Grid>
              <Card
                icon={false}
                dropdown={false}
                grayHeader={true}
                shadow={false}
                radius={false}
                removeSidePaddings
                removeNegativeHeaderSideMargins
                title={t('Login Page Background Images').toUpperCase()}
              >
                <Grid container>
                  {backgroundImages.map((image, index) => (
                    <Grid
                      item
                      xs={12}
                      key={`bg-image-${index}`}
                      className={classes.clientDetailRow}
                    >
                      <Grid container>
                        <Grid item>
                          <img src={image.imagePath} alt="" />
                        </Grid>
                        <Grid item xs className={classes.bgImageInputWrap}>
                          <InputWithAdornment
                            label={false}
                            fullWidth={true}
                            id={`background-image-${index}`}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={4} className={classes.superAdminSettingsContentItem}>
              <Card
                icon={false}
                shadow={false}
                radius={false}
                flatHeader={true}
                title={t('Email Configuration')}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <FormControlInput
                      id="form-email-ID"
                      value={form.values.email}
                      handleChange={form.handleChange}
                      name="email"
                      fullWidth={true}
                      label={t('Form E-mail ID')}
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.signatureWrap}>
                    <WysiwygEditor label={t('Signature')} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlInput
                      id="SMTP-host"
                      value={form.values.smtpHost || ''}
                      handleChange={form.handleChange}
                      name="smtpHost"
                      fullWidth={true}
                      label={t('SMTP Host')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlInput
                      id="SMTP-user-name"
                      value={form.values.smtpUser || ''}
                      handleChange={form.handleChange}
                      name="smtpUser"
                      fullWidth={true}
                      label={t('SMTP User Name')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <UploadLogoCard title={t('Client Support Image')} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlInput
                      id="client-support-url"
                      value={form.values.support.uri}
                      handleChange={form.handleChange}
                      name="support.uri"
                      fullWidth={true}
                      label={t('Client Support Url')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlInput
                      id="client-support-email"
                      value={form.values.support.email}
                      handleChange={form.handleChange}
                      name="support.email"
                      fullWidth={true}
                      label={t('Client Support Email')}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={4} className={classes.superAdminSettingsContentItem}>
              <Card
                icon={false}
                shadow={false}
                radius={false}
                flatHeader={true}
                title={t('Links Configuration')}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <FormControlInput
                      id="help"
                      value={form.values.helpPage}
                      handleChange={form.handleChange}
                      name="helpPage"
                      fullWidth={true}
                      label={t('Help')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LinkEditor
                      title={t('Privacy Policy')}
                      type={form.values.privacyPolicy.preferred === 'link'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LinkEditor
                      title={t('Terms and Condition')}
                      type={form.values.termsCondition.preferred === 'link'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LinkEditor
                      title={t('About Us')}
                      type={form.values.aboutPage.preferred === 'link'}
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
                removeSidePaddings
                removeNegativeHeaderSideMargins
                title={t('Allow Social Site Login').toUpperCase()}
              >
                <div className={classes.allowSocialCard}>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.allowSocialWrap}
                  >
                    <Grid item>
                      <Typography className={classes.allowSocialText}>
                        {t('Login with Facebook')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <CheckboxSwitcher
                        value={false}
                        switchBaseClass={classes.featureCheckboxSwitcher}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.allowSocialWrap}
                  >
                    <Grid item>
                      <Typography className={classes.allowSocialText}>
                        {t('Login with Microsoft')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <CheckboxSwitcher
                        value={true}
                        switchBaseClass={classes.featureCheckboxSwitcher}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.allowSocialWrap}
                  >
                    <Grid item>
                      <Typography className={classes.allowSocialText}>
                        {t('Login With LinkedIn')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <CheckboxSwitcher
                        value={false}
                        switchBaseClass={classes.featureCheckboxSwitcher}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    justify="space-between"
                    alignItems="center"
                    className={classes.allowSocialWrap}
                  >
                    <Grid item>
                      <Typography className={classes.allowSocialText}>
                        {t('Login With Google')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <CheckboxSwitcher
                        value={true}
                        switchBaseClass={classes.featureCheckboxSwitcher}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Actions onUpdateSettings={form.submitForm} />
        </Grid>
      </Grid>
    </Card>
  )
}

SuperAdminSettings.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  putReducer: PropTypes.object.isRequired,
  getSettingsAction: PropTypes.func.isRequired,
  clearSettingsAction: PropTypes.func.isRequired,
  putSettingsAction: PropTypes.func.isRequired,
  clearPutSettingsInfoAction: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  closeSnackbar: PropTypes.func.isRequired
}

const mapStateToProps = ({ settings }) => ({
  settings: settings.details,
  putReducer: settings.put
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSettingsAction,
      clearSettingsAction,
      putSettingsAction,
      clearPutSettingsInfoAction
    },
    dispatch
  )

export default translate('translations')(
  withSnackbar(
    withStyles(styles)(
      connect(mapStateToProps, mapDispatchToProps)(SuperAdminSettings)
    )
  )
)
