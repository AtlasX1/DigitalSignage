import React, { useCallback, useMemo } from 'react'
import { Grid } from '@material-ui/core'
import ColorCircle from 'components/ColorCircle'
import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { translate } from 'react-i18next'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { deleteItem } from 'actions/bannerActions'
import routeByName from 'constants/routes'

const TableRow = ({
  t,
  deleteItem,
  selected,
  row: { id, name, color, userRole, expirationDate },
  onToggleSelect,
  onUnselect: unselectItem
}) => {
  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      del: t('Delete'),
      formatDate: t('Banners expirationDate format')
    }),
    [t]
  )

  const handleSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const deleteRow = useCallback(() => {
    deleteItem(id)
    unselectItem(id)
  }, [deleteItem, id, unselectItem])

  const actionLinks = useMemo(() => {
    return [
      {
        label: translate.edit,
        to: `${routeByName.banner.root}/${id}/edit`
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: deleteRow
      }
    ]
  }, [id, translate, deleteRow])

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>
      <TableLibraryCell>
        <Grid container spacing={16} alignItems="center">
          <Grid item>
            <ColorCircle color={color} size="big" />
          </Grid>
          <Grid item>{name}</Grid>
        </Grid>
      </TableLibraryCell>
      <TableLibraryCell>
        {userRole.map(({ displayName }) => displayName).join(', ')}
      </TableLibraryCell>
      <TableLibraryCell style={{ textAlign: 'center' }}>
        {moment(expirationDate).format(translate.formatDate)}
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

export default translate('translations')(
  connect(null, mapDispatchToProps)(TableRow)
)
