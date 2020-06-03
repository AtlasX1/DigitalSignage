import React, { useCallback } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import TableLibraryRowActionButton from 'components/TableLibrary/TableLibraryRowActionButton'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '20px',
    lineHeight: '16px',
    color: '#0A83C8'
  }
})

const styles = ({ palette, type }) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '18px'
  },

  label: {
    display: 'flex',
    alignItems: 'center'
  },

  locationLabel: {
    color: palette[type].formControls.label.color
  },
  mark: {
    marginRight: 10,
    fontSize: 24,
    color: '#666'
  },
  boundaryMark: {
    color: '#e91c24'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const LocationItem = ({
  classes,
  label,
  onDelete,
  onEdit,
  onAddToDirections,
  index,
  hasAlreadyDirection,
  countDirections
}) => {
  const handleClickDelete = useCallback(() => {
    onDelete(index)
  }, [index, onDelete])

  const handleClickAddToDirections = useCallback(() => {
    onAddToDirections(label)
  }, [label, onAddToDirections])

  const handleClickEdit = useCallback(() => {
    onEdit(index)
  }, [index, onEdit])

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        <TabIcon iconClassName={'icon-location-pin-2'} />
        <Typography className={classes.locationLabel}>{label}</Typography>
      </div>

      <TableLibraryRowActionButton
        actionLinks={[
          {
            label: 'Add to directions',
            icon: 'icon-pencil1',
            clickAction: handleClickAddToDirections,
            render:
              countDirections < 10 &&
              !hasAlreadyDirection &&
              countDirections < 10
          },
          { divider: true },
          {
            label: 'Edit',
            icon: 'icon-pencil1',
            clickAction: handleClickEdit
          },
          { divider: true },
          {
            label: 'Delete',
            icon: 'icon-bin',
            clickAction: handleClickDelete
          }
        ]}
      />
    </div>
  )
}

export default withStyles(styles)(LocationItem)
