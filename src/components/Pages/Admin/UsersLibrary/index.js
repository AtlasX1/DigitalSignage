import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withSnackbar } from 'notistack'
import update from 'immutability-helper'

import { WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'
import PageContainer from 'components/PageContainer'
import AddEditUser from './AddEditUser'
import Filter from './Filter'
import UserPermissions from './UserPermissions'
import TableRow from './TableRow'
import BaseTable from 'components/TableLibrary/BaseTable'
import PageTitle from 'components/PageContainer/PageTitle'
import GroupModal from 'components/Group'

import routeByName from 'constants/routes'
import { userRoleLevels } from 'constants/api'
import entityConstants from 'constants/entityConstants'
import {
  apiConstants,
  dndConstants,
  entityGroupsConstants
} from 'constants/index'

import {
  getUrlPrefix,
  notificationAnalyzer,
  setToken,
  queryParamsHelper
} from 'utils'
import saveOriginalToken from 'utils/saveOriginalToken'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import usePreference from 'hooks/tableLibrary/usePreference'
import useUserRole from 'hooks/tableLibrary/useUserRole'
import { useCustomSnackbar } from 'hooks'
import {
  getConfigEnterpriseRole,
  getConfigOrgRole,
  getConfigSystemRole
} from 'actions/configActions'
import {
  getUsersPermission,
  putUsersPermission,
  getUsersGroupPermission,
  putUsersGroupPermission,
  clearResponseInfo,
  deleteSelectedItems,
  getItems,
  clearGetUsersPermissionInfo,
  clearGetUsersGroupsPermissionInfo,
  getUsersGroupItems,
  clearGetUsersGroupItemsInfo,
  clearUsersGroupItemsInfo,
  postUsersGroupItem,
  deleteUsersGroupItem,
  getUngroupedUsers
} from 'actions/usersActions'
import { impersonateUserAction } from 'actions/authenticationActions'
import UserItem from 'components/Pages/Admin/UsersLibrary/UserItem'
import EmailLink from 'components/EmailLink'
import { sortByFullName } from 'utils/libraryUtils'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: 17
  },
  iconColor: {
    marginRight: 9,
    fontSize: 14,
    color: palette[type].pageContainer.header.button.iconColor
  },
  ungroupedUsersContainer: {
    display: 'table',
    width: '100%',
    borderSpacing: 0,
    borderCollapse: 'collapse'
  }
})

const clientColumn = [
  {
    id: 'client',
    label: 'Client',
    display: true
  }
]

const initialOrgColumns = [
  { id: 'firstName', label: 'Name', display: true },
  { id: 'email', label: 'Email', display: true },
  { id: 'role', label: 'Role', display: true },
  { id: 'phone', label: 'Phone', align: 'center', display: true },
  { id: 'lastLogin', label: 'Last Login', align: 'center', display: true },
  { id: 'status', label: 'Status', align: 'center', display: true }
]

const intialFilter = {
  lastName: '',
  firstName: '',
  email: '',
  roleId: '',
  client: '',
  group: '',
  tag: []
}

const initialColumns = [...initialOrgColumns, ...clientColumn]

const UsersLibrary = ({
  t,
  put,
  del,
  post,
  meta,
  items,
  classes,
  getItems,
  enqueueSnackbar,
  clearResponseInfo,
  location: { search },
  deleteSelectedItems = f => f,
  getConfigOrgRole,
  getConfigSystemRole,
  getConfigEnterpriseRole,
  impersonateUserAction,
  impersonateReducer,
  closeSnackbar,
  getUsersGroupItems,
  clearGetUsersGroupItemsInfo,
  clearUsersGroupItemsInfo,
  postUsersGroupItem,
  deleteUsersGroupItem,
  postGroupItemReducer,
  groupItemsReducer,
  deleteGroupItemReducer,
  ungroupedUsers,
  getUngroupedUsers
}) => {
  const [showInactive, toggleShowInactive] = useState(false)
  const searchParams = useMemo(() => {
    const paramsObj = {}
    const urlParams = new URLSearchParams(search)
    urlParams.forEach((value, key) => {
      paramsObj[key] = value
    })
    return paramsObj
  }, [search])

  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const role = useUserRole()
  const [cols, setCols] = useState(initialColumns)
  const [queryParams, setQueryParams] = useState({
    ...intialFilter,
    ...searchParams
  })

  const onLevelChange = useCallback(() => {
    setCols(role.org ? initialOrgColumns : initialColumns)
  }, [setCols, role])

  useEffect(onLevelChange, [onLevelChange])

  const preference = usePreference(
    {
      initialColumns: cols,
      fetcher: getItems,
      entity: entityConstants.UserLibrary,
      initialPerPage: meta.perPage
    },
    cols
  )

  const translate = useMemo(
    () => ({
      title: t('Users page title'),
      groups: t('Groups'),
      add: t('Add User table action'),
      showInactive: t('Show Inactive Users')
    }),
    [t]
  )

  const rowsIds = useMemo(() => items.map(({ id }) => id), [items])

  const selectedList = useSelectedList(rowsIds)

  useEffect(() => {
    switch (role.role) {
      case userRoleLevels.system:
        getConfigSystemRole()
        break
      case userRoleLevels.enterprise:
        getConfigEnterpriseRole()
        break
      case userRoleLevels.org:
        getConfigOrgRole()
        break
      default:
        break
    }
  }, [getConfigEnterpriseRole, getConfigOrgRole, getConfigSystemRole, role])

  useEffect(() => {
    const successfulPost = update(post, {
      error: {
        $set: []
      }
    })
    const successfulPut = update(put, {
      error: {
        $set: []
      }
    })
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [successfulPost, successfulPut, del], // Suppress errors from post and put requests
      'User'
    )

    if (wasNotify) {
      clearResponseInfo()
      getItems({
        page: 1,
        limit: preference.perPage
      })
    }
    // eslint-disable-next-line
  }, [post, put, del])

  useEffect(() => {
    if (impersonateReducer.response) {
      const { accessToken, tokenType, expiresIn } = impersonateReducer.response
      saveOriginalToken()
      setToken(
        apiConstants.ORG_USER_TOKEN_NAME,
        tokenType,
        accessToken,
        expiresIn
      )
      window.location.reload()
    } else if (impersonateReducer.error) {
      if (impersonateReducer.error.message) {
        showSnackbar(impersonateReducer.error.message)
      }
    }
    // eslint-disable-next-line
  }, [impersonateReducer])

  const getTableItems = tableParams => {
    const params = update(queryParams, {
      tag: {
        $set: queryParams.tag.map(({ value }) => value).join(',')
      }
    })
    getItems({
      ...queryParamsHelper(params),
      ...tableParams
    })
  }

  const onFilterSubmit = values => {
    setQueryParams(values)
    const params = update(values, {
      tag: {
        $set: values.tag.map(({ value }) => value).join(',')
      }
    })
    getItems(
      queryParamsHelper({
        ...params,
        limit: preference.perPage
      })
    )
  }

  const onFilterReset = () => {
    setQueryParams(intialFilter)
    getItems({
      limit: preference.perPage
    })
  }

  const handleImpersonateUser = useCallback(
    id => {
      impersonateUserAction(id)
    },
    [impersonateUserAction]
  )

  const handleMoveItem = useCallback(
    (userId, groupId) => {
      postUsersGroupItem({ userId, groupId })
    },
    [postUsersGroupItem]
  )

  const handleDeleteGroupItem = useCallback(
    ({ groupId, itemId }) => {
      deleteUsersGroupItem({ userId: itemId, groupId })
    },
    [deleteUsersGroupItem]
  )

  useEffect(() => {
    getUngroupedUsers()
  }, [getUngroupedUsers])

  useEffect(() => {
    if (postGroupItemReducer.response || deleteGroupItemReducer.response) {
      getUngroupedUsers()
    }
  }, [postGroupItemReducer, deleteGroupItemReducer, getUngroupedUsers])

  const ungroupedUsersList = useMemo(
    () =>
      sortByFullName(ungroupedUsers).map(user => (
        <UserItem key={user.id} user={user} />
      )),
    [ungroupedUsers]
  )

  return (
    <PageContainer
      pageTitle={translate.title}
      PageTitleComponent={
        <PageTitle selectedCount={selectedList.count} title={translate.title} />
      }
      ActionButtonsComponent={
        <>
          {role.org ? (
            <WhiteButton
              className={`hvr-radial-out ${classes.actionIcons}`}
              component={Link}
              to={getUrlPrefix(routeByName.users.groups)}
            >
              <i
                className={`${classes.iconColor} icon-navigation-show-more-vertical`}
              />
              {translate.groups}
            </WhiteButton>
          ) : null}

          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to={getUrlPrefix(routeByName.users.add)}
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {translate.add}
          </WhiteButton>
        </>
      }
      SubHeaderLeftActionComponent={
        <CheckboxSwitcher
          value={showInactive}
          handleChange={() => toggleShowInactive(!showInactive)}
          label={translate.showInactive}
        />
      }
      SubHeaderMenuComponent={
        <Filter
          queryParams={queryParams}
          onSubmit={onFilterSubmit}
          onReset={onFilterReset}
        />
      }
    >
      <BaseTable
        meta={meta}
        fetcher={getTableItems}
        columns={preference.columns}
        preferenceActions={preference.actions}
        noType={false}
        deleteSelectedItems={deleteSelectedItems}
        selectedList={selectedList}
        placeholderMessage="No saved users"
      >
        {items.map(row =>
          row.status === 'Active' ? (
            <TableRow
              row={row}
              variant={role.role}
              columns={preference.columns}
              selected={selectedList.isSelect(row.id)}
              onToggleSelect={selectedList.toggle}
              onUnselect={selectedList.unselect}
              key={`user-row-${row.id}`}
              onImpersonate={handleImpersonateUser}
            />
          ) : (
            row.status === 'Inactive' &&
            showInactive && (
              <TableRow
                row={row}
                variant={role.role}
                columns={preference.columns}
                selected={selectedList.isSelect(row.id)}
                onToggleSelect={selectedList.toggle}
                onUnselect={selectedList.unselect}
                key={`user-row-${row.id}`}
                onImpersonate={handleImpersonateUser}
              />
            )
          )
        )}
      </BaseTable>

      <Route
        path={getUrlPrefix(routeByName.users.groups)}
        render={props => (
          <GroupModal
            {...props}
            title={t('Users Groups')}
            closeLink={getUrlPrefix(routeByName.users.root)}
            entity={entityGroupsConstants.User}
            groupItemsTitle={t('Users')}
            groupCardItemsTitle={t('Users')}
            dropItemType={dndConstants.usersItemTypes.USER_ITEM}
            onMoveItem={handleMoveItem}
            itemsLoading={meta.isLoading}
            groupItemsReducer={groupItemsReducer}
            postGroupItemReducer={postGroupItemReducer}
            deleteGroupItemReducer={deleteGroupItemReducer}
            clearGroupItemsInfo={clearUsersGroupItemsInfo}
            itemsPopupProps={{
              getGroupItems: id =>
                getUsersGroupItems(id, {
                  order: 'asc',
                  sort: 'email',
                  fields: 'id,email'
                }),
              onDeleteItem: handleDeleteGroupItem,
              clearGroupItemsInfo: clearGetUsersGroupItemsInfo,
              render: ({ email }) => <EmailLink email={email} />
            }}
          >
            <div className={classes.ungroupedUsersContainer}>
              {ungroupedUsersList}
            </div>
          </GroupModal>
        )}
      />
      <Route
        path={getUrlPrefix(routeByName.users.add)}
        component={AddEditUser}
      />
      <Route
        path={getUrlPrefix(routeByName.users.edit)}
        component={AddEditUser}
      />
      <Route
        path={getUrlPrefix(routeByName.users.permissions)}
        render={props => (
          <UserPermissions
            {...props}
            getPermissionsFn={getUsersPermission}
            putPermissionsFn={putUsersPermission}
            getReducerName="permission"
            putReducerName="putPermission"
            clearGetPermissionFn={clearGetUsersPermissionInfo}
          />
        )}
      />
      <Route
        path={getUrlPrefix(routeByName.users.groupsPermission)}
        render={props => (
          <UserPermissions
            {...props}
            isGroups
            getPermissionsFn={getUsersGroupPermission}
            putPermissionsFn={putUsersGroupPermission}
            getReducerName="groupsPermission"
            putReducerName="putGroupsPermission"
            clearGetPermissionFn={clearGetUsersGroupsPermissionInfo}
          />
        )}
      />
    </PageContainer>
  )
}

const mapStateToProps = ({ impersonateReducer, users, preference }) => ({
  items: users.items.response,
  meta: users.items.meta,
  put: users.put,
  post: users.post,
  preference: preference[entityConstants.UserLibrary].response,
  del: users.del,
  impersonateReducer,
  postGroupItemReducer: users.postGroupItem,
  groupItemsReducer: users.groupItems,
  deleteGroupItemReducer: users.deleteGroupItem,
  ungroupedUsers: users.ungroupedUsers.response
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      getConfigOrgRole,
      clearResponseInfo,
      deleteSelectedItems,
      getConfigSystemRole,
      getConfigEnterpriseRole,
      impersonateUserAction,
      getUsersGroupItems,
      clearGetUsersGroupItemsInfo,
      clearUsersGroupItemsInfo,
      postUsersGroupItem,
      deleteUsersGroupItem,
      getUngroupedUsers
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(UsersLibrary))
  )
)
