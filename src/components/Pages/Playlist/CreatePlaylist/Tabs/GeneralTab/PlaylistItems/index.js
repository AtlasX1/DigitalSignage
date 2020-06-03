import React, { useState, useEffect } from 'react'
import { translate } from 'react-i18next'
import update from 'immutability-helper'
import { useDrop } from 'react-dnd'

import uuidv4 from 'uuid/v4'

import {
  withStyles,
  Grid,
  Typography,
  Dialog,
  IconButton,
  List
} from '@material-ui/core'
import { KeyboardArrowDown, Close as CloseIcon } from '@material-ui/icons'

import Popup from 'components/Popup'
import { Card } from 'components/Card'
import { WhiteButton } from 'components/Buttons'
import {
  DropdownHoverListItem,
  DropdownHoverListItemText
} from 'components/Dropdowns'
import { CheckboxSwitcher } from 'components/Checkboxes'
import PlaylistItem from './PlaylistItem'

import { UploadPlaylistFiles } from 'components/Dropdones'
import { secToLabel } from 'utils/secToLabel'
import { dndConstants } from 'constants/index'

const styles = theme => {
  const { palette, type } = theme
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
      justifyContent: 'space-between'
    },
    previewAction: {
      paddingTop: '9px',
      paddingBottom: '9px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      boxShadow: 'none',
      color: palette[type].sideModal.action.button.color
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
      overflow: 'auto'
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
  onItemsChange = f => f,
  handleValueChange = f => f,
  duration,
  randomize = false,
  interactionType,
  errors,
  touched,
  selectedTransition,
  selectedMedia,
  transitionOptions = [],
  handleTransitionChange = f => f,
  ...props
}) => {
  const [preview, setPreview] = useState(false)
  const [transition, setTransition] = useState(null)
  const [transitionDropdown, setTransitionDropdown] = useState(false)
  const [durationDropdown, setDurationDropdown] = useState(false)
  const [items, setItems] = useState([])

  const [, drop] = useDrop({
    accept: dndConstants.createTemplateItemTypes.PLAYLIST_ITEM
  })

  useEffect(
    () => {
      if (transition && transition.value)
        items.forEach(i => (i.transitionId = transition.id))
    },
    // eslint-disable-next-line
    [transition]
  )

  useEffect(
    () => {
      if (selectedTransition) {
        const transition = transitionOptions.find(
          i => i.id === selectedTransition
        )
        transition && applyTransition(transition)
      }
    },
    // eslint-disable-next-line
    [selectedTransition]
  )

  useEffect(
    () => {
      if (selectedMedia && selectedMedia.length) {
        setItems(selectedMedia)
      }
    },
    // eslint-disable-next-line
    [selectedMedia]
  )

  const addItem = (item, atIndex) => {
    let newItem = item

    if (items.includes(newItem)) {
      newItem = update(item, {
        id: { $set: item.id + '-' + uuidv4() }
      })
    }

    if (atIndex !== undefined) {
      setItems(
        update(items, {
          $splice: [[atIndex, 0, newItem]]
        })
      )
    } else {
      setItems(update(items, { $push: [newItem] }))
    }
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

  const changeMediaItem = (name, val, index) => {
    switch (name) {
      case 'dayparttime':
        setItems(
          update(items, {
            $apply: i => {
              i[index].daypartStartTime = secToLabel(val[0])
              i[index].daypartEndTime = secToLabel(val[1])
              return i
            }
          })
        )
        break
      case 'playtime':
        setItems(
          update(items, {
            $apply: i => {
              i[index].playtime = val
              return i
            }
          })
        )
        break
      case 'transition':
        setItems(
          update(items, {
            $apply: i => {
              i[index].transitionId = val.id
              return i
            }
          })
        )
        break
      default:
        break
    }
  }

  const deleteMediaItem = index => {
    setItems(
      update(items, {
        $splice: [[index, 1]]
      })
    )
  }

  const applyDuration = duration => {
    const newItems = [...items]
    newItems.forEach(i => (i.duration = secToLabel(duration)))
    setItems(newItems)
    handleValueChange('duration', secToLabel(duration))
  }

  const applyTransition = transition => {
    const newItems = [...items]
    newItems.forEach(i => (i.transitionId = transition.id))
    setItems(newItems)
    setTransition(transition)
    handleTransitionChange(transition.label)
  }

  const createDurationOptions = () => {
    let options = []

    for (let i = 10; i <= 3600; i += 10) {
      options.push(
        <DropdownHoverListItem
          key={`create-playlist-transition-${i}`}
          onClick={() => applyDuration(i)}
        >
          <DropdownHoverListItemText primary={secToLabel(i)} />
        </DropdownHoverListItem>
      )
    }

    return options
  }

  useEffect(
    () => {
      if (items.length) {
        onItemsChange(items)
      }
    },
    // eslint-disable-next-line
    [items]
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
            key={`feature-${item.id}_${index}`}
            item={item}
            findItem={findItem}
            moveItem={moveItem}
            transitionOptions={transitionOptions}
            onDelete={() => deleteMediaItem(index)}
            onChange={(name, val) => changeMediaItem(name, val, index)}
          />
        ))}
        <Grid item xs={12}>
          <UploadPlaylistFiles
            accept={dndConstants.createTemplateItemTypes.MEDIA_ITEM}
            getMediaItem={props.getMediaItem}
            addItem={addItem}
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
          <Grid container>
            <Grid
              item
              className={[
                classes.selectWrap,
                classes.selectWrapTransition
              ].join(' ')}
            >
              <Popup
                open={transitionDropdown}
                onOpen={() => {
                  setDurationDropdown(false)
                }}
                onClose={() => setTransitionDropdown(false)}
                trigger={
                  <WhiteButton className={classes.selectButton}>
                    {transition ? transition.label : t('Select Transition')}
                    <KeyboardArrowDown />
                    {errors.transition && touched.transition && (
                      <Typography className={classes.errorMessage}>
                        {errors.transition}
                      </Typography>
                    )}
                  </WhiteButton>
                }
                contentStyle={{
                  width: 190,
                  height: 300,
                  borderRadius: 6,
                  animation: 'fade-in 500ms'
                }}
              >
                <List
                  component="nav"
                  disablePadding={true}
                  className={classes.dropdownListWrap}
                  onClick={() => setTransitionDropdown(false)}
                >
                  {transitionOptions.map((option, index) => (
                    <DropdownHoverListItem
                      key={`create-playlist-transition-${index}`}
                      onClick={() => applyTransition(option)}
                    >
                      <DropdownHoverListItemText primary={option.label} />
                    </DropdownHoverListItem>
                  ))}
                </List>
              </Popup>
            </Grid>
            <Grid item className={classes.selectWrap}>
              <Popup
                open={durationDropdown}
                onOpen={() => {
                  setTransitionDropdown(false)
                }}
                onClose={() => setDurationDropdown(false)}
                trigger={
                  <WhiteButton className={classes.selectButton}>
                    {duration ? duration : 'HH:MM:SS'}
                    <KeyboardArrowDown />
                    {errors.duration && touched.duration && (
                      <Typography className={classes.errorMessage}>
                        {errors.duration}
                      </Typography>
                    )}
                  </WhiteButton>
                }
                contentStyle={{
                  width: 190,
                  height: 300,
                  borderRadius: 6,
                  animation: 'fade-in 500ms'
                }}
              >
                <List
                  component="nav"
                  disablePadding={true}
                  className={classes.dropdownListWrap}
                  onClick={() => setDurationDropdown(false)}
                >
                  {createDurationOptions()}
                </List>
              </Popup>
            </Grid>
            <Grid item>
              <CheckboxSwitcher
                label={t('Randomize')}
                switchBaseClass={classes.switchBaseClass}
                value={randomize}
                handleChange={val =>
                  handleValueChange('randomizePlaybackOrder', val)
                }
              />
            </Grid>
          </Grid>
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
