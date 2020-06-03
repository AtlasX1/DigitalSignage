import React, { useCallback, useMemo } from 'react'
import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { translate } from 'react-i18next'
import { unselectItems } from 'utils/tableUtils'
import routeByName from 'constants/routes'

const TableRow = ({
  t,
  selected,
  onSelectRow,
  variant,
  row: { id, title, subject }
}) => {
  const translate = useMemo(
    () => ({
      edit: t('Edit action')
    }),
    [t]
  )

  const handleClickSelect = useCallback(() => {
    selected
      ? onSelectRow(values => ({
          ...unselectItems(values, [id])
        }))
      : onSelectRow(values => ({
          ...values,
          [id]: true
        }))
  }, [id, onSelectRow, selected])

  const actionLinks = useMemo(() => {
    return [
      {
        label: translate.edit,
        to: `${routeByName[variant].root}/${id}/edit`
      }
    ]
  }, [id, translate.edit, variant])

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleClickSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>
      <TableLibraryCell>{title}</TableLibraryCell>
      <TableLibraryCell>{subject}</TableLibraryCell>

      <TableLibraryCell align="right">
        <TableLibraryRowActionButton actionLinks={actionLinks} />
      </TableLibraryCell>
    </TableLibraryRow>
  )
}

export default translate('translations')(TableRow)
