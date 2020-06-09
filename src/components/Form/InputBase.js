import { withStyles, InputBase } from '@material-ui/core'

const BootstrapInputBase = withStyles(
  ({ palette, type, typography, transitions, spacing }) => {
    return {
      root: {
        'label + &': {
          marginTop: spacing.unit * 3
        }
      },
      input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: palette[type].formControls.input.background,
        border: `1px solid ${palette[type].formControls.input.border}`,
        color: palette[type].formControls.input.color,
        fontSize: '0.875rem',
        width: '100%',
        height: '38px',
        padding: '5px 26px 5px 7px',
        transition: transitions.create(['border-color', 'box-shadow']),
        fontFamily: typography.fontFamily,

        '&:focus': {
          borderRadius: 4,
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
        }
      }
    }
  }
)(InputBase)

export default BootstrapInputBase
