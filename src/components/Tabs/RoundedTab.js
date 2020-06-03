import { Tab, withStyles } from '@material-ui/core'

export const RoundedTab = withStyles({
  root: {
    background: 'transparent',
    borderRadius: '11px',
    minWidth: '57px',
    minHeight: '22px',
    fontSize: '12px',
    fontWeight: 'bold',
    lineHeight: '22px',
    padding: '0',
    color: '#9fadbf'
  },
  selected: {
    background: '#e6eaf4',
    color: '#067dc0'
  },
  label: {
    padding: '0',
    textTransform: 'none'
  },
  labelContainer: {
    padding: '0'
  }
})(Tab)
