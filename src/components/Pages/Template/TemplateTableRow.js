import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { Link } from 'react-router-dom'

import { deleteTemplate as deleteItem } from 'actions/templateActions'
import { Tooltip, withStyles } from '@material-ui/core'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'

import { checkData } from 'utils/tableUtils'
import { ActiveStatusChip, InactiveStatusChip } from 'components/Chip'
import LibraryTypeIcon from 'components/LibraryTypeIcon'

import capitalize from 'utils/capitalize'

import { templateConstants, routeByName } from 'constants/index'
import LibraryTagChips from '../../../components/LibraryTagChips'

const styles = ({ typography, type }) => ({
  previewLink: {
    textDecoration: 'none'
  },
  name: {
    ...typography.darkAccent[type]
  }
})

const TableRow = ({
  t,
  classes,
  selected,
  deleteItem,
  columns,
  row,
  onToggleSelect = f => f,
  onUnselect = f => f,
  onClone = f => f
}) => {
  const {
    id,
    title,
    group,
    duration,
    height,
    width,
    orientation,
    status,
    displayQty,
    templateType
  } = row
  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      clone: t('Clone Playlist action'),
      preview: t('Preview Playlist action'),
      del: t('Delete'),
      permission: t('Permissions link')
    }),
    [t]
  )
  const templateTypeInfo = useMemo(
    () =>
      templateConstants.templateTypes[templateType] ||
      templateConstants.templateTypes.Standard,
    [templateType]
  )
  const handleSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const handleDeleteRow = useCallback(() => {
    deleteItem(id)
    onUnselect(id)
  }, [deleteItem, id, onUnselect])

  const handleClone = useCallback(() => {
    onClone({
      open: true,
      id: id,
      title: `Copy of ${title}`
    })
  }, [id, onClone, title])

  const actionLinks = useMemo(
    () => [
      {
        label: translate.clone,
        clickAction: handleClone
      },
      {
        label: translate.edit,
        to: routeByName.template.editWithId(id)
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: handleDeleteRow
      }
    ],
    [
      translate.clone,
      translate.edit,
      translate.del,
      handleClone,
      id,
      handleDeleteRow
    ]
  )

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>

      {columns
        .filter(({ display }) => display)
        .map(({ id: column }) => {
          switch (column) {
            case 'templateType':
              return (
                <TableLibraryCell
                  align="center"
                  padding="checkbox"
                  key={column}
                >
                  <Tooltip title={templateTypeInfo.title}>
                    <LibraryTypeIcon
                      component={Link}
                      to={routeByName.template.editWithId(id)}
                      className={classes.previewLink}
                      color={templateTypeInfo.color}
                      icon={templateTypeInfo.icon}
                      iconHelperClass={templateTypeInfo.iconHelperClass}
                    />
                  </Tooltip>
                </TableLibraryCell>
              )
            case 'title': {
              return (
                <TableLibraryCell key={column} className={classes.name}>
                  {checkData(title)}
                </TableLibraryCell>
              )
            }
            case 'group': {
              return (
                <TableLibraryCell key={column}>
                  {group ? group.map(f => f.title).join(', ') : 'N/A'}
                </TableLibraryCell>
              )
            }
            case 'duration': {
              return (
                <TableLibraryCell key={column}>
                  {checkData(duration)}
                </TableLibraryCell>
              )
            }
            case 'resolution': {
              return (
                <TableLibraryCell key={column}>
                  {checkData(width, null) && checkData(height, null)
                    ? width === 'x' || height === 'x'
                      ? t('Responsive')
                      : `${width} x ${height}`
                    : t('Responsive')}
                </TableLibraryCell>
              )
            }
            case 'orientation': {
              return (
                <TableLibraryCell key={column}>
                  {checkData(capitalize(orientation))}
                </TableLibraryCell>
              )
            }
            case 'displayQty': {
              return (
                <TableLibraryCell key={column} align="center">
                  {checkData(displayQty, 'N/A')}
                </TableLibraryCell>
              )
            }
            case 'status':
              return (
                <TableLibraryCell
                  key={`cell-playlist-${column}`}
                  align="center"
                >
                  {status ? (
                    <ActiveStatusChip label={t('Active')} />
                  ) : (
                    <InactiveStatusChip label={t('Inactive')} />
                  )}
                </TableLibraryCell>
              )
            case 'tag':
              return (
                <TableLibraryCell
                  key={`cell-playlist-${column}`}
                  align="center"
                >
                  <LibraryTagChips tags={row.tag} />
                </TableLibraryCell>
              )
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

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(null, mapDispatchToProps)
)(TableRow)
