import React, { useCallback, useEffect, useMemo } from 'react'
import { Link, Route } from 'react-router-dom'
import { translate } from 'react-i18next'
import { withSnackbar } from 'notistack'
import { Grid, withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'
import PageContainer from 'components/PageContainer'
import BaseTable from 'components/TableLibrary/BaseTable'
import PageTitle from 'components/PageContainer/PageTitle'
import { getGroupsByEntity } from 'actions/groupActions'
import { getConfigFeatureClient } from 'actions/configActions'
import { getUrlPrefix, notificationAnalyzer } from 'utils'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import usePreference from 'hooks/tableLibrary/usePreference'
import entityConstants from 'constants/entityConstants'
import routeByName from 'constants/routes'
import GroupModal from 'components/Group'
import { dndConstants } from 'constants/index'
import entityGroupsConstants from 'constants/entityGroupsConstants'
import Filter from './Filter'
import AddEditClient from './AddEditClient'
import SuperAdminSettings from './SuperAdminSettings'
import TableRow from './TableRow'
import ClientGroupItem from 'components/Pages/Admin/ClientsLibrary/ClientGroupItem'
import NoteDialog from 'components/Modal/NoteDialog'

import useUserRole from 'hooks/tableLibrary/useUserRole'
import {
  clearClientGroupItemsInfo,
  clearGetClientNoteInfo,
  clearPostClientNoteInfo,
  clearResponseInfo,
  deleteClientGroupItem,
  getClientGroupItems,
  getClientNotes,
  getItems,
  postClientGroupItem,
  postClientNote,
  clearGetClientsGroupItemsInfo
} from 'actions/clientActions'
import { sortByName } from 'utils/libraryUtils'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: '17px'
  },
  iconColor: {
    marginRight: '9px',
    fontSize: '14px',
    color: palette[type].pageContainer.header.button.iconColor
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
  }
})

const initialColumns = [
  { id: 'id', label: 'ID', align: 'center', display: true },
  { id: 'name', label: 'Name', display: true },
  { id: 'packageName', label: 'Package', display: true },
  { id: 'createdOn', label: 'Created On', align: 'center', display: true },
  { id: 'devices', label: 'Devices', align: 'center', display: true },
  { id: 'users', label: 'Users', align: 'center', display: true },
  { id: 'type', label: 'Type', align: 'center', display: true }
]

const ClientsLibrary = ({
  t,
  post,
  put,
  del,
  items,
  meta,
  classes,
  getItems,
  enqueueSnackbar,
  clearResponseInfo,
  getConfigFeatureClient,
  match: { path },
  groupItems,
  postGroupItem,
  deleteGroupItem,
  getClientGroupItems,
  postClientGroupItem,
  deleteClientGroupItem,
  clearClientGroupItemsInfo,
  clientNotes,
  postNoteReducer,
  getClientNotes,
  postClientNote,
  clearGetClientNoteInfo,
  clearPostClientNoteInfo,
  clearGetClientsGroupItemsInfo
}) => {
  const role = useUserRole()

  const translate = useMemo(
    () => ({
      title: t('Clients page title'),
      groups: t('Groups'),
      add: t('Add Clients'),
      showInactive: t('Show Inactive Users'),
      placeholder: t('No saved users'),
      teamviewer: t('Show Teamviewer Status'),
      more: t('More table action'),
      setAlerts: t('Set Alerts table action')
    }),
    [t]
  )

  const rowsIds = useMemo(() => items.map(({ id }) => id), [items])

  const selectedList = useSelectedList(rowsIds)

  const preference = usePreference({
    initialColumns,
    fetcher: getItems,
    entity: entityConstants.ClientLibrary,
    initialPerPage: meta.perPage
  })

  useEffect(() => {
    getConfigFeatureClient()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'Client'
    )

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: 1,
        limit: meta.perPage
      })
    }
    // eslint-disable-next-line
  }, [post, put, del])

  const handleMoveItem = useCallback(
    (clientId, groupId) => {
      postClientGroupItem({ clientId, groupId })
    },
    [postClientGroupItem]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deleteClientGroupItem({ clientId: itemId, groupId })
    },
    [deleteClientGroupItem]
  )

  const groupClients = useMemo(
    () =>
      sortByName(items).map(item => (
        <ClientGroupItem key={item.id} item={item} />
      )),
    [items]
  )

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={getUrlPrefix(routeByName.clients.groups)}
          >
            <i
              className={`${classes.iconColor} icon-navigation-show-more-vertical`}
            />
            {translate.groups}
          </WhiteButton>
          <WhiteButton className={`hvr-radial-out ${classes.actionIcons}`}>
            <i
              className={`${classes.iconColor} icon-navigation-show-more-vertical`}
            />
            {translate.more}
          </WhiteButton>
          <WhiteButton className={`hvr-radial-out ${classes.actionIcons}`}>
            <i className={`${classes.iconColor} icon-interface-alert-circle`} />
            {translate.setAlerts}
          </WhiteButton>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={getUrlPrefix(routeByName.clients.add)}
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {translate.add}
          </WhiteButton>
        </>
      }
      SubHeaderLeftActionComponent={
        <CheckboxSwitcher label={translate.teamviewer} />
      }
      SubHeaderMenuComponent={
        <Filter fetcher={getItems} perPage={meta.perPage} />
      }
    >
      <BaseTable
        meta={meta}
        fetcher={getItems}
        columns={preference.columns}
        preferenceActions={preference.actions}
        selectedList={selectedList}
        placeholderMessage={translate.placeholder}
      >
        {items.map(row => (
          <TableRow
            key={`client-row-${row.id}`}
            row={row}
            role={role}
            preference={preference.columns}
            selected={selectedList.isSelect(row.id)}
            onToggleSelect={selectedList.toggle}
            onUnselect={selectedList.unselect}
          />
        ))}
      </BaseTable>
      <Route
        path={getUrlPrefix(routeByName.clients.add)}
        component={AddEditClient}
      />
      <Route
        path={getUrlPrefix(routeByName.clients.edit)}
        component={AddEditClient}
      />
      <Route
        path={getUrlPrefix(routeByName.clients.groups)}
        render={props => (
          <GroupModal
            {...props}
            title={t('Client Groups')}
            closeLink={getUrlPrefix(routeByName.clients.root)}
            entity={entityGroupsConstants.Client}
            groupItemsTitle={t('Clients')}
            dropItemType={dndConstants.clientItemTypes.CLIENT_ITEM}
            onMoveItem={handleMoveItem}
            itemsLoading={meta.isLoading}
            groupItemsReducer={groupItems}
            postGroupItemReducer={postGroupItem}
            deleteGroupItemReducer={deleteGroupItem}
            clearGroupItemsInfo={clearClientGroupItemsInfo}
            itemsPopupProps={{
              getGroupItems: id =>
                getClientGroupItems(id, {
                  order: 'asc',
                  sort: 'name',
                  fields: 'id,name'
                }),
              onDeleteItem: handleDeleteGroupItem,
              clearGroupItemsInfo: clearGetClientsGroupItemsInfo
            }}
          >
            <Grid container>{groupClients}</Grid>
          </GroupModal>
        )}
      />
      <Route
        path="/system/clients-library/:id/super-admin-settings"
        component={SuperAdminSettings}
      />
      <Route
        path="/system/clients-library/:id/white-label-super-admin-settings"
        component={SuperAdminSettings}
      />
      <Route
        path={getUrlPrefix(routeByName.clients.notes())}
        render={props => (
          <NoteDialog
            {...props}
            closeLink={path}
            dialogTitle={t('Client Notes')}
            noteData={!!clientNotes.response && clientNotes.response.note}
            postNoteReducer={postNoteReducer}
            getNotesAction={getClientNotes}
            postNoteAction={postClientNote}
            clearGetNoteInfo={clearGetClientNoteInfo}
            clearPostNoteInfo={clearPostClientNoteInfo}
          />
        )}
      />
    </PageContainer>
  )
}

const mapStateToProps = ({
  clients: {
    items: { response: items, meta },
    post,
    put,
    del,
    groupItems,
    postGroupItem,
    deleteGroupItem,
    note,
    postNote
  }
}) => ({
  meta,
  put,
  del,
  post,
  items,
  groupItems,
  postGroupItem,
  deleteGroupItem,
  clientNotes: note,
  postNoteReducer: postNote
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      getGroupsByEntity,
      clearResponseInfo,
      getConfigFeatureClient,
      getClientGroupItems,
      postClientGroupItem,
      deleteClientGroupItem,
      clearClientGroupItemsInfo,
      getClientNotes,
      postClientNote,
      clearGetClientNoteInfo,
      clearPostClientNoteInfo,
      clearGetClientsGroupItemsInfo
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(ClientsLibrary))
  )
)
