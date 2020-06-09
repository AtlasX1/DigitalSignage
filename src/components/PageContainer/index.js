import React, { cloneElement, useCallback } from 'react'
import { withStyles, Grid, Typography, Tooltip } from '@material-ui/core'

import Popup from 'components/Popup'
import { CircleIconButton } from 'components/Buttons'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    pageContainer: {
      position: 'relative',
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: palette[type].pageContainer.border,
      background: palette[type].pageContainer.background,
      borderRadius: 8,
      boxShadow: `0 2px 4px 0 ${palette[type].pageContainer.shadow}`
    },
    pageContainerHeader: {
      paddingLeft: 27,
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].pageContainer.header.border,
      backgroundColor: palette[type].pageContainer.header.background,
      lineHeight: '65px',
      borderRadius: '8px 8px 0 0'
    },
    pageTitle: {
      margin: 0,
      letterSpacing: '0px',
      ...typography.pageTitle[type]
    },
    infoIconWrap: {
      paddingLeft: '7px',
      paddingRight: '7px',
      borderLeftWidth: 1,
      borderLeftStyle: 'solid',
      borderLeftColor: palette[type].pageContainer.header.infoIcon.border
    },
    pageContainerSubHeader: {
      paddingLeft: 27,
      borderBottom: `1px solid ${palette[type].pageContainer.subHeader.border}`,
      borderTop: `1px solid ${palette[type].pageContainer.subHeader.border}`,
      backgroundColor: palette[type].pageContainer.subHeader.background
    },
    circleIcon: {
      color: palette[type].pageContainer.header.infoIcon.color
    },
    settingsDropdown: {
      width: '315px'
    },
    isSelecting: {
      backgroundColor: palette[type].pageContainer.header.selecting,
      color: palette[type].pageContainer.header.titleColor
    }
  }
}

const PageContainer = ({ classes, ...props }) => {
  const {
    children,
    pageTitle,
    PageTitleComponent,
    MiddleActionComponent,
    ActionButtonsComponent,
    SubHeaderMenuComponent,
    SubHeaderLeftActionComponent,
    SubHeaderMiddleActionComponent,
    SubHeaderRightActionComponent,
    subHeader = true,
    header = true,
    subHeaderRightActionComponentClassName = '',
    circleIconClickHandler = null,
    circleIconTitle,
    replaceInfoIcon = '',
    isShowSubHeaderComponent = true
  } = props

  const dropdownStyle = {
    borderRadius: 6,
    width: 315,
    animation: 'fade-in 200ms'
  }

  const isSelecting =
    PageTitleComponent && PageTitleComponent.key === 'selectTitle'

  const renderSubHeaderMenuComponent = useCallback(
    close => {
      return cloneElement(SubHeaderMenuComponent, { close })
    },
    [SubHeaderMenuComponent]
  )

  return (
    <div className={classes.pageContainer}>
      {header && (
        <header
          className={`${classes.pageContainerHeader} ${
            isSelecting && classes.isSelecting
          }`}
        >
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              {!PageTitleComponent ? (
                <Typography
                  className={classes.pageTitle}
                  component="h1"
                  variant="h1"
                >
                  {' '}
                  {pageTitle}{' '}
                </Typography>
              ) : (
                PageTitleComponent
              )}
            </Grid>
            {MiddleActionComponent && <Grid item>{MiddleActionComponent}</Grid>}
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>{ActionButtonsComponent}</Grid>
                <Grid item className={classes.infoIconWrap}>
                  <CircleIconButton
                    className={`hvr-grow ${classes.circleIcon}`}
                  >
                    <i
                      className={
                        replaceInfoIcon ||
                        'icon-chat-bubble-square-information-1'
                      }
                    />
                  </CircleIconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </header>
      )}
      {subHeader && (
        <div className={classes.pageContainerSubHeader}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>{SubHeaderLeftActionComponent}</Grid>
            {SubHeaderMiddleActionComponent && (
              <Grid item>{SubHeaderMiddleActionComponent}</Grid>
            )}
            <Grid
              xs={2}
              item
              container
              justify="flex-end"
              className={subHeaderRightActionComponentClassName}
            >
              {SubHeaderRightActionComponent && (
                <Grid item>{SubHeaderRightActionComponent}</Grid>
              )}
              <Grid item className={classes.infoIconWrap}>
                {!circleIconClickHandler && isShowSubHeaderComponent && (
                  <Popup
                    on="click"
                    position="bottom right"
                    contentStyle={dropdownStyle}
                    trigger={
                      <CircleIconButton
                        className={`hvr-grow ${classes.circleIcon}`}
                      >
                        <i className="icon-settings-1" />
                      </CircleIconButton>
                    }
                  >
                    {close => <div>{renderSubHeaderMenuComponent(close)}</div>}
                  </Popup>
                )}

                {circleIconClickHandler && (
                  <Tooltip title={circleIconTitle}>
                    <CircleIconButton
                      onClick={circleIconClickHandler}
                      className={`hvr-grow ${classes.circleIcon}`}
                    >
                      <i className="icon-settings-1" />
                    </CircleIconButton>
                  </Tooltip>
                )}
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
      {children}
    </div>
  )
}

export default withStyles(styles)(PageContainer)
