import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'

import { Grid, Typography, withStyles } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'

import Popup from 'components/Popup'
import { TagChip } from 'components/Chip'
import { CircleIconButton, WhiteButton } from 'components/Buttons'

import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { dndConstants } from 'constants/index'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    mediaItemWrap: {
      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    mediaItem: {
      width: '100%',
      padding: '0 12px',
      maxHeight: '70px'
    },
    indexNumber: {
      ...typography.darkAccent[type],
      lineHeight: '70px'
    },
    typeIconWrap: {
      margin: '17px 24px',
      textAlign: 'center'
    },
    mediaInfoWrap: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    mediaTitle: {
      maxWidth: '25ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      ...typography.darkAccent[type]
    },
    mediaDuration: {
      ...typography.lightText[type],
      fontSize: '11px'
    },
    rightSide: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      textAlign: 'right'
    },
    tagsListWrap: {
      width: '315px'
    },
    tagsList: {
      padding: '15px 10px'
    },
    mediaActionDropdown: {
      width: '275px'
    },
    mediaActionBtn: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',
      color: palette[type].buttons.white.color,

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    mediaActionBtnIcon: {
      width: 18,
      height: 18
    },
    tagsIcon: {
      color: palette[type].sideModal.tabs.item.titleColor
    }
  }
}

// Tags stuff
const tags = ['A1', 'A2', 'A3', 'A4', 'A5', 'T4']

const PlaylistItem = ({
  classes,
  item,
  itemIdx,
  playlistItemDropdownComponent: PlaylistItemDropdownComponent,
  findItem,
  saveItem,
  moveItem,
  transitionOptions,
  onChange,
  ...props
}) => {
  const [dropdown, setDropdown] = useState(false)

  const originalIndex = findItem(item.uid).index
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.createTemplateItemTypes.PLAYLIST_ITEM,
      id: item.id,
      uid: item.uid,
      originalIndex
    },
    canDrag: () => !dropdown,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    drop: ({ uid }) => {
      const { item } = findItem(uid)
      saveItem(item, uid)
    },
    accept: [
      dndConstants.createTemplateItemTypes.PLAYLIST_ITEM,
      dndConstants.createTemplateItemTypes.MEDIA_ITEM
    ],
    hover({ id: draggedId, uid }) {
      if (uid !== item.uid) {
        const { index: overIndex } = findItem(item.uid)
        moveItem(draggedId, overIndex, uid)
      }
    }
  })

  const TagsButtonComponent = (
    <CircleIconButton className={classes.tagsIcon}>
      <i className="icon-tag-double-1" />
    </CircleIconButton>
  )

  const opacity = isDragging ? 0 : 1
  return (
    <Grid container className={classes.mediaItemWrap}>
      <div
        ref={node => drag(drop(node))}
        style={{ opacity }}
        className={classes.mediaItem}
      >
        <Grid container justify="space-between">
          <Grid item xs={8}>
            <Grid container>
              <Grid item>
                <Typography className={classes.indexNumber}>
                  {originalIndex + 1}
                </Typography>
              </Grid>
              <Grid item>
                <LibraryTypeIcon
                  type={item.feature}
                  wrapHelperClass={classes.typeIconWrap}
                />
              </Grid>
              <Grid item className={classes.mediaInfoWrap}>
                <Typography className={classes.mediaTitle}>
                  {item.title}
                </Typography>
                <Typography className={classes.mediaDuration}>
                  {item.duration}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4} className={classes.rightSide}>
            <Popup
              position="bottom right"
              trigger={TagsButtonComponent}
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              onOpen={() => setDropdown(true)}
              onClose={() => setDropdown(false)}
              contentStyle={{
                width: 315,
                borderRadius: 6,
                animation: 'fade-in'
              }}
            >
              <Grid container className={classes.tagsList}>
                {tags.map(tag => (
                  <Grid item key={tag}>
                    <TagChip label={tag} />
                  </Grid>
                ))}
              </Grid>
            </Popup>

            <Popup
              position="bottom right"
              trigger={
                <WhiteButton className={classes.mediaActionBtn}>
                  <Settings className={classes.mediaActionBtnIcon} />
                  <KeyboardArrowDown className={classes.mediaActionBtnIcon} />
                </WhiteButton>
              }
              onOpen={() => setDropdown(true)}
              onClose={() => setDropdown(false)}
              contentStyle={{
                width: 315,
                borderRadius: 6,
                animation: 'fade-in'
              }}
            >
              <PlaylistItemDropdownComponent
                item={item}
                itemIdx={itemIdx}
                transitions={transitionOptions}
                onValueChange={onChange}
                {...props}
              />
            </Popup>
          </Grid>
        </Grid>
      </div>
    </Grid>
  )
}

PlaylistItem.propTypes = {
  item: PropTypes.object.isRequired,
  findItem: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired
}

export default withStyles(styles)(PlaylistItem)
