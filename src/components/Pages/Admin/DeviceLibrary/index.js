import React, {
  Fragment,
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link, Route, Redirect } from 'react-router-dom'
import update from 'immutability-helper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withStyles, Typography, Grid } from '@material-ui/core'
import { GridOn, List } from '@material-ui/icons'
import { isEmpty } from 'lodash'

import PageContainer from 'components/PageContainer'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { WhiteButton, CircleIconButton } from 'components/Buttons'
import DeviceTableView from './DeviceTable'
import DeviceGridView from './DeviceGrid'
import DeviceSearchForm from './DeviceSearch'
import SetAlerts from './SetAlerts'
import ScreenPreviews from './ScreenPreviews'
import ChannelPreviews from './ChannelPreviews'
import AddEditDevice from './AddEditDevice'
import NoteDialog from './NoteDialog'
import GroupModal from 'components/Group'
import DeviceItem from './DeviceItem'
import RemoveAlertsConfirm from './RemoveAlertsConfirm'

import {
  dndConstants,
  entityGroupsConstants,
  routeByName
} from 'constants/index'
import { libraryUtils, getUrlPrefix } from 'utils'
import {
  getDeviceGroupsAction,
  postDeviceGroupItemAction,
  clearPostDeviceGroupItemInfoAction,
  getDeviceGroupItemsAction,
  clearGetDeviceGroupItemsInfoAction,
  deleteDeviceGroupItemAction,
  clearDeleteDeviceGroupItemInfoAction,
  clearDeviceGroupItemsInfo
} from 'actions/deviceActions'
import {
  postGroupAction,
  clearPostGroupInfoAction,
  deleteGroupAction,
  clearDeleteGroupInfoAction,
  putGroupAction,
  clearPutGroupInfoAction
} from 'actions/groupActions'
import {
  disableAlertAction,
  clearDisableAlertInfoAction
} from 'actions/alertActions'
import { getAlertTypesAction } from 'actions/configActions'
import useUserRole from 'hooks/tableLibrary/useUserRole'

const styles = theme => {
  const { palette, type } = theme
  return {
    actionIcons: {
      marginRight: '17px'
    },
    actionAccentIcons: {
      marginRight: '17px',
      '&:before': {
        backgroundColor: '#ff3d84'
      },
      '&:hover': {
        borderColor: '#ff3d84'
      }
    },
    iconColor: {
      marginRight: '9px',
      fontSize: '14px',
      color: palette[type].pageContainer.header.button.iconColor
    },
    iconAccent: {
      color: '#ff3d84'
    },
    circleButton: {
      color: '#afb7c7',

      '&:hover': {
        color: '#1c5dca'
      }
    },
    selectTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    },
    selectSubTitle: {
      fontSize: '15px',
      fontWeight: 'bold',
      color: palette[type].pageContainer.header.titleColor
    },
    devicesList: {
      paddingLeft: '25px'
    }
  }
}

const initialFormValues = {
  name: null,
  city: '',
  clientName: '',
  status: '',
  group: '',
  tag: []
}

const DeviceLibrary = ({
  t,
  library,
  classes,
  alertTypes,
  location: { search },
  postDeviceGroupItemAction,
  postGroupItemReducer,
  getDeviceGroupItemsAction,
  deleteDeviceGroupItemAction,
  groupItemsReducer,
  deleteGroupItemReducer,
  clearDeviceGroupItemsInfo,
  clearGetDeviceGroupItemsInfoAction,
  disableAlertAction,
  clearDisableAlertInfoAction,
  disableAlertReducer,
  getAlertTypesAction,
  modalHeight
}) => {
  const role = useUserRole()
  const [deleteAllAlertsDialog, setDeleteAllAlertsDialog] = useState(false)
  const searchParams = useMemo(() => {
    const paramsObj = {}
    const urlParams = new URLSearchParams(search)
    urlParams.forEach((value, key) => {
      paramsObj[key] = value
    })
    return paramsObj
  }, [search])

  const [selected, setSelected] = useState(0)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterParams, setFilterParams] = useState({
    ...initialFormValues,
    ...searchParams
  })

  useEffect(() => {
    if (isEmpty(alertTypes)) {
      getAlertTypesAction()
    }
  }, [alertTypes, getAlertTypesAction])

  useEffect(() => {
    if (library.response) {
      setDevices(library.response)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [library])

  const handleResetSearchForm = useCallback(() => {
    setFilterParams(initialFormValues)
  }, [])

  const handleSubmitSearchForm = useCallback(formValues => {
    setFilterParams(formValues)
  }, [])

  const handleChangeSelectionItems = useCallback(value => {
    setSelected(value)
  }, [])

  const handleMoveItem = useCallback(
    (deviceId, groupId) => {
      postDeviceGroupItemAction({ deviceId, groupId })
    },
    [postDeviceGroupItemAction]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deleteDeviceGroupItemAction({ deviceId: itemId, groupId })
    },
    [deleteDeviceGroupItemAction]
  )

  const transformedFilterParams = useMemo(
    () =>
      update(filterParams, {
        name: {
          $set: filterParams.name ? filterParams.name.value : ''
        },
        tag: {
          $set: Array.isArray(filterParams.tag)
            ? filterParams.tag.map(({ value }) => value).join(',')
            : ''
        }
      }),
    [filterParams]
  )

  return (
    <div style={{ height: modalHeight }}>
      <PageContainer
        pageTitle={t('Device page title')}
        PageTitleComponent={
          selected > 0 && (
            <div
              key="selectTitle"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Typography component="h2" className={classes.selectTitle}>
                {`${t('Device page title')} |`}
              </Typography>
              {'\u00A0'}
              <Typography
                component="h3"
                variant="subtitle1"
                className={classes.selectSubTitle}
              >
                {`${selected} ${t('selected')}`}
              </Typography>
            </div>
          )
        }
        ActionButtonsComponent={
          <Fragment>
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={getUrlPrefix(routeByName.device.groups)}
            >
              <i className={`${classes.iconColor} icon-network-computer-1`} />
              {t('Groups')}
            </WhiteButton>
            {role.org && (
              <WhiteButton
                className={`hvr-radial-out ${classes.actionAccentIcons}`}
                component={Link}
                to={getUrlPrefix(
                  routeByName.device.alerts.getByName('hurricane')
                )}
              >
                <i
                  className={`${classes.iconColor} ${classes.iconAccent} icon-interface-alert-circle`}
                />
                {t('Set Alerts table action')}
              </WhiteButton>
            )}
            {role.org && (
              <WhiteButton
                className={`hvr-radial-out ${classes.actionAccentIcons}`}
                onClick={() => setDeleteAllAlertsDialog(true)}
              >
                <i
                  className={`${classes.iconColor} ${classes.iconAccent} icon-bin`}
                />
                {t('Remove all alerts')}
              </WhiteButton>
            )}
            {role.system && (
              <WhiteButton
                className={`hvr-radial-out ${classes.actionIcons}`}
                component={Link}
                to={getUrlPrefix(routeByName.device.add)}
              >
                <i className={`${classes.iconColor} icon-folder-video`} />
                {t('Add Device table action')}
              </WhiteButton>
            )}
          </Fragment>
        }
        SubHeaderLeftActionComponent={
          role.system ? (
            <CheckboxSwitcher label={t('Show Teamviewer Status')} />
          ) : null
        }
        SubHeaderMenuComponent={
          <DeviceSearchForm
            initialValues={filterParams}
            onSubmit={handleSubmitSearchForm}
            onReset={handleResetSearchForm}
          />
        }
        SubHeaderRightActionComponent={
          <Fragment>
            <CircleIconButton
              className={`hvr-grow ${classes.circleButton}`}
              component={Link}
              to={getUrlPrefix(routeByName.device.grid)}
            >
              <GridOn />
            </CircleIconButton>
            <CircleIconButton
              className={`hvr-grow ${classes.circleButton}`}
              component={Link}
              to={getUrlPrefix(routeByName.device.list)}
            >
              <List />
            </CircleIconButton>
          </Fragment>
        }
      >
        <Route
          exact
          path={getUrlPrefix(routeByName.device.root)}
          render={() => <Redirect to={getUrlPrefix(routeByName.device.list)} />}
        />
        <Route
          path={getUrlPrefix(routeByName.device.list)}
          render={props => (
            <DeviceTableView
              {...props}
              onChangeSelection={handleChangeSelectionItems}
              filterParams={transformedFilterParams}
            />
          )}
        />
        <Route
          path={getUrlPrefix(routeByName.device.edit)}
          render={props => <AddEditDevice backTo="list" {...props} />}
        />
        <Route
          path={getUrlPrefix(routeByName.device.editGrid)}
          render={props => <AddEditDevice backTo="grid" {...props} />}
        />
        <Route
          path={getUrlPrefix(routeByName.device.note)}
          component={NoteDialog}
        />
        <Route
          path={getUrlPrefix(routeByName.device.alerts.set)}
          component={SetAlerts}
        />
        <Route
          path={getUrlPrefix(routeByName.device.add)}
          component={AddEditDevice}
        />
        <Route
          path={getUrlPrefix(routeByName.device.grid)}
          render={props => (
            <DeviceGridView {...props} filterParams={transformedFilterParams} />
          )}
        />
        <Route
          path={getUrlPrefix(routeByName.device.screenPreview)}
          component={ScreenPreviews}
        />
        <Route
          path={getUrlPrefix(routeByName.device.channelsPreview)}
          component={ChannelPreviews}
        />
        <Route
          path={getUrlPrefix(routeByName.device.groups)}
          render={props => (
            <GroupModal
              {...props}
              title={t('Device Groups')}
              closeLink={getUrlPrefix(routeByName.device.grid)}
              entity={entityGroupsConstants.Device}
              groupItemsTitle={t('Devices')}
              dropItemType={dndConstants.deviceGroupsItemTypes.DEVICE_ITEM}
              onMoveItem={handleMoveItem}
              itemsLoading={loading}
              groupItemsReducer={groupItemsReducer}
              postGroupItemReducer={postGroupItemReducer}
              deleteGroupItemReducer={deleteGroupItemReducer}
              displayOverflow={true}
              clearGroupItemsInfo={clearDeviceGroupItemsInfo}
              itemsPopupProps={{
                getGroupItems: id =>
                  getDeviceGroupItemsAction(id, {
                    order: 'asc',
                    sort: 'name',
                    fields: 'id,name'
                  }),
                onDeleteItem: handleDeleteGroupItem,
                clearGroupItemsInfo: clearGetDeviceGroupItemsInfoAction
              }}
            >
              <Grid container className={classes.devicesList}>
                {libraryUtils.sortByName(devices).map((device, index) => (
                  <DeviceItem key={`device-${index}`} device={device} />
                ))}
              </Grid>
            </GroupModal>
          )}
        />

        <RemoveAlertsConfirm
          open={deleteAllAlertsDialog}
          handleClose={() => setDeleteAllAlertsDialog(false)}
          title={t('Are you sure you want to remove all alerts?')}
          handleClick={disableAlertAction}
          clearAction={clearDisableAlertInfoAction}
          reducer={disableAlertReducer}
        />
      </PageContainer>
    </div>
  )
}

DeviceLibrary.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string
  }).isRequired
}

const mapStateToProps = ({
  device,
  user,
  group,
  alert,
  config,
  appReducer
}) => ({
  library: device.library,
  meta: device.meta,
  groupsReducer: device.groups,
  postGroupReducer: group.post,
  deleteGroupReducer: group.del,
  putGroupReducer: group.put,
  postGroupItemReducer: device.postGroupItem,
  groupItemsReducer: device.groupItems,
  deleteGroupItemReducer: device.deleteGroupItem,
  disableAlertReducer: alert.disableAlert,
  alertTypes: config.alertTypes.response,
  modalHeight: appReducer.height
})
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getDeviceGroupsAction,
      postGroupAction,
      clearPostGroupInfoAction,
      deleteGroupAction,
      clearDeleteGroupInfoAction,
      putGroupAction,
      clearPutGroupInfoAction,
      postDeviceGroupItemAction,
      clearPostDeviceGroupItemInfoAction,
      getDeviceGroupItemsAction,
      clearGetDeviceGroupItemsInfoAction,
      deleteDeviceGroupItemAction,
      clearDeleteDeviceGroupItemInfoAction,
      clearDeviceGroupItemsInfo,
      disableAlertAction,
      clearDisableAlertInfoAction,
      getAlertTypesAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(DeviceLibrary)
  )
)
