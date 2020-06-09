import { withStyles, Button, IconButton, Fab } from '@material-ui/core'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'

export const WhiteButton = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      paddingLeft: '14px',
      paddingRight: '14px',
      border: `1px solid ${palette[type].buttons.white.border}`,
      background: palette[type].buttons.white.background,
      boxShadow: `0 2px 4px 0 ${palette[type].buttons.white.shadow}`,
      color: palette[type].buttons.white.color,

      '&:hover': {
        background: palette[type].buttons.white.background,
        borderColor: palette[type].buttons.white.hover.border,
        color: palette[type].buttons.white.hover.color
      }
    },
    label: {
      fontSize: '0.8125rem',
      lineHeight: '1.6667em',
      textTransform: 'capitalize',
      color: 'inherit'
    }
  }
})(Button)

export const CircleIconButton = withStyles({
  label: {
    lineHeight: 1,
    marginBottom: '-2px'
  }
})(IconButton)

export const BlueButton = withStyles({
  root: {
    paddingLeft: '14px',
    paddingRight: '14px',
    border: '1px solid #0378ba',
    background: 'linear-gradient(to right, #0b86cb, #0378ba)',
    color: '#fff',

    '&:hover': {
      background:
        'linear-gradient(to right, #006198, #006198), linear-gradient(to right, #0378ba, #0378ba)'
    }
  },
  label: {
    fontSize: '0.8125rem',
    lineHeight: '1.6667em',
    textTransform: 'capitalize',
    color: 'inherit'
  }
})(Button)

export const TabToggleButtonGroup = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: palette[type].tabs.background,
      borderRadius: '100px',
      boxShadow: 'none'
    }
  }
})(ToggleButtonGroup)

export const TabToggleButton = withStyles(({ palette, type, typography }) => ({
  root: {
    ...typography.lightText[type],
    minWidth: '65px',
    height: '25px',
    border: `1px solid ${palette[type].tabs.toggleButton.border}`,
    fontSize: '0.75rem',
    lineHeight: 1,
    borderRadius: '100px',
    textTransform: 'capitalize',
    background: palette[type].tabs.toggleButton.background,

    '&:not(:last-child)': {
      borderRight: 'none'
    }
  },
  selected: {
    borderColor: '#0378ba !important',
    backgroundColor: '#0378ba !important',
    color: '#fff !important',
    fontWeight: 'bold'
  }
}))(ToggleButton)

export const FabBlueButton = withStyles({
  root: {
    paddingLeft: '55px',
    paddingRight: '55px',
    background: '#0076b9',
    color: '#fff',

    '&:hover': {
      background: '#006198'
    }
  },
  label: {
    fontSize: '18px',
    textTransform: 'capitalize',
    color: 'inherit'
  }
})(Fab)

export const WeekSelectGroup = withStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    boxShadow: 'none'
  }
})(ToggleButtonGroup)

export const WeekSelectButton = withStyles({
  root: {
    width: '55px',
    height: '22px',
    paddingTop: 0,
    paddingBottom: 0,
    border: '1px solid #e4e9f3',
    fontSize: '12px',
    textTransform: 'uppercase',
    borderRadius: '2px !important',
    backgroundColor: '#fff',
    color: '#606066'
  },
  selected: {
    borderColor: '#41cb71 !important',
    backgroundColor: '#41cb71 !important',
    color: '#fff !important'
  }
})(ToggleButton)

export const DirectionToggleButtonGroup = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: palette[type].sideModal.background,
      borderRadius: '4px',
      boxShadow: 'none'
    }
  }
})(ToggleButtonGroup)

export const DirectionToggleButton = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      width: '42px',
      minWidth: '42px',
      height: '38px',
      border: `1px solid ${palette[type].sideModal.content.border}`,
      fontSize: '12px',
      color: palette[type].directionToggle.color,
      borderRadius: '4px',
      textTransform: 'capitalize',

      '&:not(:last-child)': {
        borderRight: 'none'
      }
    },
    selected: {
      borderColor: '#0378ba !important',
      backgroundColor: '#0378ba !important',
      color: '#fff !important'
    }
  }
})(ToggleButton)

export const TransparentButton = withStyles({
  root: {
    background: 'transparent',
    color: '#74809a',

    '&:hover': {
      borderColor: '#006198',
      color: '#006198'
    }
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: 'inherit'
  }
})(Button)
