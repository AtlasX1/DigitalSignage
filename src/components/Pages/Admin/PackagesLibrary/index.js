import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withStyles } from '@material-ui/core'
import { withSnackbar } from 'notistack'

import {
  WhiteButton,
  TabToggleButtonGroup,
  TabToggleButton
} from 'components/Buttons'
import PageContainer from 'components/PageContainer'
import { columns } from './config'
import Filter from './Filter'
import AddEditPackage from './AddEditPackage'
import {
  packageActions,
  getGroupsActionsWithBindActionCreators
} from './config'
import { notificationAnalyzer } from 'utils'
import {
  CLIENT_PACKAGE,
  DEVICE_PACKAGE,
  BANDWIDTH_PACKAGE
} from 'constants/packageConstants'
import BaseTable from 'components/TableLibrary/BaseTable'
import ClientPackageRow from './ClientPackageRow'
import DevicePackageRow from './DevicePackageRow'
import BandwidthPackageRow from './BandwidthPackageRow'
import PageTitle from 'components/PageContainer/PageTitle'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'

const styles = theme => {
  const { palette, type } = theme
  return {
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

const PackagesLibrary = ({
  t,
  classes,
  data,
  enqueueSnackbar,
  getConfigFeatureClient,
  getConfigFeatureDevice,
  ...rest
}) => {
  const [selectedTab, setSelectedTab] = useState(CLIENT_PACKAGE)

  const {
    items: { response: items, meta }
  } = useMemo(() => {
    return data[selectedTab]
  }, [data, selectedTab])

  const rowsIds = useMemo(() => items.map(({ id }) => id), [items])

  const selectedList = useSelectedList(rowsIds)

  const translate = useMemo(
    () => ({
      title: t('Package library'),
      clientPackage: t('Featured Packages Tab'),
      devicePackage: t('Device Packages Tab'),
      bwPackage: t('BW Packages Tab'),
      add: t('Add Package table action')
    }),
    [t]
  )

  const [post, setPost] = useState({})
  const [put, setPut] = useState({})
  const [del, setDel] = useState({})

  const groupsActions = useMemo(() => {
    return {
      ...getGroupsActionsWithBindActionCreators.call(rest)
    }
    //eslint-disable-next-line
  }, [])

  const groupActions = useMemo(() => {
    return groupsActions[selectedTab]
  }, [selectedTab, groupsActions])

  useEffect(() => {
    setPost(data[selectedTab].post)
    setPut(data[selectedTab].put)
    setDel(data[selectedTab].del)
  }, [data, selectedTab])

  useEffect(() => {
    const { currentPage, perPage } = meta
    const { clearResponseInfo, getItems } = groupActions

    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'Package'
    )

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: currentPage,
        limit: perPage
      })
    }
    // eslint-disable-next-line
  }, [post, put, del])

  useEffect(() => {
    getConfigFeatureClient()
    getConfigFeatureDevice()
    groupActions.getItems({
      page: 1
    })
  }, [getConfigFeatureDevice, getConfigFeatureClient, groupActions])

  const handleChangeTab = useCallback(
    (event, value) => {
      if (value) {
        setSelectedTab(value)
        selectedList.clear()
      }
    },
    [selectedList]
  )

  const renderRows = useMemo(() => {
    switch (selectedTab) {
      case CLIENT_PACKAGE: {
        return items.map(row => (
          <ClientPackageRow
            key={`client-package-row-${row.id}`}
            row={row}
            deleteItem={groupActions.deleteItem}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            selected={selectedList.isSelect(row.id)}
          />
        ))
      }
      case DEVICE_PACKAGE: {
        return items.map(row => (
          <DevicePackageRow
            key={`device-package-row-${row.id}`}
            row={row}
            deleteItem={groupActions.deleteItem}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            selected={selectedList.isSelect(row.id)}
          />
        ))
      }
      case BANDWIDTH_PACKAGE: {
        return items.map(row => (
          <BandwidthPackageRow
            key={`bandwidth-package-row-${row.id}`}
            row={row}
            deleteItem={groupActions.deleteItem}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
            selected={selectedList.isSelect(row.id)}
          />
        ))
      }
      default:
        return null
    }
  }, [groupActions.deleteItem, items, selectedList, selectedTab])

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      MiddleActionComponent={
        <TabToggleButtonGroup
          value={selectedTab}
          exclusive
          onChange={handleChangeTab}
        >
          <TabToggleButton value={CLIENT_PACKAGE}>
            {translate.clientPackage}
          </TabToggleButton>
          <TabToggleButton value={BANDWIDTH_PACKAGE}>
            {translate.bwPackage}
          </TabToggleButton>
          <TabToggleButton value={DEVICE_PACKAGE}>
            {translate.devicePackage}
          </TabToggleButton>
        </TabToggleButtonGroup>
      }
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={`/system/packages-library/${selectedTab}/add`}
          >
            <i className={`${classes.iconColor} icon-user-add`} />
            {translate.add}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={
        <Filter fetcher={groupActions.getItems} meta={meta} />
      }
    >
      <BaseTable
        fetcher={groupActions.getItems}
        meta={meta}
        columns={columns[selectedTab]}
        selectedList={selectedList}
        deleteSelectedItems={groupActions.deleteSelectedItems}
        placeholderMessage="No saved packages"
      >
        {renderRows}
      </BaseTable>
      <Route
        path="/system/packages-library/:variant/add"
        component={AddEditPackage}
      />
      <Route
        path="/system/packages-library/:variant/:id/edit"
        component={AddEditPackage}
      />
    </PageContainer>
  )
}

PackagesLibrary.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({
  clientPackage,
  devicePackage,
  bandwidthPackage
}) => ({
  data: {
    clientPackage,
    devicePackage,
    bandwidthPackage
  }
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...packageActions
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(PackagesLibrary))
  )
)
