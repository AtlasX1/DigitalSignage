import React, { useCallback, useMemo } from 'react'
import { Tooltip } from '@material-ui/core'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import { translate } from 'react-i18next'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton,
  DateTimeView
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { FlexTrialChip } from 'components/Chip'
import CustomBadge from 'components/Badge'
import TypeCircle from 'components/TypeCircle'
import { getUrlPrefix } from 'utils'
import routeByName from 'constants/routes'

const TableRow = ({
  t,
  selected,
  preference,
  role,
  row: {
    id,
    client,
    trial,
    name,
    type,
    createdAt,
    featurePackage: { title: featureTitle },
    totalDevice: { all: countOfAllDevices },
    totalUser: { all: countOfAllUsers }
  },
  onToggleSelect
}) => {
  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      del: t('Delete'),
      settings: t('Super Admin Settings')
    }),
    [t]
  )

  const handleSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const actionLinks = useMemo(
    () => [
      {
        label:
          client === 'White Label Client' || trial === 'Super Admin'
            ? translate.settings
            : translate.edit,
        to:
          client === 'White Label Client'
            ? getUrlPrefix(routeByName.clients.WLSuperAdminSettingsWithId(id))
            : trial === 'Super Admin'
            ? getUrlPrefix(routeByName.clients.superAdminSettingsWithId(id))
            : getUrlPrefix(routeByName.clients.editWithId(id))
      },
      {
        label: t('Notes'),
        to: getUrlPrefix(routeByName.clients.notes(id)),
        render: role.system
      }
    ],
    [t, client, id, translate.edit, translate.settings, role.system, trial]
  )

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>

      {preference
        .filter(({ display }) => display)
        .map(({ id: column }) => {
          switch (column) {
            case 'id': {
              return (
                <TableLibraryCell align="center" key={`cell-client-${column}`}>
                  {id}
                </TableLibraryCell>
              )
            }
            case 'name': {
              return (
                <TableLibraryCell key={`cell-client-${column}`}>
                  {name}
                  <div>
                    <FlexTrialChip label="Flex trial" />
                  </div>
                </TableLibraryCell>
              )
            }
            case 'packageName': {
              return (
                <TableLibraryCell key={`cell-client-${column}`}>
                  {featureTitle}
                </TableLibraryCell>
              )
            }
            case 'createdOn': {
              return (
                <TableLibraryCell key={`cell-client-${column}`} align="center">
                  <DateTimeView date={createdAt} />
                </TableLibraryCell>
              )
            }
            case 'devices': {
              return (
                <TableLibraryCell align="center" key={`cell-client-${column}`}>
                  {countOfAllDevices ? (
                    <Link
                      to={`/system/device-library/list?client=${name}`}
                      component={RouterLink}
                      target="_blank"
                    >
                      <CustomBadge content={countOfAllDevices} />
                    </Link>
                  ) : (
                    <span>No devices</span>
                  )}
                </TableLibraryCell>
              )
            }
            case 'users': {
              return (
                <TableLibraryCell align="center" key={`cell-client-${column}`}>
                  {countOfAllUsers ? (
                    <Link
                      to={`/system/users-library?client=${name}`}
                      component={RouterLink}
                      target="_blank"
                    >
                      <CustomBadge content={countOfAllUsers} />
                    </Link>
                  ) : (
                    <span>No users</span>
                  )}
                </TableLibraryCell>
              )
            }
            case 'type': {
              return (
                <TableLibraryCell align="center" key={`cell-client-${column}`}>
                  <Tooltip
                    title={`Clients ${type} Tooltip title`}
                    placement="top"
                  >
                    <TypeCircle color={type.alias} />
                  </Tooltip>
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

export default translate('translations')(TableRow)
