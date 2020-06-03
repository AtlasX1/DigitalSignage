import React, { useCallback } from 'react'
import { translate } from 'react-i18next'
import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { DEVICE_PACKAGE } from 'constants/packageConstants'

const DevicePackageRow = ({
  row,
  t,
  deleteItem,
  selected,
  onToggleSelect,
  onUnselect
}) => {
  const handleSelect = useCallback(() => {
    onToggleSelect(row.id)
  }, [row.id, onToggleSelect])

  const deleteRow = useCallback(() => {
    deleteItem(row.id)
    onUnselect()
  }, [deleteItem, onUnselect, row.id])

  return (
    <TableLibraryRow
      hover
      role="checkbox"
      tabIndex={-1}
      selected={row.selected}
    >
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>
      <TableLibraryCell>{row.title}</TableLibraryCell>

      <TableLibraryCell align="right">
        <TableLibraryRowActionButton
          actionLinks={[
            {
              label: t('Edit action'),
              to: `/system/packages-library/${DEVICE_PACKAGE}/${row.id}/edit`,
              data: { row }
            },
            { divider: true },
            {
              label: t('Delete'),
              icon: 'icon-bin',
              clickAction: deleteRow
            }
          ]}
        />
      </TableLibraryCell>
    </TableLibraryRow>
  )
}

export default translate('translations')(DevicePackageRow)
