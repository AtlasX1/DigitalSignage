import { Tabs, withStyles } from '@material-ui/core'

export const RoundedTabs = withStyles(theme => {
  const { type, palette } = theme
  return {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 15px',
      background: palette[type].roundedTabs.background,
      border: '0'
    },
    indicator: {
      display: 'none'
    }
  }
})(Tabs)
