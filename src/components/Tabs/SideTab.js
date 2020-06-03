import React from 'react'
import { Tab, withStyles } from '@material-ui/core'

export const SideTab = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      minWidth: '210px',
      padding: 0,
      margin: '5px -1px 5px 0',
      borderTop: 'solid 1px transparent',
      borderLeft: 'solid 1px transparent',
      borderBottom: 'solid 1px transparent',
      textTransform: 'none',
      textAlign: 'left',
      color: '#9394a0',
      cursor: 'pointer'
    },
    selected: {
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].sideModal.content.border,
      borderRadius: '15px 0 0 15px',
      color: palette[type].sideTab.selected.color,
      background: palette[type].sideTab.selected.background
    },
    wrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    labelContainer: {
      width: 'auto',
      padding: 0,
      lineHeight: '48px'
    },
    labelIcon: {
      minHeight: 'auto'
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: 'inherit'
    }
  }
})(Tab)

const TabIconStyles = theme => ({
  tabIconWrap: {
    width: '90px',
    paddingLeft: '10px',
    fontSize: '22px',
    lineHeight: '18px'
  }
})

export const TabIcon = withStyles(TabIconStyles)(
  ({ iconClassName = '', classes }) => (
    <div className={classes.tabIconWrap}>
      <i className={iconClassName} />
    </div>
  )
)
