import { Tabs, withStyles } from '@material-ui/core'

export const SingleIconTabs = withStyles({
  scroller: {
    margin: '0 0 0 30px'
  },
  indicator: {
    display: 'none'
  }
})(Tabs)
