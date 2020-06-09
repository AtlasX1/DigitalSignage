import React, { useCallback, useMemo } from 'react'
import { Grid, withStyles } from '@material-ui/core'
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
import { deleteItem } from 'actions/workplacePosterActions'
import { checkData } from 'utils/tableUtils'
import { formatBytes } from 'utils'

const styles = ({ typography, type }) => ({
  imgClass: {
    maxWidth: 100,
    maxHeight: 60,
    objectFit: 'cover',
    cursor: 'pointer'
  },
  imgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    ...typography.darkAccent[type]
  }
})

const TableRow = ({
  t,
  deleteItem,
  selected,
  row: {
    id,
    title,
    content,
    contentThumb,
    tag,
    size,
    contentType,
    orientation,
    updatedAt
  },
  onToggleSelect,
  onUnselect,
  classes,
  onClickPreview
}) => {
  const handleClickSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const deleteRow = useCallback(() => {
    deleteItem(id)
    onUnselect(id)
  }, [deleteItem, id, onUnselect])

  const actionLinks = useMemo(() => {
    return [
      {
        label: t('Edit action'),
        to: `/system/workplace-posters-library/${id}/edit`
      },
      { divider: true },
      {
        label: t('Delete'),
        icon: 'icon-bin',
        clickAction: deleteRow
      }
    ]
  }, [id, t, deleteRow])

  const tags = useMemo(() => {
    return tag.map(({ title }) => title).join(', ')
  }, [tag])

  const handleCLickPreviewImage = useCallback(() => {
    onClickPreview(content)
  }, [onClickPreview, content])

  return (
    <>
      <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
        <TableLibraryCell padding="checkbox" onClick={handleClickSelect}>
          <Checkbox checked={selected} />
        </TableLibraryCell>
        <TableLibraryCell style={{ padding: 'unset' }}>
          <Grid item className={classes.imgWrapper}>
            {contentThumb ? (
              <img
                className={classes.imgClass}
                onClick={handleCLickPreviewImage}
                src={contentThumb}
                alt="No correct data"
              />
            ) : (
              <span>{t('No data')}</span>
            )}
          </Grid>
        </TableLibraryCell>

        <TableLibraryCell className={classes.name}>
          <Grid item>{checkData(title)}</Grid>
        </TableLibraryCell>
        <TableLibraryCell>{checkData(tags)}</TableLibraryCell>
        <TableLibraryCell align="center">
          {formatBytes(size ? size : 0, 3)}
        </TableLibraryCell>
        <TableLibraryCell align="center">
          {checkData(contentType)}
        </TableLibraryCell>
        <TableLibraryCell align="center">
          {checkData(orientation)}
        </TableLibraryCell>
        <TableLibraryCell align="center">
          <DateTimeView date={updatedAt} />
        </TableLibraryCell>

        <TableLibraryCell align="right">
          <TableLibraryRowActionButton actionLinks={actionLinks} />
        </TableLibraryCell>
      </TableLibraryRow>
    </>
  )
}

export default translate('translations')(
  withStyles(styles)(
    connect(null, dispatch =>
      bindActionCreators(
        {
          deleteItem
        },
        dispatch
      )
    )(TableRow)
  )
)
