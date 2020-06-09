import React, { useState, useCallback, useMemo } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'
import { useDrop } from 'react-dnd'

import {
  withStyles,
  Grid,
  Typography,
  Dialog,
  IconButton
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'

import { Card } from 'components/Card'
import { WhiteButton } from 'components/Buttons'
import PlaylistItem from './PlaylistItem'

import { UploadPlaylistFiles } from 'components/Dropdones'
import { dndConstants } from 'constants/index'
import { distinctFilter } from 'utils'
import { useSelector } from 'react-redux'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    root: {
      margin: '0 12px 15px',
      paddingBottom: 0,
      border: `5px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.background,
      borderRadius: '4px'
    },
    header: {
      margin: 0,
      paddingLeft: 0,
      borderBottom: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].card.greyHeader.background
    },
    headerText: {
      marginTop: '15px',
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].card.greyHeader.color
    },
    mediaItemsWrap: {
      overflow: 'auto',
      margin: 0,
      height: '370px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    },
    tagsIcon: {
      marginRight: '10px',
      fontSize: '18px'
    },
    footerActions: {
      padding: '8px 12px',
      borderTop: `1px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.action.background
    },
    selectWrap: {
      marginRight: '20px'
    },
    switchBaseClass: {
      height: '40px'
    },
    selectWrapTransition: {
      minWidth: '154px'
    },
    selectButton: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      ...typography.darkText[type]
    },
    previewAction: {
      paddingTop: '9px',
      paddingBottom: '9px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      boxShadow: 'none',
      ...typography.darkText[type]
    },
    dialogRoot: {
      background: palette[type].sideModal.background
    },
    previewContainer: {
      background: palette[type].sideModal.background,
      padding: '20px',
      borderRadius: '5px'
    },
    previewHeader: {
      marginBottom: '10px',
      position: 'relative'
    },
    previewCloseButton: {
      position: 'absolute',
      right: '0'
    },
    previewTitle: {
      color: palette[type].sideModal.header.titleColor
    },
    previewCloseIcon: {
      color: palette[type].sideModal.header.titleColor
    },
    previewContent: {
      width: '480px',
      height: '270px'
    },
    dropdownListWrap: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
      ...typography.lightText[type]
    },
    errorMessage: {
      position: 'absolute',
      bottom: -15,
      color: 'red',
      fontSize: 9
    }
  }
}

const PlaylistItems = ({
  t,
  classes,
  errors,
  onItemsChange = f => f,
  selectedMedia: items = [],
  getMediaItem,
  playlistItemsOptionsComponent: PlaylistItemsOptionsComponent = f => null,
  playlistItemDropdownComponent: PlaylistItemDropdownComponent = f => null,
  ...props
}) => {
  const { transitions } = useSelector(({ config }) => config)
  const [preview, setPreview] = useState(false)

  const [, drop] = useDrop({
    accept: dndConstants.createTemplateItemTypes.PLAYLIST_ITEM
  })

  const transition = useMemo(
    () =>
      transitions.response
        ? transitions.response.map(i => ({
            id: i.id,
            value: i.code,
            label: i.name
          }))
        : [],
    [transitions.response]
  )

  const addItem = useCallback(
    (item, atIndex, uid) => {
      const newItem = update(item, {
        uid: { $set: uid }
      })

      const updatedItems =
        atIndex !== undefined
          ? update(items, {
              $splice: [[atIndex, 0, newItem]]
            })
          : update(items, { $push: [newItem] })

      onItemsChange(distinctFilter.filterByField(updatedItems, 'uid'))
    },
    [onItemsChange, items]
  )

  const saveItem = useCallback(
    (item, uid) => {
      const wasTemporaryAdded = items.some(({ uid }) => item.uid === uid)
      const updatedItems = wasTemporaryAdded
        ? items.map(oldItem =>
            oldItem.uid === item.uid ? { ...oldItem, uid } : oldItem
          )
        : update(items, { $push: [{ ...item, uid }] })

      onItemsChange(distinctFilter.filterByField(updatedItems, 'uid'))
    },
    [onItemsChange, items]
  )

  const findItem = useCallback(
    uid => {
      const item = items.find(item => item.uid === uid)
      return { item, index: items.indexOf(item) }
    },
    [items]
  )

  const moveItem = useCallback(
    (id, atIndex, uid) => {
      const { item, index } = findItem(uid)

      if (!item) {
        const it = getMediaItem(id)
        addItem(it, atIndex, uid)
      } else {
        onItemsChange(
          update(items, {
            $splice: [
              [index, 1],
              [atIndex, 0, item]
            ]
          })
        )
      }
    },
    [items, findItem, addItem, onItemsChange, getMediaItem]
  )

  const changeMediaItem = useCallback(
    (name, val, index) => {
      onItemsChange(
        update(items, {
          $apply: i => {
            i[index][name] = val
            return i
          }
        })
      )
    },
    [onItemsChange, items]
  )

  const deleteMediaItem = useCallback(
    index => {
      onItemsChange(
        update(items, {
          $splice: [[index, 1]]
        })
      )
    },
    [onItemsChange, items]
  )

  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
      title={t('Playlist Items').toUpperCase()}
      rootClassName={classes.root}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
    >
      <div ref={drop} className={classes.mediaItemsWrap}>
        {items.map((item, index) => (
          <PlaylistItem
            key={item.uid}
            item={item}
            itemIdx={index}
            findItem={findItem}
            moveItem={moveItem}
            saveItem={saveItem}
            transitionOptions={transition}
            onDelete={() => deleteMediaItem(index)}
            onChange={(name, val) => changeMediaItem(name, val, index)}
            playlistItemDropdownComponent={PlaylistItemDropdownComponent}
            {...props}
          />
        ))}
        <Grid item xs={12}>
          <UploadPlaylistFiles
            accept={dndConstants.createTemplateItemTypes.MEDIA_ITEM}
            getMediaItem={getMediaItem}
            addItem={addItem}
            saveItem={saveItem}
            error={errors.media}
            touched={errors.media}
            hidden={items.length > 0}
            containerHeight={
              items.length > 4 ? undefined : 315 - items.length * 70
            }
          />
        </Grid>
      </div>

      <Grid
        container
        className={classes.footerActions}
        justify="space-between"
        alignContent="center"
      >
        <Grid item>
          <PlaylistItemsOptionsComponent
            errors={errors}
            onItemsChange={onItemsChange}
            selectedMedia={items}
            transitionOptions={transition}
            getMediaItem={getMediaItem}
            {...props}
          />
        </Grid>
        <Grid item>
          <WhiteButton
            className={classes.previewAction}
            onClick={() => setPreview(true)}
          >
            {t('Preview')}
          </WhiteButton>
          <Dialog
            open={preview}
            onClose={() => setPreview(false)}
            disableBackdropClick
            classes={{
              paper: classes.dialogRoot
            }}
          >
            <Grid
              container
              className={classes.previewContainer}
              direction="column"
            >
              <Grid
                container
                justify="space-between"
                alignItems="center"
                className={classes.previewHeader}
              >
                <Typography variant="h6" className={classes.previewTitle}>
                  {t('Preview')}
                </Typography>
                <IconButton
                  className={classes.previewCloseButton}
                  onClick={() => setPreview(false)}
                >
                  <CloseIcon className={classes.previewCloseIcon} />
                </IconButton>
              </Grid>
              <Grid className={classes.previewContent}>
                <img
                  src="https://picsum.photos/480/270"
                  alt="create-playlist-container"
                />
              </Grid>
            </Grid>
          </Dialog>
        </Grid>
      </Grid>
    </Card>
  )
}

export default translate('translations')(withStyles(styles)(PlaylistItems))
