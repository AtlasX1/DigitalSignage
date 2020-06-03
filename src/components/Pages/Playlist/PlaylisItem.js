import React, { useState } from 'react'
import { translate } from 'react-i18next'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import { Link } from 'react-router-dom'

import { withStyles, Grid, Typography, Divider } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'

import List from 'components/List'
import Popup from 'components/Popup'
import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { WhiteButton } from 'components/Buttons'
import {
  DropdownHoverListItem,
  DropdownHoverListItemIcon,
  DropdownHoverListItemText
} from 'components/Dropdowns'

import { dndConstants } from 'constants/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    playlistItemWrap: {
      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    playlistItem: {
      padding: '15px 0'
    },
    playlistCheck: {
      marginRight: '20px',
      paddingTop: '5px'
    },
    typeIconWrap: {
      textAlign: 'center',
      marginRight: '25px'
    },
    playlistTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '36px',
      color: palette[type].sideModal.tabs.item.titleColor,
      maxWidth: '25ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    rightSide: {
      textAlign: 'right'
    },
    playlistDuration: {
      fontSize: '14px',
      lineHeight: '18px',
      color: palette[type].sideModal.tabs.item.titleColor
    },
    playlistResolution: {
      fontSize: '11px',
      lineHeight: '18px',
      color: '#9EA0AB'
    },
    playlistItemAction: {
      marginLeft: '20px'
    },
    rowActionDropdown: {
      width: '170px'
    },
    rowActionBtn: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',
      color: palette[type].groupCard.item.button.color,

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    rowActionBtnIcon: {
      width: 18,
      height: 18
    }
  }
}

const PlaylistItem = ({ classes, t, playlist }) => {
  const [dropdown, setDropdown] = useState(false)

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.playlistGroupsItemTypes.PLAYLIST_ITEM,
      id: playlist.id
    },
    canDrag: () => !dropdown,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const actionLinks = [
    {
      label: t('Delete Playlist action'),
      icon: 'icon-bin',
      clickAction: f => f
    }
  ]

  const opacity = isDragging ? 0 : 1

  return (
    <Grid item xs={12} className={classes.playlistItemWrap}>
      <div ref={drag} className={classes.playlistItem} style={{ opacity }}>
        <Grid container justify="space-between">
          <Grid item xs={6}>
            <Grid container>
              <Grid item>
                <LibraryTypeIcon
                  type={playlist.type}
                  wrapHelperClass={classes.typeIconWrap}
                />
              </Grid>
              <Grid item>
                <Typography className={classes.playlistTitle}>
                  {playlist.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.rightSide}>
            <Grid container justify="flex-end">
              <Grid item>
                <Typography className={classes.playlistDuration}>
                  {playlist.duration}
                </Typography>
                <Typography className={classes.playlistResolution}>
                  {t('Media Resolution', {
                    resolution:
                      playlist.resolution && playlist.resolution !== 'x'
                        ? playlist.resolution
                        : t('Responsive')
                  })}
                </Typography>
              </Grid>
              <Grid item className={classes.playlistItemAction}>
                <Popup
                  position="bottom right"
                  onOpen={() => setDropdown(true)}
                  onClose={() => setDropdown(false)}
                  trigger={
                    <WhiteButton className={classes.rowActionBtn}>
                      <Settings className={classes.rowActionBtnIcon} />
                      <KeyboardArrowDown className={classes.rowActionBtnIcon} />
                    </WhiteButton>
                  }
                  contentStyle={{
                    borderRadius: '6px',
                    animation: 'fade-in'
                  }}
                >
                  <List component="nav" disablePadding={true}>
                    {actionLinks.map((action, index) =>
                      action.divider ? (
                        <Divider key={`row-action-${index}`} />
                      ) : (
                        <DropdownHoverListItem
                          key={`row-action-${index}`}
                          component={action.clickAction ? 'button' : Link}
                          to={action.to ? action.to : null}
                          onClick={
                            action.clickAction ? action.clickAction : f => f
                          }
                        >
                          {action.icon && (
                            <DropdownHoverListItemIcon>
                              <i className="icon-bin" />
                            </DropdownHoverListItemIcon>
                          )}
                          <DropdownHoverListItemText primary={action.label} />
                        </DropdownHoverListItem>
                      )
                    )}
                  </List>
                </Popup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  )
}

PlaylistItem.propTypes = {
  classes: PropTypes.object.isRequired,
  playlist: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(PlaylistItem))
