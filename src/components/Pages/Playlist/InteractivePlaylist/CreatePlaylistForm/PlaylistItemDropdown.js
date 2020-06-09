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
} from 'components/Dropdowns'
import {
  FormControlMultipleTimePicker,
  FormControlReactSelect
} from 'components/Form'

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

const interactionOptions = [
  { label: 'Swipe', value: 'swipe' },
  { label: 'Single tap', value: 'single-tap' },
  { label: 'Double tap', value: 'double-tap' },
  { label: 'Arrows', value: 'arrows' }
]

const PlaylistItemDropdown = ({
  t,
  classes,
  item: {
    interactionType = 'swipe',
    daypartStartTime: startTime = '00:00:00',
    daypartEndTime: endTime = '00:00:00'
  },
  onValueChange = f => f,
  onDelete = f => f
}) => {
  const [daypartStartTime, setDaypartStartTime] = useState(startTime)
  const [daypartEndTime, setDaypartEndTime] = useState(endTime)

  const [interaction, setInteraction] = useState(
    interactionOptions.find(({ value }) => value === interactionType)
  )

  const setDayPartTime = val => {
    setDaypartStartTime(val[0])
    setDaypartEndTime(val[1])
  }

  useEffect(
    () => {
      if (interaction) {
        onValueChange('interactionType', interaction.value)
      }
    },
    // eslint-disable-next-line
    [interaction]
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
            container: classes.settingsControlContainer
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
            primary={t('Interaction')}
            classes={{ primary: classes.settingItemText }}
          />
          <ListItemSecondaryAction className={classes.settingsControlWrap}>
            <FormControlReactSelect
              placeholder={t('Interaction')}
              value={interaction}
              handleChange={event => setInteraction(event.target)}
              options={interactionOptions}
              customClass={classes.borderlessSelect}
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
  withStyles(styles)(PlaylistItemDropdown)
)
