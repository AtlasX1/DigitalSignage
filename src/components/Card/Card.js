import React from 'react'
import { translate } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import classNames from 'classnames'
import {
  withStyles,
  Paper,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'
import Popup from '../Popup'
import { CircleIconButton } from '../Buttons'
import 'styles/card/_card.scss'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      padding: '22px 32px',
      borderRadius: 0,
      boxShadow: 'none',
      background: palette[type].card.background,
      overflow: 'visible'
    },
    radius: {
      borderRadius: '6px'
    },
    shadow: {
      boxShadow: `-2px 0 4px 0 ${palette[type].card.shadow}`
    },
    noRootSidePaddings: {
      paddingLeft: 0,
      paddingRight: 0
    },
    noRootTopPadding: {
      paddingTop: 0
    },
    header: {
      marginBottom: '20px'
    },
    headerSidePaddings: {
      paddingLeft: '32px',
      paddingRight: '32px'
    },
    circleIcon: {
      padding: '4px',
      color: '#afb7c7'
    },
    menuDropdown: {
      width: '215px'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: '32px',
      color: palette[type].card.titleColor
    },
    cardMenuList: {
      padding: '10px 0 10px 10px'
    },
    cardMenuText: {
      color: palette[type].list.item.color,
      transition: 'all .4s',

      '&:hover': {
        fontWeight: 'bold',
        color: palette[type].list.item.colorActive
      }
    },

    grayHeader: {
      marginLeft: '-32px',
      marginRight: '-32px',
      backgroundColor: palette[type].card.greyHeader.background,
      borderTop: `1px solid ${palette[type].pages.adminSettings.content.border}`,
      borderBottom: `1px solid ${palette[type].pages.adminSettings.content.border}`
    },
    noNegativeHeaderSideMargins: {
      marginLeft: 0,
      marginRight: 0
    },
    grayHeaderTitle: {
      fontSize: '12px',
      color: palette[type].card.greyHeader.color,
      paddingLeft: '32px',
      lineHeight: '44px'
    },

    flatHeader: {
      marginTop: '8px',
      marginBottom: '30px'
    },
    flatHeaderTitle: {
      fontSize: '20px',
      fontWeight: 'normal',
      lineHeight: '24px',
      color: palette[type].card.flatHeader.color
    }
  }
}

const Card = ({
  t,
  classes,
  title = null,
  titleComponent = null,
  menuItems = [],
  removeSidePaddings = false,
  removeNegativeHeaderSideMargins = false,
  icon = true,
  iconClassName = null,
  iconButtonClassName = null,
  iconButtonComponent = null,
  radius = true,
  shadow = true,
  grayHeader = false,
  flatHeader = false,
  dropdown = true,
  dropdownContainerClassName = '',
  onClickFunction = f => f,
  rootClassName = '',
  headerClasses = [],
  headerTextClasses = [],
  helpText = null,
  hasMargin = true,
  headerHelpTextClasses = [],
  menuDropdownComponent = null,
  menuDropdownContainerClassName = '',
  showMenuOnHover = false,
  popupContentStyle = {},
  ...props
}) => {
  return (
    <Paper
      className={classNames(classes.root, rootClassName, {
        [classes.noRootSidePaddings]: removeSidePaddings,
        [classes.radius]: radius,
        [classes.shadow]: shadow,
        [classes.noRootTopPadding]: grayHeader,
        Card__Container: showMenuOnHover
      })}
    >
      {(title || titleComponent) && (
        <header
          className={classNames(...headerClasses, {
            [classes.header]: hasMargin,
            [classes.headerSidePaddings]: removeSidePaddings,
            [classes.noNegativeHeaderSideMargins]: removeNegativeHeaderSideMargins,
            [classes.grayHeader]: grayHeader,
            [classes.flatHeader]: flatHeader
          })}
        >
          <Grid container justify="space-between">
            {title && titleComponent && (
              <Grid item>
                <Typography
                  className={classNames(
                    classes.cardTitle,
                    ...headerTextClasses,
                    {
                      [classes.grayHeaderTitle]: grayHeader,
                      [classes.flatHeaderTitle]: flatHeader
                    }
                  )}
                >
                  {title}
                </Typography>
              </Grid>
            )}

            <Grid item>
              {titleComponent ? (
                titleComponent
              ) : (
                <Typography
                  className={classNames(
                    classes.cardTitle,
                    ...headerTextClasses,
                    {
                      [classes.grayHeaderTitle]: grayHeader,
                      [classes.flatHeaderTitle]: flatHeader
                    }
                  )}
                >
                  {title}
                </Typography>
              )}
            </Grid>
            {icon && (
              <Grid
                item
                className={showMenuOnHover ? 'Card__Dropdown-Icon' : ''}
              >
                {dropdown ? (
                  <Popup
                    position="bottom right"
                    contentStyle={{ zIndex: 20, ...popupContentStyle }}
                    trigger={
                      iconButtonComponent ? (
                        iconButtonComponent
                      ) : (
                        <CircleIconButton
                          className={classNames(
                            'hvr-grow',
                            classes.circleIcon,
                            iconButtonClassName
                          )}
                        >
                          <i
                            className={
                              iconClassName ||
                              'icon-navigation-show-more-vertical'
                            }
                          />
                        </CircleIconButton>
                      )
                    }
                  >
                    {menuDropdownComponent ? (
                      menuDropdownComponent
                    ) : (
                      <List
                        className={classNames(
                          classes.cardMenuList,
                          menuDropdownContainerClassName
                        )}
                      >
                        {menuItems.map((item, index) => (
                          <ListItem
                            key={item + index}
                            component={RouterLink}
                            to={item.url}
                          >
                            <ListItemText
                              primary={item.label}
                              primaryTypographyProps={{
                                className: classes.cardMenuText
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Popup>
                ) : (
                  <CircleIconButton
                    className={classNames(
                      'hvr-grow',
                      classes.circleIcon,
                      iconButtonClassName
                    )}
                    onClick={onClickFunction}
                  >
                    <i
                      className={
                        iconClassName || 'icon-navigation-show-more-vertical'
                      }
                    />
                  </CircleIconButton>
                )}
              </Grid>
            )}
            {helpText && (
              <Grid item>
                <Typography className={classNames(...headerHelpTextClasses)}>
                  {helpText}
                </Typography>
              </Grid>
            )}
          </Grid>
        </header>
      )}

      {props.children}
    </Paper>
  )
}

export default translate('translations')(withStyles(styles)(Card))
