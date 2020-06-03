import React, { useState } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'
import { useDrop } from 'react-dnd'

import { withStyles, Grid } from '@material-ui/core'

import { Card } from 'components/Card'
import { WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'

import { UploadPlaylistFiles } from 'components/Dropdones'
import PlaybackItem from './PlaybackItem'
import { dndConstants } from 'constants/index'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      margin: '0 0 15px',
      paddingBottom: 0,
      border: `5px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].card.greyHeader.background,
      borderRadius: '4px'
    },
    header: {
      margin: 0,
      paddingLeft: 0,
      borderBottom: `solid 1px ${palette[type].sideModal.content.border}`,
      backgroundColor: palette[type].sideModal.groups.header.background
    },
    headerText: {
      marginTop: '15px',
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].sideModal.groups.header.titleColor
    },
    mediaItemsWrap: {
      overflow: 'auto',
      margin: 0,
      height: '370px'
    },
    footerActions: {
      padding: '8px 12px',
      borderTop: `1px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.groups.header.background
    },
    switchBaseClass: {
      height: '40px'
    },
    previewAction: {
      minWidth: '114px',
      paddingTop: '9px',
      paddingBottom: '9px',
      borderColor: palette[type].sideModal.groups.button.border,
      backgroundImage: palette[type].sideModal.groups.button.background,
      boxShadow: 'none',
      color: palette[type].sideModal.groups.button.color,

      '&:hover': {
        color: palette[type].sideModal.groups.button.color
      }
    }
  }
}

const PlaybackContent = ({ t, classes, ...props }) => {
  const [items, setItems] = useState([])
  const [, drop] = useDrop({
    accept: dndConstants.schedulePublishItemTypes.PLAYLIST_ITEM
  })

  const addItem = (item, atIndex) => {
    if (atIndex !== undefined) {
      setItems(
        update(items, {
          $splice: [[atIndex, 0, item]]
        })
      )
    } else {
      setItems(update(items, { $push: [item] }))
    }
  }

  const deleteItem = removeId => {
    setItems(items.filter(({ id }) => removeId !== id))
  }

  const findItem = id => {
    const item = items.find(item => item.id === id)
    return { item, index: items.indexOf(item) }
  }

  const moveItem = (id, atIndex) => {
    const { item, index } = findItem(id)
    if (!item) {
      const it = props.getMediaItem(id)
      addItem(it, atIndex)
    } else {
      setItems(
        update(items, {
          $splice: [
            [index, 1],
            [atIndex, 0, item]
          ]
        })
      )
    }
  }

  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      removeSidePaddings={true}
      headerSidePaddings={true}
      removeNegativeHeaderSideMargins={true}
      title={t('Playback Content').toUpperCase()}
      rootClassName={classes.root}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
    >
      <div ref={drop}>
        <Grid
          container
          direction="column"
          wrap="nowrap"
          className={classes.mediaItemsWrap}
        >
          {items.map((item, index) => (
            <PlaybackItem
              key={`feature-${item.id}-${index}`}
              item={item}
              findItem={findItem}
              moveItem={moveItem}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
          <Grid item xs={12}>
            <UploadPlaylistFiles
              accept={dndConstants.schedulePublishItemTypes.MEDIA_ITEM}
              getMediaItem={props.getMediaItem}
              addItem={addItem}
              hidden={items.length > 0}
              containerHeight={
                items.length > 4 ? undefined : 315 - items.length * 70
              }
            />
          </Grid>
        </Grid>
      </div>
      <Grid
        container
        className={classes.footerActions}
        justify="space-between"
        alignContent="center"
      >
        <Grid item>
          <CheckboxSwitcher
            label={t('Randomize')}
            switchBaseClass={classes.switchBaseClass}
          />
        </Grid>
        <Grid item>
          <WhiteButton className={classes.previewAction}>
            {t('Preview')}
          </WhiteButton>
        </Grid>
      </Grid>
    </Card>
  )
}

export default translate('translations')(withStyles(styles)(PlaybackContent))
