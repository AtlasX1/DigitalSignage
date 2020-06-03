import { Tab, withStyles } from '@material-ui/core'

export const SingleIconTab = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      minHeight: '63px',
      minWidth: 'initial',
      color: palette[type].singleIconTab.color,
      cursor: 'pointer',

      '&:not(:last-of-type)': {
        margin: '0 45px 0 0'
      },

      '&:hover': {
        color: palette[type].singleIconTab.hover.color
      }
    },
    selected: {
      color: '#0a83c8',

      '&:hover': {
        color: '#0a83c8'
      }
    }
  }
})(Tab)
