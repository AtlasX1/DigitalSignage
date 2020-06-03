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
  FormControlCustomSelect,
  FormControlCounter
} from '../Form'
import { labelToSec } from '../../utils/secToLabel'

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
    container11: {
      zIndex: 11
    },
    container111: {
      zIndex: 111
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
    transitionInputClass: {
      border: 'none',
      boxShadow: 'none',
      color: '#494949',
      fontSize: 12,
      fontWight: 400,
      letterSpacing: '-0.01px',
      paddingRight: 0,
      background: 'transparent',

      '&:hover': {
        background: 'transparent',
        color: '#494949'
      }
    },
    transitionInputIconClass: {
      color: '#afb0b1'
    },
    settingsControlWrap: {
      transform: 'none',
      top: 'auto'
    }
  }
}

const MediaActionDropdown = ({
  t,
  classes,
  transitionId = 0,
  playtime = 0,
  dayparttime = ['00:00:00', '00:00:00'],
  onValueChange = f => f,
  onDelete = f => f,
  transitions
}) => {
  const [playtimeValue, setPlaytimeValue] = useState(playtime)
  const [daypartTime, setDaypartTime] = useState([
    labelToSec(dayparttime[0]),
    labelToSec(dayparttime[1])
  ])
  const [transition, setTransition] = useState(
    transitions ? transitions.find(i => i.id === transitionId) : null
  )
  const [transitionDropdown, setTransitionDropdown] = useState(false)

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

  useEffect(
    () => {
      if (transition) {
        onValueChange('transition', transition)
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
      if (daypartTime) {
        onValueChange('dayparttime', daypartTime)
      }
    },
    // eslint-disable-next-line
    [daypartTime]
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
            container: [
              !transitionDropdown ? classes.container111 : '',
              classes.settingsControlContainer
            ].join(' ')
          }}
        >
          <ListItemText
            primary={t('Play Time')}
            classes={{ primary: classes.settingItemText }}
          />
          <ListItemSecondaryAction className={classes.settingsControlWrap}>
            <FormControlMultipleTimePicker
              small
              fromValue={daypartTime[0]}
              toValue={daypartTime[1]}
              onChange={setDaypartTime}
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
        <ListItem
          className={classes.settingItem}
          classes={{
            container: [
              classes.container11,
              classes.settingsControlContainer
            ].join(' ')
          }}
        >
          <ListItemText
            primary={t('Transition')}
            classes={{ primary: classes.settingItemText }}
          />
          <ListItemSecondaryAction className={classes.settingsControlWrap}>
            <FormControlCustomSelect
              placeholder={t('Select Transition')}
              value={transition}
              options={transitions ? transitions : transitionOptions}
              handleChange={setTransition}
              inputClassName={classes.transitionInputClass}
              inputIconClassName={classes.transitionInputIconClass}
              disableRipple
              dropdownPosition="bottom right"
              onOpen={() => setTransitionDropdown(true)}
              onClose={() => setTransitionDropdown(false)}
            />
          </ListItemSecondaryAction>
        </ListItem>
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
