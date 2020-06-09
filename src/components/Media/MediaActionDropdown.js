import React, { useState, useEffect } from 'react'
import { translate } from 'react-i18next'

import {
  withStyles,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core'

import {
  DropdownHoverListItem,
  DropdownHoverListItemIcon,
  DropdownHoverListItemText
} from '../Dropdowns'
import {
  FormControlMultipleTimePicker,
  FormControlReactSelect,
  FormControlCounter
} from '../Form'

const styles = theme => {
  const { palette, type } = theme
  return {
    settingsControls: {
      padding: '0 10px'
    },
    settingsControlContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    container1: {
      zIndex: 1
    },
    settingItem: {
      padding: 0,
      borderBottom: `solid 1px ${palette[type].sideModal.content.border}`
    },
    settingItemText: {
      fontSize: '13px',
      lineHeight: '42px',
      color: '#74809a'
    },
    playtimeValue: {
      fontSize: 12
    },
    settingsControlWrap: {
      minWidth: '154px',
      transform: 'none',
      top: 'auto'
    },
    borderlessSelect: {
      '& > div': {
        border: 'none'
      }
    }
  }
}

const MediaActionDropdown = ({
  t,
  classes,
  transitionId = 0,
  playtime = 1,
  daypartStartTime: startTime = '00:00:00',
  daypartEndTime: endTime = '00:00:00',
  onValueChange = f => f,
  onDelete = f => f,
  transitions,
  options = {
    disableTransition: false
  }
}) => {
  const [playtimeValue, setPlaytimeValue] = useState(playtime)
  const [daypartStartTime, setDaypartStartTime] = useState(startTime)
  const [daypartEndTime, setDaypartEndTime] = useState(endTime)

  const [transition, setTransition] = useState(
    transitions ? transitions.find(i => i.id === transitionId) : null
  )

  const transitionOptions = [
    { value: 'noTransition', label: t('No Transition') },
    { value: 'random', label: t('Random') },
    { value: 'fall', label: t('Fall') },
    { value: 'roomToLeft', label: t('Room to Left') },
    { value: 'roomToRight', label: t('Room to Right') },
    { value: 'roomToTop', label: t('Room to Top') },
    { value: 'roomToBottom', label: t('Room to Bottom') },
    { value: 'slideLeft', label: t('Slide Left') },
    { value: 'slideRight', label: t('Slide Right') },
    { value: 'sideTop', label: t('Slide Top') },
    { value: 'slideBottom', label: t('Slide Bottom') },
    { value: 'scaleDownFromRight', label: t('Scale Down/From Right') },
    { value: 'scaleDownFromLeft', label: t('Scale Down/From Left') },
    { value: 'scaleDownFromBottom', label: t('Scale Down/From Bottom') },
    { value: 'scaleDownFromTop', label: t('Scale Down/From Top') },
    { value: 'scaleDownScaleUp', label: t('Scale Down/Scale Up') },
    { value: 'flipRight', label: t('Flip Right') },
    { value: 'flipLeft', label: t('Flip Left') },
    { value: 'flipTop', label: t('Flip Top') },
    { value: 'flipBottom', label: t('Flip Bottom') },
    { value: 'carouselLeft', label: t('Carousel Left') },
    { value: 'carouselRight', label: t('Carousel Right') },
    { value: 'carouselTop', label: t('Carousel Top') },
    { value: 'carouselBottom', label: t('Carousel Bottom') },
    { value: 'fade', label: t('Fade') }
  ]

  const setDayPartTime = val => {
    setDaypartStartTime(val[0])
    setDaypartEndTime(val[1])
  }

  useEffect(
    () => {
      if (transition) {
        onValueChange('transitionId', transition.id)
      }
    },
    // eslint-disable-next-line
    [transition]
  )

  useEffect(
    () => {
      if (playtimeValue) {
        onValueChange('playtime', playtimeValue)
      }
    },
    // eslint-disable-next-line
    [playtimeValue]
  )

  useEffect(
    () => {
      if (daypartStartTime) {
        onValueChange('daypartStartTime', daypartStartTime)
      }
    },
    // eslint-disable-next-line
    [daypartStartTime]
  )

  useEffect(
    () => {
      if (daypartEndTime) {
        onValueChange('daypartEndTime', daypartEndTime)
      }
    },
    // eslint-disable-next-line
    [daypartEndTime]
  )

  return (
    <div className={classes.root}>
      <List
        component="nav"
        disablePadding={true}
        className={classes.settingsControls}
      >
        <ListItem
          className={classes.settingItem}
          classes={{
            container: [classes.settingsControlContainer].join(' ')
          }}
        >
          <ListItemText
            primary={t('Play Time')}
            classes={{ primary: classes.settingItemText }}
          />
          <ListItemSecondaryAction className={classes.settingsControlWrap}>
            <FormControlMultipleTimePicker
              small
              fromValue={daypartStartTime}
              toValue={daypartEndTime}
              onChange={setDayPartTime}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem className={classes.settingItem}>
          <ListItemText
            primary={t('Repetition')}
            classes={{ primary: classes.settingItemText }}
          />
          <ListItemSecondaryAction>
            <FormControlCounter
              value={playtimeValue}
              onChange={val => setPlaytimeValue(val)}
              inputValueClassName={classes.playtimeValue}
            />
          </ListItemSecondaryAction>
        </ListItem>
        {!options.disableTransition && (
          <ListItem
            className={classes.settingItem}
            classes={{
              container: [
                classes.container1,
                classes.settingsControlContainer
              ].join(' ')
            }}
          >
            <ListItemText
              primary={t('Transition')}
              classes={{ primary: classes.settingItemText }}
            />
            <ListItemSecondaryAction className={classes.settingsControlWrap}>
              <FormControlReactSelect
                placeholder={t('Select Transition')}
                value={transition}
                handleChange={event => setTransition(event.target)}
                options={transitions ? transitions : transitionOptions}
                customClass={classes.borderlessSelect}
              />
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
      <List component="nav" disablePadding={true}>
        <Divider />
        <DropdownHoverListItem>
          <DropdownHoverListItemIcon>
            <i className="icon-bin" />
          </DropdownHoverListItemIcon>
          <DropdownHoverListItemText
            primary={t('Delete Media action')}
            onClick={onDelete}
          />
        </DropdownHoverListItem>
      </List>
    </div>
  )
}

export default translate('translations')(
  withStyles(styles)(MediaActionDropdown)
)
