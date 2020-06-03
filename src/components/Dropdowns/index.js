import React from 'react'

import {
  withStyles,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid
} from '@material-ui/core'

import '../../styles/dropdowns/_dropdown.scss'

const styles = theme => {
  const { palette, type } = theme
  return {
    menu: {
      background: palette[type].dropdown.background,
      boxShadow: `0 2px 4px 0 ${palette[type].dropdown.shadow}`,
      border: `1px solid ${palette[type].dropdown.borderColor}`,

      '&::before': {
        borderColor: `transparent transparent ${palette[type].dropdown.background} transparent`
      },

      '&::after': {
        borderColor: `transparent transparent ${palette[type].dropdown.borderColor} transparent`
      }
    }
  }
}

const DropdownHover = withStyles(styles)(
  ({
    classes,
    MenuComponent,
    ButtonComponent,
    visibleOnInit = false,
    buttonHoverColored,
    dropSide = 'bottomLeft',
    dropdownContainerClassName = '',
    menuContainerClassName = '',
    buttonWrapClassName = '',
    menuClassName = '',
    forceHidden = false
  }) => {
    const isBottom = ['bottomRight', 'bottomCenter', 'bottomLeft'].includes(
      dropSide
    )
    const isTop = ['topRight', 'topCenter', 'topLeft'].includes(dropSide)
    return (
      <div
        className={[
          'Dropdown-hover__container',
          forceHidden ? 'Dropdown-hover__container--force-hidden' : '',
          dropdownContainerClassName,
          visibleOnInit ? 'Dropdown-hover__container--visible' : ''
        ].join(' ')}
      >
        <div
          className={[
            'Dropdown-hover--button',
            buttonWrapClassName,
            buttonHoverColored ? 'colored-button' : ''
          ].join(' ')}
        >
          {ButtonComponent}
        </div>
        <div
          className={[
            'Dropdown-hover--menu-container',
            menuContainerClassName,
            isBottom
              ? 'Dropdown-hover--menu-container-bottom'
              : isTop
              ? 'Dropdown-hover--menu-container-top'
              : '',
            dropSide === 'bottomRight'
              ? 'drop-bottom-right'
              : dropSide === 'bottomCenter'
              ? 'drop-bottom-center'
              : dropSide === 'rightCenter'
              ? 'drop-right-center'
              : ''
          ].join(' ')}
        >
          <Grid
            className={[
              `Dropdown-hover--menu ${menuClassName}`,
              isBottom
                ? 'Dropdown-hover--menu-bottom'
                : isTop
                ? 'Dropdown-hover--menu-top'
                : '',
              classes.menu
            ].join(' ')}
          >
            {MenuComponent}
          </Grid>
        </div>
      </div>
    )
  }
)

const DropdownHoverListItem = withStyles(theme => {
  const { palette, type } = theme
  return {
    root: {
      paddingTop: '10px',
      paddingBottom: '10px',
      color: palette[type].dropdown.listItem.color,
      border: 'none',
      background: palette[type].dropdown.listItem.background,

      '&:first-child': {
        borderRadius: '8px 8px 0 0'
      },

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].dropdown.listItem.border}`
      },

      '&:last-child': {
        borderRadius: '0 0 8px 8px'
      },

      '&:hover': {
        cursor: 'pointer',
        backgroundColor: palette[type].dropdown.listItem.hover.background,
        color: palette[type].dropdown.listItem.hover.color
      }
    }
  }
})(ListItem)

const DropdownHoverListItemText = withStyles({
  root: {
    padding: '5px 0 0 10px'
  },
  primary: {
    fontSize: '13px',
    color: 'inherit'
  }
})(ListItemText)

const DropdownHoverListItemIcon = withStyles({
  root: {
    marginRight: 0,
    fontSize: '22px',
    color: '#74809a'
  }
})(ListItemIcon)

export {
  DropdownHover,
  DropdownHoverListItem,
  DropdownHoverListItemText,
  DropdownHoverListItemIcon
}
