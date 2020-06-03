import React, { useCallback, useMemo } from 'react'
import { Grid, withStyles } from '@material-ui/core'
import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton,
  DateTimeView
} from '../../TableLibrary'
import { Checkbox } from '../../Checkboxes'
import { translate } from 'react-i18next'
import { checkData } from 'utils/tableUtils'
import routeByName from 'constants/routes'
import { ANNOUNCEMENT } from 'constants/library'

const styles = () => ({
  imgClass: {
    maxWidth: 100,
    maxHeight: 60,
    objectFit: 'cover'
  },
  imgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100px'
  }
})

const TableRow = ({
  t,
  deleteItem,
  selected,
  row: { id, name, thumbUri, category, orientation, updatedAt },
  onToggleSelect,
  onUnselect,
  variant,
  classes
}) => {
  const translate = useMemo(
    () => ({
      del: t('Delete'),
      edit: t('Edit action')
    }),
    [t]
  )

  const handleClickSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const deleteRow = useCallback(() => {
    deleteItem(id)
    onUnselect(id)
  }, [deleteItem, onUnselect, id])

  const actionLinks = useMemo(() => {
    return [
      {
        label: translate.edit,
        to: `${routeByName[variant].root}/${id}/edit`
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: deleteRow
      }
    ]
  }, [variant, id, translate, deleteRow])

  return (
    <>
      <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
        <TableLibraryCell padding="checkbox" onClick={handleClickSelect}>
          <Checkbox checked={selected} />
        </TableLibraryCell>
        <TableLibraryCell style={{ padding: 'unset' }}>
          <Grid item className={classes.imgWrapper}>
            {thumbUri ? (
              <img
                className={classes.imgClass}
                src={thumbUri}
                alt="No correct data"
              />
            ) : (
              <span>{t('No data')}</span>
            )}
          </Grid>
        </TableLibraryCell>
        <TableLibraryCell>
          <Grid item>{checkData(name)}</Grid>
        </TableLibraryCell>

        <TableLibraryCell>{checkData(category.name)}</TableLibraryCell>
        {variant === ANNOUNCEMENT && (
          <TableLibraryCell>{checkData(orientation)}</TableLibraryCell>
        )}
        <TableLibraryCell>
          <DateTimeView date={updatedAt} />
        </TableLibraryCell>
        <TableLibraryCell align="right">
          <TableLibraryRowActionButton actionLinks={actionLinks} />
        </TableLibraryCell>
      </TableLibraryRow>
    </>
  )
}

export default translate('translations')(withStyles(styles)(TableRow))
