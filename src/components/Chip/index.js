import { withStyles, Chip } from '@material-ui/core'
import React from 'react'

export const StatusChip = withStyles({
  root: {
    width: 80,
    height: 25,
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  }
})(Chip)

export const ActiveStatusChip = withStyles({
  root: {
    backgroundColor: '#3cd480'
  }
})(StatusChip)

export const InactiveStatusChip = withStyles({
  root: {
    backgroundColor: '#d35e37'
  }
})(StatusChip)

export const TrialChip = withStyles({
  root: {
    width: 'auto',
    height: 17,
    fontSize: '10px',
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: '3px'
  }
})(Chip)

export const FlexTrialChip = withStyles({
  root: {
    color: '#ff3d84',
    backgroundColor: 'rgba(255, 61, 132, 0.22)'
  }
})(TrialChip)

export const TagChip = withStyles({
  root: {
    position: 'relative',
    margin: '0 20px 0 0',
    padding: '0 5px 0 10px',
    height: 'auto',
    border: '1px solid #d9dfec',
    borderRight: 'none',
    fontSize: '11px',
    lineHeight: '20px',
    background: '#f1f4f9',
    borderRadius: '2px 0 0 2px',

    '&:before, &:after': {
      position: 'absolute',
      content: '""',
      width: 0,
      height: 0
    },

    '&:before': {
      top: '-1px',
      bottom: '-1px',
      right: '-11px',
      borderTop: '11px solid transparent',
      borderBottom: '11px solid transparent',
      borderLeft: '11px solid #d9dfec'
    },

    '&:after': {
      top: 0,
      bottom: 0,
      right: '-10px',
      borderTop: '10px solid transparent',
      borderBottom: '10px solid transparent',
      borderLeft: '10px solid #f1f4f9'
    }
  },
  label: {
    padding: 0
  }
})(Chip)

export const ColoredTagChip = withStyles({
  tag: {
    height: '25px',
    marginRight: '15px',
    fontSize: '12px',
    borderRadius: '3px',
    fontWeight: 'bold'
  },
  tagRedColor: {
    border: '1px solid #DE5246',
    backgroundColor: 'rgba(222, 82, 70, 0.25)',
    color: '#DE5246'
  },
  tagOrangeColor: {
    border: '1px solid #ff7b25',
    backgroundColor: 'rgba(255, 123, 37, 0.25)',
    color: '#ff7b25'
  },
  tagBlueColor: {
    border: '1px solid #3983ff',
    backgroundColor: 'rgba(57, 131, 255, 0.25)',
    color: '#3983ff'
  },
  tagGreenColor: {
    border: '1px solid #3cd480',
    backgroundColor: 'rgba(60, 212, 128, 0.25)',
    color: '#3cd480'
  }
})(({ rootClassName, classes, color, label }) => (
  <Chip
    className={[
      classes.tag,
      rootClassName,
      color === 'red'
        ? classes.tagRedColor
        : color === 'orange'
        ? classes.tagOrangeColor
        : color === 'blue'
        ? classes.tagBlueColor
        : color === 'green'
        ? classes.tagGreenColor
        : classes.tagGreenColor
    ].join(' ')}
    label={label}
  />
))

export const PermissionChip = withStyles({
  root: {
    maxWidth: '180px',
    maxHeight: '18px',
    margin: '2.5px',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  label: {
    fontSize: '11px',
    fontWeight: 'bold',
    padding: '4px'
  }
})(({ classes, value, clickHandler = f => f, active }) => {
  const colors = {
    read: '#3cd480',
    create: '#ff7b25',
    update: '#3983ff',
    delete: '#DE5246'
  }
  const picked = active === false ? colors[value] + 75 : colors[value]
  const style = {
    color: picked,
    backgroundColor: `${colors[value]}25`,
    border: `solid 1px ${picked}`,
    opacity: active ? 1 : 0.5
  }
  return (
    <Chip
      classes={{
        root: classes.root,
        label: classes.label
      }}
      onClick={clickHandler}
      disabled={active}
      style={style}
      label={value}
      clickable
    />
  )
})
