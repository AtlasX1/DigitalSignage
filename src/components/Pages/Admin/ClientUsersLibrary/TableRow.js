import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton,
  DateTimeView,
  UserNameView
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { deleteItem } from 'actions/clientUsersActions'
import { checkData } from 'utils/tableUtils'
import routeByName from 'constants/routes'
import UserPic from 'components/UserPic'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import useDeterminePermissions from 'hooks/useDeterminePermissions'
import EmailLink from 'components/EmailLink'
import LibraryTagChips from '../../../../components/LibraryTagChips'
import { withStyles } from '@material-ui/core'

const style = ({ typography, type }) => ({
  name: {
    ...typography.darkAccent[type]
  }
})

const TableRow = ({
  t,
  classes,
  selected,
  deleteItem,
  row: {
    id,
    email,
    role,
    phone,
    tag,
    status,
    profile,
    lastLogin,
    lastName,
    firstName,
    client
  },
  onImpersonate,
  onToggleSelect = f => f,
  onUnselect = f => f
}) => {
  const impersonatePermission = useDeterminePermissions('impersonate')

  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      del: t('Delete'),
      impersonate: t('Impersonate')
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

  const actionLinks = useMemo(
    () => [
      {
        label: translate.edit,
        to: `${routeByName.clientUsers.root}/${id}/edit`
      },
      {
        label: translate.impersonate,
        clickAction: handleImpersonate,
        render: impersonatePermission.read
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: handleDeleteRow
      }
    ],
    [
      translate.edit,
      translate.impersonate,
      translate.del,
      id,
      handleImpersonate,
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
          userName={<UserNameView firstName={firstName} lastName={lastName} />}
          imgSrc={profile}
          lastLogin={lastLogin}
        />
      </TableLibraryCell>

      <TableLibraryCell className={classes.name}>
        <UserNameView firstName={firstName} lastName={lastName} />
      </TableLibraryCell>
      <TableLibraryCell>
        {checkData(client ? client.name : '')}
      </TableLibraryCell>
      <TableLibraryCell>
        {checkData(email ? <EmailLink email={email} /> : '')}
      </TableLibraryCell>
      <TableLibraryCell align="center">{checkData(phone)}</TableLibraryCell>
      <TableLibraryCell align="center">
        <DateTimeView date={lastLogin} />
      </TableLibraryCell>
      <TableLibraryCell align="center">
        {status === 'Active' ? (
          <ActiveStatusChip label={t('Active')} />
        ) : (
          <InactiveStatusChip label={t('Inactive')} />
        )}
      </TableLibraryCell>
      <TableLibraryCell align="center">
        <LibraryTagChips tags={tag} />
      </TableLibraryCell>
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

export default compose(
  translate('translations'),
  connect(null, mapDispatchToProps),
  withStyles(style)
)(TableRow)
