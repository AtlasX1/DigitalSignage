import React, { useCallback } from 'react'
import { Typography, withStyles } from '@material-ui/core'
import classNames from 'classnames'
import { CircleIconButton } from 'components/Buttons'

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
    marginTop: '10px'
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
  },
  tableFooterCircleIcon: {
    fontSize: '18px',
    color: '#e91c24'
  }
})

const TabIcon = withStyles(TabIconStyles)(({ iconClassName = '', classes }) => (
  <div className={classes.tabIconWrap}>
    <i className={iconClassName} />
  </div>
))

const mark = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

const DirectionItem = ({ classes, label, onDelete, index, isLast }) => {
  const handleClickDelete = useCallback(() => {
    onDelete(label)
  }, [label, onDelete])

  return (
    <div className={classes.root}>
      <div className={classes.label}>
        <Typography
          className={classNames(classes.mark, {
            [classes.boundaryMark]: index === 0 || isLast
          })}
        >
          {mark[index]}
        </Typography>
        <TabIcon iconClassName={'icon-location-pin-2'} />
        <Typography className={classes.locationLabel}>{label}</Typography>
      </div>
      <CircleIconButton
        className={`hvr-grow ${classes.tableFooterCircleIcon}`}
        onClick={handleClickDelete}
      >
        <i className="icon-bin" />
      </CircleIconButton>
    </div>
  )
}

export default withStyles(styles)(DirectionItem)
