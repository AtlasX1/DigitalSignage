import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton,
  DateTimeView
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { deleteItem } from 'actions/usersActions'
import { checkData } from 'utils/tableUtils'
import routeByName from 'constants/routes'
import EmailLink from 'components/EmailLink'
import UserPic from 'components/UserPic'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import { getUrlPrefix } from 'utils'
import { userRoleLevels } from 'constants/api'
import useDeterminePermissions from 'hooks/useDeterminePermissions'

const TableRow = ({
  t,
  selected,
  deleteItem,
  columns,
  variant = userRoleLevels.org,
  row: {
    id,
    email,
    role,
    phone,
    status,
    profile,
    lastLogin,
    lastName,
    firstName,
    createdBy
  },
  onToggleSelect = f => f,
  onUnselect = f => f,
  onImpersonate
}) => {
  const impersonatePermission = useDeterminePermissions('impersonate')

  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      clone: t('Clone'),
      impersonate: t('Impersonate'),
      del: t('Delete'),
      permission: t('Permissions link'),
      formatDate: t('Banners expirationDate format')
    }),
    [t]
  )
  const handleSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const handleDeleteRow = useCallback(() => {
    deleteItem(id)
    onUnselect(id)
  }, [deleteItem, id, onUnselect])

  const handleImpersonate = useCallback(() => {
    onImpersonate(id)
  }, [id, onImpersonate])

  const handleClone = useCallback(() => {
    // TODO implement impersonate logic
  }, [])

  // TODO fix link
  const actionLinks = useMemo(
    () => [
      {
        label: translate.clone,
        clickAction: handleClone,
        render: false
      },
      {
        label: translate.edit,
        to: getUrlPrefix(`${routeByName.users.root}/${id}/edit`)
      },
      {
        label: translate.impersonate,
        clickAction: handleImpersonate,
        render:
          variant === userRoleLevels.enterprise &&
          role.level === userRoleLevels.org &&
          impersonatePermission.read
      },
      {
        label: translate.permission,
        to: getUrlPrefix(`${routeByName.users.root}/${id}/permissions/media`),
        render: role.restricted === 1
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: handleDeleteRow,
        render: variant !== userRoleLevels.system
      }
    ],
    [
      translate.clone,
      translate.edit,
      translate.impersonate,
      translate.permission,
      translate.del,
      handleClone,
      id,
      handleImpersonate,
      variant,
      role.level,
      role.restricted,
      impersonatePermission.read,
      handleDeleteRow
    ]
  )

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>

      <TableLibraryCell align="center" padding="checkbox">
        <UserPic
          status={status}
          role={role.name}
          userName={`${firstName} ${lastName}`}
          imgSrc={profile}
          lastLogin={lastLogin}
        />
      </TableLibraryCell>

      {columns
        .filter(({ display }) => display)
        .map(({ id: column }) => {
          switch (column) {
            case 'firstName': {
              return (
                <TableLibraryCell
                  style={{ fontWeight: 'bold' }}
                  key={`cell-user-${column}`}
                >
                  {firstName} {lastName}
                </TableLibraryCell>
              )
            }
            case 'client': {
              return variant !== userRoleLevels.org ? (
                <TableLibraryCell key={`cell-user-${column}`}>
                  {createdBy.firstName} {createdBy.lastName}
                </TableLibraryCell>
              ) : null
            }
            case 'email': {
              return (
                <TableLibraryCell key={`cell-user-${column}`}>
                  {checkData(email ? <EmailLink email={email} /> : '')}
                </TableLibraryCell>
              )
            }
            case 'phone': {
              return (
                <TableLibraryCell key={`cell-user-${column}`} align="center">
                  {checkData(phone)}
                </TableLibraryCell>
              )
            }
            case 'lastLogin': {
              return (
                <TableLibraryCell key={`cell-user-${column}`} align="center">
                  <DateTimeView date={lastLogin} />
                </TableLibraryCell>
              )
            }
            case 'status': {
              return (
                <TableLibraryCell key={`cell-user-${column}`} align="center">
                  {status === 'Active' ? (
                    <ActiveStatusChip label={t('Active')} />
                  ) : (
                    <InactiveStatusChip label={t('Inactive')} />
                  )}
                </TableLibraryCell>
              )
            }
            default:
              return null
          }
        })}

      <TableLibraryCell align="right">
        <TableLibraryRowActionButton actionLinks={actionLinks} />
      </TableLibraryCell>
    </TableLibraryRow>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteItem
    },
    dispatch
  )

export default translate('translations')(
  connect(null, mapDispatchToProps)(TableRow)
)
