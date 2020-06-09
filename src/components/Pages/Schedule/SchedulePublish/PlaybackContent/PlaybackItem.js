import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'

import { disabledPreviewMediaFeatures } from 'constants/media'
import { Grid, Typography, withStyles, RootRef } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'
import { getMediaPreview, showMediaPreview } from 'actions/mediaActions'

import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { TagChip } from 'components/Chip'
import { CircleIconButton, WhiteButton } from 'components/Buttons'
import { MediaActionDropdown } from 'components/Media'
import Popup from 'components/Popup'

import { dndConstants } from 'constants/index'
import { useSelector, useDispatch } from 'react-redux'

const tags = ['A1', 'A2', 'A3', 'A4', 'A5', 'T4']

const styles = theme => {
  const { type, palette, typography } = theme
  return {
    mediaItem: {
      padding: '0 12px',
      maxHeight: '70px',

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    indexNumber: {
      ...typography.darkAccent[type],
      lineHeight: '70px'
    },
    typeIconWrap: {
      cursor: 'pointer',
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
    tagsIcon: {
      marginRight: '10px',
      fontSize: '18px',
      color: '#535d73'
    },
    mediaActionDropdown: {
      width: '275px'
    },
    mediaActionBtn: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    mediaActionBtnIcon: {
      width: 18,
      height: 18
    }
  }
}

const PlaybackItem = ({ classes, item, onDelete, ...props }) => {
  const dispatchAction = useDispatch()
  const mediaPreview = useSelector(({ media }) => media.preview)

  const [dropdown, setDropdown] = useState(false)

  const [transitionsReducer] = useSelector(state => [state.config.transitions])

  const originalIndex = props.findItem(item.uid).index
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.schedulePublishItemTypes.PLAYLIST_ITEM,
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
      const { item } = props.findItem(uid)
      props.saveItem(item, uid)
    },
    accept: [
      dndConstants.schedulePublishItemTypes.PLAYLIST_ITEM,
      dndConstants.schedulePublishItemTypes.MEDIA_ITEM
    ],
    hover({ id: draggedId, uid }) {
      if (uid !== item.uid) {
        const { index: overIndex } = props.findItem(item.uid)
        props.moveItem(draggedId, overIndex, uid)
      }
    }
  })

  const handlePreviewClick = useCallback(() => {
    const { id, feature } = item
    if (disabledPreviewMediaFeatures.includes(feature.name)) {
      return
    }

    if (mediaPreview.id !== id || mediaPreview.error) {
      dispatchAction(getMediaPreview(id))
    } else {
      dispatchAction(showMediaPreview())
    }
  }, [dispatchAction, item, mediaPreview])

  const TagsButtonComponent = (
    <CircleIconButton className={classes.tagsIcon}>
      <i className="icon-tag-double-1" />
    </CircleIconButton>
  )

  const opacity = isDragging ? 0 : 1

  return (
    <RootRef rootRef={node => drag(drop(node))}>
      <Grid item xs={12} className={classes.mediaItem} style={{ opacity }}>
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
                  type={item.type}
                  wrapHelperClass={classes.typeIconWrap}
                  onClick={handlePreviewClick}
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
              on="hover"
              position="bottom right"
              trigger={TagsButtonComponent}
              onOpen={() => setDropdown(true)}
              onClose={() => setDropdown(false)}
              contentStyle={{
                width: 315,
                border: 'none',
                borderRadius: 6,
                animation: 'fade-in'
              }}
              arrowStyle={{
                border: 'none'
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
              on="hover"
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
                border: 'none',
                borderRadius: 6,
                animation: 'fade-in'
              }}
              arrowStyle={{
                border: 'none'
              }}
            >
              <MediaActionDropdown
                transitionId={item.transitionId}
                daypartStartTime={item.daypartStartTime}
                daypartEndTime={item.daypartEndTime}
                playtime={item.playtime}
                transitions={
                  transitionsReducer.response &&
                  transitionsReducer.response.map(i => ({
                    id: i.id,
                    value: i.code,
                    label: i.name
                  }))
                }
                onValueChange={(f, v) =>
                  props.handleItemValueChange(f, v, props.index)
                }
                onDelete={onDelete}
                options={{
                  disableTransition: true
                }}
              />
            </Popup>
          </Grid>
        </Grid>
      </Grid>
    </RootRef>
  )
}

PlaybackItem.propTypes = {
  item: PropTypes.object.isRequired,
  findItem: PropTypes.func.isRequired,
  moveItem: PropTypes.func.isRequired
}

export default withStyles(styles)(PlaybackItem)
