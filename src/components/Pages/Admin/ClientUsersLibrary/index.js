import { withStyles } from '@material-ui/core'
import {
  impersonateUserAction,
  logoutUserAction
} from 'actions/authenticationActions'
import {
  clearResponseInfo,
  deleteSelectedItems,
  getItems
} from 'actions/clientUsersActions'
import { WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'
import PageContainer from 'components/PageContainer'
import PageTitle from 'components/PageContainer/PageTitle'
import BaseTable from 'components/TableLibrary/BaseTable'
import { userRoleLevels } from 'constants/api'
import { apiConstants } from 'constants/index'
import routeByName from 'constants/routes'
import { useCustomSnackbar } from 'hooks/index'
import useIds from 'hooks/tableLibrary/useIds'
import useSelectedList from 'hooks/tableLibrary/useSelectedList'
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { notificationAnalyzer, setToken } from 'utils'
import saveOriginalToken from 'utils/saveOriginalToken'
import AddEditUser from './AddEditUser'
import Filter from './Filter'
import TableRow from './TableRow'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: 17
  },
  iconColor: {
    marginRight: 9,
    fontSize: 14,
    color: palette[type].pageContainer.header.button.iconColor
  }
})

const initialColumns = [
  { id: 'firstName', label: 'Name', display: true },
  {
    id: 'client',
    label: 'Client',
    display: true
  },
  { id: 'email', label: 'Email', display: true },
  { id: 'phone', label: 'Phone', align: 'center', display: true },
  { id: 'lastLogin', label: 'Last Login', align: 'center', display: true },
  { id: 'tag', label: 'Tags', align: 'center', display: true },
  { id: 'status', label: 'Status', align: 'center', display: true }
]

const ClientUsersLibrary = ({
  t,
  put,
  del,
  post,
  meta,
  items,
  classes,
  getItems,
  enqueueSnackbar,
  logoutUserAction,
  impersonateUserAction,
  impersonateReducer,
  clearResponseInfo,
  deleteSelectedItems,
  closeSnackbar
}) => {
  const [showInactive, toggleShowInactive] = useState(false)
  const showSnackbar = useCustomSnackbar(t, enqueueSnackbar, closeSnackbar)
  const translate = useMemo(
    () => ({
      title: t('Client Users'),
      groups: t('Groups'),
      add: t('Add User table action'),
      showInactive: t('Show Inactive Users')
    }),
    [t]
  )

  const rowsIds = useIds(items)

  const selectedList = useSelectedList(rowsIds)

  useEffect(() => {
    getItems({
      page: 1
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      enqueueSnackbar,
      [post, put, del],
      'User'
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

  const [tokenNameImpersonateUser, setTokenNameImpersonateUser] = useState(
    apiConstants.ORG_USER_TOKEN_NAME
  )

  const handleImpersonateUser = useCallback(
    id => {
      const {
        SYSTEM_USER_TOKEN_NAME,
        ORG_USER_TOKEN_NAME,
        ENTERPRISE_USER_TOKEN_NAME
      } = apiConstants
      const level = items.find(item => item.id === id).role.level

      setTokenNameImpersonateUser(
        level === userRoleLevels.enterprise
          ? ENTERPRISE_USER_TOKEN_NAME
          : level === userRoleLevels.system
          ? SYSTEM_USER_TOKEN_NAME
          : ORG_USER_TOKEN_NAME
      )
      impersonateUserAction(id)
    },
    [impersonateUserAction, items]
  )

  useEffect(() => {
    if (impersonateReducer.response) {
      const { accessToken, tokenType, expiresIn } = impersonateReducer.response
      saveOriginalToken()
      setToken(tokenNameImpersonateUser, tokenType, accessToken, expiresIn)
      window.location.reload()
    } else if (impersonateReducer.error) {
      if (impersonateReducer.error.message) {
        showSnackbar(impersonateReducer.error.message)
      }
    }
    // eslint-disable-next-line
  }, [impersonateReducer])

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
            to={routeByName.clientUsers.add}
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
        <Filter fetcher={getItems} perPage={meta.perPage} />
      }
    >
      <BaseTable
        meta={meta}
        fetcher={getItems}
        columns={initialColumns}
        noType={false}
        deleteSelectedItems={deleteSelectedItems}
        selectedList={selectedList}
        placeholderMessage="No saved users"
      >
        {items.map(row =>
          row.status === 'Active' ? (
            <TableRow
              row={row}
              selected={selectedList.isSelect(row.id)}
              onToggleSelect={selectedList.toggle}
              onUnselect={selectedList.unselect}
              onImpersonate={handleImpersonateUser}
              key={`user-row-${row.id}`}
            />
          ) : (
            row.status === 'Inactive' &&
            showInactive && (
              <TableRow
                row={row}
                selected={selectedList.isSelect(row.id)}
                onToggleSelect={selectedList.toggle}
                onUnselect={selectedList.unselect}
                onImpersonate={handleImpersonateUser}
                key={`user-row-${row.id}`}
              />
            )
          )
        )}
      </BaseTable>
      <Route path={routeByName.clientUsers.add} component={AddEditUser} />
      <Route path={routeByName.clientUsers.edit} component={AddEditUser} />
    </PageContainer>
  )
}

const mapStateToProps = ({
  impersonateReducer,
  clientUsers: {
    items: { meta, response: items },
    post,
    put,
    del
  }
}) => ({
  impersonateReducer,
  items,
  meta,
  put,
  post,
  del
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      clearResponseInfo,
      deleteSelectedItems,
      impersonateUserAction,
      logoutUserAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(
      connect(mapStateToProps, mapDispatchToProps)(ClientUsersLibrary)
    )
  )
)
