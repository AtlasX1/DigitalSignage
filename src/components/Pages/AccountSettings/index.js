import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { translate } from 'react-i18next'
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withSnackbar } from 'notistack'
import { withStyles, Grid, Button } from '@material-ui/core'

import PageContainer from 'components/PageContainer'
import Profile from '../Profile'
import { WhiteButton } from 'components/Buttons'
import { AccountInfoWithStatus } from 'components/Account'
import ClientDetails from './ClientDetails'
import {
  getUserSettingsAction,
  clearUserSettingsAction
} from 'actions/userActions'
import {
  putClientSettingsAction,
  clearPutClientSettingsInfoAction
} from 'actions/clientSettingsActions'
import { getConfigFeatureClient } from 'actions/configActions'
import TagsDetails from './TagsDetails'
import MapDetails from './MapDetails'
import BandwidthDetails from './BandwidthDetails'
import ClientFeatureDetails from './ClientFeatureDetails'
import SecuritySettingsDetails from './SecuritySettingsDetails'
import SettingsDetails from './SettingsDetails'
import getUrlPrefix from 'utils/permissionUrls'

const styles = theme => {
  const { palette, type } = theme
  return {
    leftSideBar: {
      width: '475px',
      borderRight: `1px solid ${palette[type].pages.accountSettings.content.border}`,
      backgroundColor: palette[type].pages.accountSettings.content.background
    },
    content: {
      width: '610px',
      borderRight: `1px solid ${palette[type].pages.accountSettings.content.border}`,
      backgroundColor: palette[type].pages.accountSettings.content.background
    },
    rightSideBar: {
      width: '513px',
      backgroundColor: palette[type].pages.accountSettings.content.background
    },

    actionIcons: {
      marginRight: '17px'
    },
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pageContainer.header.button.iconColor
    }
  }
}

const AccountSettings = ({
  t,
  classes,
  settings,
  getUserSettingsAction,
  clearUserSettingsAction,
  putReducer,
  enqueueSnackbar,
  closeSnackbar,
  clearPutClientSettingsInfoAction,
  putClientSettingsAction,
  configFeatureClientReducer,
  getConfigFeatureClient
}) => {
  const [loading, setLoading] = useState(true)
  const [clientDetailsEdit, setClientDetailsEdit] = useState(false)
  const [features, setFeatures] = useState([])

  const [data, setData] = useState({
    tag: [],
    type: {},
    name: '',
    city: '',
    state: '',
    status: '',
    phoneNo1: '',
    phoneNo2: '',
    zipCode: '',
    country: '',
    address1: '',
    address2: '',
    userPicture: '',
    defaultScreen: '',
    playbackReporting: '',
    emergencyNotification: '',
    featurePackage: {
      clientFeature: [],
      feature: []
    },
    is2faEnabled: '',
    autoLogoutTime: '',
    unlimitedBandwidth: true,
    bandwidthDetail: {
      used: 0,
      total: 0,
      remaining: 0,
      renewalDate: ''
    }
  })

  useEffect(() => {
    getUserSettingsAction()

    if (!configFeatureClientReducer.response.length) {
      getConfigFeatureClient()
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (configFeatureClientReducer.response.length) {
      setFeatures(configFeatureClientReducer.response)
    }
  }, [configFeatureClientReducer])

  useEffect(() => {
    if (settings.response) {
      setData(
        update(data, {
          $merge: settings.response
        })
      )

      setLoading(false)

      if (clientDetailsEdit) {
        setClientDetailsEdit(false)
      }
    } else if (settings.error) {
      clearUserSettingsAction()
    }
    // eslint-disable-next-line
  }, [settings])

  useEffect(() => {
    if (putReducer.response) {
      getUserSettingsAction()

      showSnackbar(t('Successfully changed'))
      clearPutClientSettingsInfoAction()
    } else if (putReducer.error) {
      showSnackbar(t('Error'))
      clearPutClientSettingsInfoAction()
    }
    // eslint-disable-next-line
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

  const handleChangePlaybackReporting = () => {
    const d = {
      ...data,
      playbackReporting: !data.playbackReporting,
      defaultScreen: {
        ...data.defaultScreen,
        imageSize: data.defaultScreen && `${data.defaultScreen.imageSize}`
      }
    }

    putClientSettingsAction(d)
  }

  const handleChangeEmergencyNotification = () => {
    const d = {
      ...data,
      emergencyNotification: !data.emergencyNotification,
      defaultScreen: {
        ...data.defaultScreen,
        imageSize: data.defaultScreen && `${data.defaultScreen.imageSize}`
      }
    }

    putClientSettingsAction(d)
  }

  const handleDefaultScreenChange = black => {
    const d = {
      ...data,
      defaultScreen: {
        ...data.defaultScreen,
        allowSubstituteImage: !black,
        isDisplayBlackScreen: black,
        imageSize: data.defaultScreen && `${data.defaultScreen.imageSize}`
      }
    }

    putClientSettingsAction(d)
  }

  return (
    <PageContainer
      subHeader={false}
      pageTitle={t('Account Settings page title').toUpperCase()}
      ActionButtonsComponent={
        <WhiteButton className={`hvr-radial-out ${classes.actionIcons}`}>
          <i className={`${classes.iconColor} icon-user-add`} />
          {t('More table action')}
        </WhiteButton>
      }
    >
      <Route
        path={getUrlPrefix('account-settings/profile')}
        component={Profile}
      />

      <Grid container>
        <Grid item className={classes.leftSideBar}>
          <AccountInfoWithStatus
            accountStatus={data.status}
            userName={data.name}
            imgSrc={data.userPicture}
            loading={loading}
          />

          <ClientDetails
            data={data}
            edit={clientDetailsEdit}
            setEdit={setClientDetailsEdit}
            loading={loading}
          />

          <TagsDetails loading={loading} tags={data.tag} />

          <MapDetails loading={loading} />
        </Grid>

        <Grid item className={classes.content}>
          {!data.unlimitedBandwidth && !!data.bandwidthDetail && (
            <BandwidthDetails
              bandwidthDetail={data.bandwidthDetail}
              loading={loading}
            />
          )}

          <SettingsDetails
            playbackReporting={data.playbackReporting}
            defaultScreen={data.defaultScreen}
            emergencyNotification={data.emergencyNotification}
            onChangePlayback={handleChangePlaybackReporting}
            onChangeDefaultScreen={handleDefaultScreenChange}
            onChangeEmergencyNotifications={handleChangeEmergencyNotification}
          />

          <SecuritySettingsDetails
            is2faEnabled={data.is2faEnabled}
            autoLogoutTime={data.autoLogoutTime}
            loading={loading}
          />
        </Grid>

        <Grid item className={classes.rightSideBar}>
          <ClientFeatureDetails
            featurePackage={data.featurePackage}
            availableFeatures={features}
            featuresList={data.feature}
            loading={loading}
          />
        </Grid>
      </Grid>
    </PageContainer>
  )
}

AccountSettings.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ user, clientSettings, config }) => ({
  settings: user.settings,
  putReducer: clientSettings.put,
  configFeatureClientReducer: config.configFeatureClient
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserSettingsAction,
      clearUserSettingsAction,
      putClientSettingsAction,
      clearPutClientSettingsInfoAction,
      getConfigFeatureClient
    },
    dispatch
  )

export default translate('translations')(
  withSnackbar(
    withStyles(styles)(
      connect(mapStateToProps, mapDispatchToProps)(AccountSettings)
    )
  )
)
