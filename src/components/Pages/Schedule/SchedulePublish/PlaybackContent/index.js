import React, { useEffect, useState, useCallback, useMemo } from 'react'

import { translate } from 'react-i18next'
import update from 'immutability-helper'
import {
  isEqual as _isEqual,
  cloneDeep as _cloneDeep,
  get as _get
} from 'lodash'

import { useDispatch, useSelector } from 'react-redux'

import { useDrop } from 'react-dnd'

import { withStyles, Grid } from '@material-ui/core'

import { dndConstants } from 'constants/index'
import { distinctFilter } from 'utils'

import { Card } from 'components/Card'
import { WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { UploadPlaylistFiles } from 'components/Dropdones'
import FormControlReactSelect from 'components/Form/FormControlReactSelect'

import PlaybackItem from './PlaybackItem'

import { labelToSec, secToLabel } from 'utils/secToLabel'
import { getTransitions } from 'actions/configActions'

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
      paddingTop: '9px',
      paddingBottom: '9px',
      borderColor: palette[type].sideModal.groups.button.border,
      backgroundImage: palette[type].sideModal.groups.button.background,
      boxShadow: 'none',
      color: palette[type].sideModal.groups.button.color,

      '&:hover': {
        color: palette[type].sideModal.groups.button.color
      }
    },
    dropdownListWrap: {
      width: '100%',
      height: '100%',
      overflow: 'auto'
    },
    playbackContentWrap: {
      maxHeight: 'calc(100% - 16px)',
      display: 'flex',
      flexDirection: 'column'
    },
    selectWrapTransition: {
      width: 200
    },
    selectWrapDuration: {
      width: 115
    }
  }
}

const PlaybackContent = ({
  t,
  classes,
  handleValueChange = (f, v) => {},
  values,
  type,
  getMediaItem,
  theme
}) => {
  const { typography: themeTypography, type: themeType } = theme

  const dispatchAction = useDispatch()

  const [transitions, scheduleReducer] = useSelector(state => [
    state.config.transitions,
    state.schedule.scheduleItem
  ])

  const [duration, setDuration] = useState(0)
  const [items, setItems] = useState(_cloneDeep(values.scheduleContent))
  const [transition, setTransition] = useState(1)

  const [, drop] = useDrop({
    accept: dndConstants.schedulePublishItemTypes.PLAYLIST_ITEM
  })

  const formControlSelectStyles = useMemo(
    () => ({
      singleValue: { ...themeTypography.darkText[themeType] },
      option: { ...themeTypography.lightText[themeType] }
    }),
    [themeTypography, themeType]
  )

  const createDurationOptions = () => {
    let options = []

    for (let i = 0; i <= 3600; i += 10) {
      options.push({
        label: secToLabel(i),
        value: i
      })
    }

    return options
  }

  const addItem = useCallback(
    (item, atIndex, uid) => {
      if (!item.playbackContent) {
        item.playbackContent =
          type === 'media'
            ? 'Media'
            : type === 'template'
            ? 'Template'
            : 'Playlist'
      }

      const newItem = update(item, {
        uid: { $set: uid }
      })

      const updatedItems =
        atIndex !== undefined
          ? update(items, {
              $splice: [[atIndex, 0, newItem]]
            })
          : update(items, { $push: [newItem] })

      setItems(distinctFilter.filterByField(updatedItems, 'uid'))
    },
    [items, type]
  )

  const saveItem = useCallback(
    (item, uid) => {
      if (!item.playbackContent) {
        item.playbackContent =
          type === 'media'
            ? 'Media'
            : type === 'template'
            ? 'Template'
            : 'Playlist'
      }

      const wasTemporaryAdded = items.some(({ uid }) => item.uid === uid)
      const updatedItems = wasTemporaryAdded
        ? items.map(oldItem =>
            oldItem.uid === item.uid ? { ...oldItem, uid } : oldItem
          )
        : update(items, { $push: [{ ...item, uid }] })

      setItems(distinctFilter.filterByField(updatedItems, 'uid'))
    },
    [items, type]
  )

  const deleteItem = useCallback(
    index => () => {
      setItems(
        update(items, {
          $splice: [[index, 1]]
        })
      )
    },
    [items]
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
        setItems(
          update(items, {
            $splice: [
              [index, 1],
              [atIndex, 0, item]
            ]
          })
        )
      }
    },
    [items, addItem, findItem, getMediaItem]
  )

  const applyTransition = useCallback(
    transitionId => {
      const newItems = update(items, {
        $apply: items =>
          items.map(item =>
            update(item, { transitionId: { $set: transitionId } })
          )
      })
      setItems(newItems)
      setTransition(transitionId)
    },
    [items]
  )

  const applyDuration = useCallback(
    duration => {
      const newItems = update(items, {
        $apply: items =>
          items.map(item =>
            update(item, { duration: { $set: secToLabel(duration) } })
          )
      })
      setItems(newItems)
      setDuration(duration)
    },
    [items]
  )

  const handleItemValueChange = useCallback(
    index => (field, value) => {
      const item = items[index]

      item[field] = value

      const updatedMediaList = update(items, {
        [index]: { $set: item }
      })

      setItems(updatedMediaList)
    },
    [items]
  )

  useEffect(
    () => {
      if (!transitions.response.length) {
        dispatchAction(getTransitions())
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (scheduleReducer.response) {
        const { scheduleContent } = scheduleReducer.response
        setItems(
          scheduleContent.map(i => ({
            ...i,
            id: i.playbackContentId,
            title: i.playbackContentModel.title,
            playtime: i.repeatTime < 1 ? 1 : i.repeatTime
          }))
        )
      }
    },
    // eslint-disable-next-line
    [scheduleReducer.response]
  )

  useEffect(
    () => {
      if (!_isEqual(items, values.scheduleContent)) {
        handleValueChange('scheduleContent', items)
      }
    },
    // eslint-disable-next-line
    [items]
  )

  useEffect(
    () => {
      _get(values, ['scheduleContent', '0', 'duration']) &&
        setDuration(
          labelToSec(_get(values, ['scheduleContent', '0', 'duration']))
        )
      _get(values, ['scheduleContent', '0', 'transition']) &&
        setTransition(_get(values, ['scheduleContent', '0', 'transition']))
    },
    // eslint-disable-next-line
    [values.scheduleContent]
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
      title={t('Playback Content').toUpperCase()}
      rootClassName={classes.root}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
      classes={{
        root: classes.playbackContentWrap
      }}
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
              key={item.uid}
              item={item}
              findItem={findItem}
              moveItem={moveItem}
              saveItem={saveItem}
              onDelete={() => deleteItem(index)}
              handleItemValueChange={handleItemValueChange(index)}
            />
          ))}
          <Grid item xs={12}>
            <UploadPlaylistFiles
              accept={dndConstants.schedulePublishItemTypes.MEDIA_ITEM}
              getMediaItem={getMediaItem}
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
        <Grid item className={classes.selectWrapTransition}>
          <FormControlReactSelect
            label={''}
            fullWidth={true}
            marginBottom={0}
            value={transition}
            options={transitions.response.map(transition => ({
              label: transition.name,
              value: transition.id
            }))}
            handleChange={e => applyTransition(e.target.value)}
            styles={formControlSelectStyles}
          />
        </Grid>
        <Grid item className={classes.selectWrapDuration}>
          <FormControlReactSelect
            label={''}
            marginBottom={0}
            fullWidth={true}
            value={duration}
            options={createDurationOptions()}
            handleChange={e => applyDuration(e.target.value)}
            styles={formControlSelectStyles}
          />
        </Grid>
        <Grid item>
          <CheckboxSwitcher
            label={t('Randomize')}
            switchBaseClass={classes.switchBaseClass}
            value={values.randomizePlaybackOrder}
            handleChange={val =>
              handleValueChange('randomizePlaybackOrder', val)
            }
          />
        </Grid>
        <Grid item>
          <WhiteButton className={classes.previewAction} disabled>
            {t('Preview')}
          </WhiteButton>
        </Grid>
      </Grid>
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles, { withTheme: true })(PlaybackContent)
)
