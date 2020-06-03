import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getItem, putItem, postItem } from 'actions/clientActions'
import { SideModal } from 'components/Modal'
import BandwidthDetails from './BandwidthDetails'
import Settings from './Settings'
import PremiumFeatures from './PremiumFeatures'
import { getUrlPrefix } from 'utils'
import routeByName from 'constants/routes'
import FooterLayout from 'components/Modal/FooterLayout'
import AdminDetails from './AdminDetails'
import ClientDetails from './ClientDetails'
import {
  ADMIN_DETAILS,
  BANDWIDTH_DETAILS,
  CLIENT_DETAILS,
  PREMIUM_FEATURES,
  SETTINGS
} from 'constants/clientsConstants'
import useUserRole from 'hooks/tableLibrary/useUserRole'
import { Scrollbars } from 'components/Scrollbars'

const styles = ({ palette, type }) => ({
  sideModalHeader: {
    padding: '17px 24px',
    borderBottom: `1px solid ${palette[type].sideModal.content.border}`
  },
  container: {
    height: 'inherit',
    display: 'flex',
    flexDirection: 'row'
  },
  middleContainer: {
    overflow: 'auto',
    flexGrow: 1,
    borderLeft: `1px solid ${palette[type].sideModal.content.border}`
  },
  leftContainer: {
    overflow: 'auto',
    flexGrow: 1
  }
})

const AddEditClient = ({
  t,
  classes,
  getItem,
  putItem,
  postItem,
  history,
  match: {
    params: { id },
    path
  }
}) => {
  const [data, setData] = useState({})
  const role = useUserRole()
  const isEdit = useMemo(
    () => path === getUrlPrefix(routeByName.clients.edit),
    [path]
  )

  const [isStartCollecting, toggleIsCollecting] = useState(false)
  const [doReset, toggleDoReset] = useState(false)
  const [resetProgress, setResetProgress] = useState(
    role.enterprise
      ? {
          [ADMIN_DETAILS]: false,
          [CLIENT_DETAILS]: false
        }
      : {
          [SETTINGS]: false,
          [CLIENT_DETAILS]: false,
          [PREMIUM_FEATURES]: false,
          [ADMIN_DETAILS]: false,
          [BANDWIDTH_DETAILS]: false
        }
  )

  const translate = useMemo(
    () => ({
      title: isEdit ? t('Edit Client') : t('Add New Client')
    }),
    [isEdit, t]
  )

  const handleSubmit = useCallback(() => {
    toggleIsCollecting(true)
  }, [])

  const handleFailCollecting = useCallback(() => {
    toggleIsCollecting(false)
    setData({})
  }, [])

  const handleReset = useCallback(() => {
    toggleDoReset(true)
  }, [])

  const handleAfterReset = useCallback(module => {
    setResetProgress(values => ({ ...values, [module]: true }))
  }, [])

  const handleCollect = useCallback((module, payload) => {
    setData(values => ({ ...values, [module]: payload }))
  }, [])

  useEffect(() => {
    if (role.system) {
      if (
        isEdit &&
        data.hasOwnProperty(CLIENT_DETAILS) &&
        data.hasOwnProperty(SETTINGS) &&
        data.hasOwnProperty(BANDWIDTH_DETAILS) &&
        data.hasOwnProperty(PREMIUM_FEATURES)
      ) {
        putItem(id, {
          ...data[CLIENT_DETAILS],
          ...data[BANDWIDTH_DETAILS],
          ...data[SETTINGS],
          ...data[PREMIUM_FEATURES]
        })
        history.goBack()
      } else if (
        !isEdit &&
        data.hasOwnProperty(CLIENT_DETAILS) &&
        data.hasOwnProperty(SETTINGS) &&
        data.hasOwnProperty(PREMIUM_FEATURES) &&
        data.hasOwnProperty(BANDWIDTH_DETAILS) &&
        data.hasOwnProperty(ADMIN_DETAILS)
      ) {
        postItem({
          ...data[CLIENT_DETAILS],
          ...data[BANDWIDTH_DETAILS],
          ...data[SETTINGS],
          ...data[PREMIUM_FEATURES],
          user: data[ADMIN_DETAILS]
        })
        history.goBack()
      }
    } else {
      if (isEdit && data.hasOwnProperty(CLIENT_DETAILS)) {
        putItem(id, {
          ...data[CLIENT_DETAILS]
        })
        history.goBack()
      } else if (
        !isEdit &&
        data.hasOwnProperty(CLIENT_DETAILS) &&
        data.hasOwnProperty(ADMIN_DETAILS)
      ) {
        postItem({
          ...data[CLIENT_DETAILS],
          user: data[ADMIN_DETAILS]
        })
        history.goBack()
      }
    }
  }, [data, history, id, isEdit, role, postItem, putItem])

  useEffect(() => {
    if (isEdit) getItem(id)

    // eslint-disable-next-line
  }, [getItem])

  useEffect(() => {
    if (!isEdit) {
      if (Object.keys(resetProgress).every(key => resetProgress[key])) {
        toggleDoReset(false)
      }
    } else {
      if (
        Object.keys(resetProgress).every(
          key => resetProgress[key] || key === ADMIN_DETAILS
        )
      ) {
        toggleDoReset(false)
      }
    }
    // eslint-disable-next-line
  }, [resetProgress])

  const renderBandwidthDetails = useMemo(() => {
    if (role.system || (role.enterprise && isEdit)) {
      return (
        <BandwidthDetails
          isEdit={isEdit}
          level={role.role}
          isStartCollecting={isStartCollecting}
          onFailCollecting={handleFailCollecting}
          invokeCollector={handleCollect}
          doReset={doReset}
          afterReset={handleAfterReset}
        />
      )
    }
  }, [
    doReset,
    handleAfterReset,
    handleCollect,
    handleFailCollecting,
    isEdit,
    isStartCollecting,
    role
  ])

  const sideModalWidth = useMemo(() => (!role.system ? '60%' : '99%'), [role])

  return (
    <SideModal
      width={sideModalWidth}
      title={translate.title}
      headerClassName={classes.sideModalHeader}
      closeLink={getUrlPrefix(routeByName.clients.root)}
      footerLayout={
        <FooterLayout
          isPending={isStartCollecting}
          onSubmit={handleSubmit}
          onReset={handleReset}
          isUpdate={isEdit}
        />
      }
    >
      <div className={classes.container}>
        <Scrollbars>
          <ClientDetails
            className={classes.leftContainer}
            isEdit={isEdit}
            isStartCollecting={isStartCollecting}
            onFailCollecting={handleFailCollecting}
            invokeCollector={handleCollect}
            doReset={doReset}
            afterReset={handleAfterReset}
          />
        </Scrollbars>
        <Scrollbars>
          <div className={classes.middleContainer}>
            {renderBandwidthDetails}
            {!isEdit && (
              <AdminDetails
                isStartCollecting={isStartCollecting}
                onFailCollecting={handleFailCollecting}
                invokeCollector={handleCollect}
                doReset={doReset}
                afterReset={handleAfterReset}
              />
            )}
            {!role.enterprise && (
              <Settings
                isEdit={isEdit}
                isStartCollecting={isStartCollecting}
                invokeCollector={handleCollect}
                doReset={doReset}
                afterReset={handleAfterReset}
              />
            )}
          </div>
        </Scrollbars>
        {!role.enterprise && (
          <Scrollbars>
            <PremiumFeatures
              isEdit={isEdit}
              isStartCollecting={isStartCollecting}
              onFailCollecting={handleFailCollecting}
              invokeCollector={handleCollect}
              doReset={doReset}
              afterReset={handleAfterReset}
            />
          </Scrollbars>
        )}
      </div>
    </SideModal>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItem,
      putItem,
      postItem
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(connect(null, mapDispatchToProps)(AddEditClient))
)
