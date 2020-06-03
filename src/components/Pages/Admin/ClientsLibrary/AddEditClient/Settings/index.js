import React, { useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { useFormik } from 'formik'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import { Card } from 'components/Card'
import CheckboxListItem from '../CheckboxListItem'
import keysToCamel from 'utils/keysToCamelCase'
import { SETTINGS } from 'constants/clientsConstants'

const Settings = ({
  t,
  item,
  invokeCollector = f => f,
  isStartCollecting = false,
  doReset = false,
  isEdit = false,
  afterReset = f => f
}) => {
  const [backup, setBackup] = useState({})

  const translate = useMemo(
    () => ({
      title: t('Settings'),
      playbackReporting: t('Playback Reporting'),
      substitute: t("Substitute for 'No media to display'"),
      desktopNotify: t('Enable Desktop Emergency Notification'),
      sleepMode: t('Enable / Disable Sleep Mode'),

      securityTitle: t('Security Settings').toUpperCase(),
      is2faEnabled: t('Two Factor Authentication(2FA)'),
      ssoStatus: t('SAML Single Sign-On (SSO)'),
      autoLogOut: t('Auto logout ( 24min - 8hr )')
    }),
    [t]
  )

  const {
    values,
    handleChange,
    setValues,
    handleSubmit,
    handleReset
  } = useFormik({
    initialValues: {
      autoLogOut: false,
      ssoStatus: false,
      is2faEnabled: false,
      defaultScreen: {
        allowSubstituteImage: false,
        isDisplayBlackScreen: false,
        imageId: '',
        imageTitle: '',
        imageSize: ''
      },
      emergencyNotification: false,
      playbackReporting: false,
      sleepMode: false
    },

    onSubmit: values => {
      invokeCollector('settings', { ...values })
    }
  })

  useEffect(() => {
    if (isStartCollecting) {
      handleSubmit()
    }
    // eslint-disable-next-line
  }, [isStartCollecting])

  useEffect(() => {
    if (doReset) {
      isEdit ? setValues(backup) : handleReset({})
      afterReset(SETTINGS)
    }
    // eslint-disable-next-line
  }, [doReset])

  useEffect(() => {
    if (!isEmpty(item) && isEdit) {
      const {
        autoLogout,
        ssoStatus,
        is2faEnabled,
        defaultScreen,
        emergencyNotification,
        playbackReporting,
        sleepMode
      } = item

      setBackup({
        autoLogOut: autoLogout,
        ssoStatus,
        is2faEnabled,
        defaultScreen: keysToCamel(defaultScreen),
        emergencyNotification,
        playbackReporting,
        sleepMode
      })
    }
    // eslint-disable-next-line
  }, [item, isEdit])

  useEffect(() => {
    if (!isEmpty(backup)) {
      setValues(backup)
    }
    // eslint-disable-next-line
  }, [backup])

  return (
    <>
      <Card
        icon={false}
        shadow={false}
        radius={false}
        flatHeader
        title={translate.title}
      >
        <CheckboxListItem
          label={translate.playbackReporting}
          name="playbackReporting"
          value={values.playbackReporting}
          onChange={handleChange}
          hasCorner
        />
        <CheckboxListItem
          label={translate.substitute}
          name="defaultScreen.allowSubstituteImage"
          value={values.defaultScreen.allowSubstituteImage}
          onChange={handleChange}
          hasCorner
        />
        <CheckboxListItem
          label={translate.desktopNotify}
          name="emergencyNotification"
          value={values.emergencyNotification}
          onChange={handleChange}
          hasCorner
        />
        <CheckboxListItem
          label={translate.sleepMode}
          name="sleepMode"
          value={values.sleepMode}
          onChange={handleChange}
        />
      </Card>
      <Card
        icon={false}
        dropdown={false}
        grayHeader={true}
        shadow={false}
        radius={false}
        title={translate.securityTitle}
      >
        <CheckboxListItem
          label={translate.is2faEnabled}
          name="is2faEnabled"
          value={values.is2faEnabled}
          onChange={handleChange}
          hasCorner
        />
        <CheckboxListItem
          label={translate.ssoStatus}
          name="ssoStatus"
          value={values.ssoStatus}
          onChange={handleChange}
          hasCorner
        />
        <CheckboxListItem
          label={translate.autoLogOut}
          name="autoLogOut"
          value={values.autoLogOut}
          onChange={handleChange}
        />
      </Card>
    </>
  )
}

const mapStateToProps = ({
  clients: {
    item: { response: item }
  }
}) => ({
  item
})

export default translate('translations')(
  connect(mapStateToProps, null)(Settings)
)
