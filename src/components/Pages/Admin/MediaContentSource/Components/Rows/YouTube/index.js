import React, { useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, withStyles } from '@material-ui/core'
import { Grid } from '@material-ui/core'

import {
  TableLibraryCell,
  TableLibraryRow,
  TableLibraryRowActionButton,
  DateTimeView
} from 'components/TableLibrary'
import { Checkbox } from 'components/Checkboxes'
import { deleteContent } from 'actions/contentActions'
import routeByName from 'constants/routes'
import featureConstants from 'constants/featureConstants'
import { checkData } from 'utils/tableUtils'

const styles = ({ typography, type }) => ({
  imgClass: {
    maxWidth: 100,
    maxHeight: 45,
    objectFit: 'cover'
  },
  imgWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100px'
  },
  name: {
    ...typography.darkAccent[type]
  }
})

const TableRow = ({
  t,
  selected,
  deleteContent,
  classes,
  row: {
    id,
    thumbUri,
    name,
    category: { name: categoryName },
    updatedAt,
    contentUri
  },
  onToggleSelect = f => f,
  onUnselect = f => f
}) => {
  const translate = useMemo(
    () => ({
      edit: t('Edit action'),
      del: t('Delete')
    }),
    [t]
  )
  const handleSelect = useCallback(() => {
    onToggleSelect(id)
  }, [id, onToggleSelect])

  const handleDeleteRow = useCallback(() => {
    deleteContent(id)
    onUnselect(id)
  }, [deleteContent, id, onUnselect])

  const actionLinks = useMemo(
    () => [
      {
        label: translate.edit,
        to: `${routeByName[featureConstants.YouTube].root}/${id}/edit`
      },
      { divider: true },
      {
        label: translate.del,
        icon: 'icon-bin',
        clickAction: handleDeleteRow
      }
    ],
    [translate.edit, translate.del, id, handleDeleteRow]
  )

  return (
    <TableLibraryRow hover role="checkbox" tabIndex={-1} selected={selected}>
      <TableLibraryCell padding="checkbox" onClick={handleSelect}>
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
      <TableLibraryCell className={classes.name}>
        {checkData(name)}
      </TableLibraryCell>
      <TableLibraryCell>{checkData(categoryName)}</TableLibraryCell>
      <TableLibraryCell align="center">
        {contentUri ? (
          <Link href={contentUri} underline="always">
            URL
          </Link>
        ) : (
          'No data'
        )}
      </TableLibraryCell>
      <TableLibraryCell align="center">
        <DateTimeView date={updatedAt} />
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
      deleteContent
    },
    dispatch
  )

export default translate('translations')(
  connect(null, mapDispatchToProps)(withStyles(styles)(TableRow))
)
