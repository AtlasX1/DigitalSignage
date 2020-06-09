import React, { useEffect, useState, useMemo } from 'react'
import update from 'immutability-helper'

import { translate } from 'react-i18next'

import { useDispatch, useSelector } from 'react-redux'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'

import Popup from 'components/Popup'
import { Card } from 'components/Card'
import { CircleIconButton, WhiteButton } from 'components/Buttons'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { TagChip } from 'components/Chip'
import { MediaActionDropdown } from 'components/Media'
import LibraryTypeIcon from 'components/LibraryTypeIcon'
import { Scrollbars } from 'components/Scrollbars'

import { secToLabel } from 'utils/secToLabel'
import { getTransitions } from 'actions/configActions'
import { FormControlReactSelect } from '../../../Form'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    root: {
      margin: '0 12px 15px',
      paddingBottom: 0,
      border: `5px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.background,
      borderRadius: '4px',
      height: 'calc(100% - 20px)',
      display: 'flex',
      flexDirection: 'column'
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
      flexGrow: 1
    },
    mediaItem: {
      padding: '0 12px',

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
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
    },
    footerActions: {
      padding: '8px 12px',
      borderTop: `1px solid ${palette[type].sideModal.content.border}`,
      background: palette[type].sideModal.action.background
    },
    selectWrap: {
      marginRight: '20px',
      width: 150
    },
    switchBaseClass: {
      height: '40px'
    },
    previewAction: {
      paddingTop: '9px',
      paddingBottom: '9px',
      borderColor: palette[type].sideModal.action.button.border,
      backgroundImage: palette[type].sideModal.action.button.background,
      boxShadow: 'none',
      ...typography.darkText[type]
    },
    transitionInputClass: {
      minWidth: 158,
      fontSize: 12,
      color: '#9394a0'
    },
    durationInputClass: {
      fontSize: 12,
      color: '#9394a0'
    },
    noMedia: {
      borderRadius: '4px',
      backgroundColor: '#fff9f0',
      fontSize: '14px',
      lineHeight: '65px',
      color: '#f5a623',
      textAlign: 'center'
    },
    noMediaIcon: {
      fontSize: '20px',
      color: '#f5a623'
    }
  }
}

const PlaylistItems = props => {
  const { t, classes, values, onChange } = props
  const { typography: themeTypography, type: themeType } = props.theme

  const dispatchAction = useDispatch()

  const [transitionsReducer] = useSelector(state => [state.config.transitions])

  const mediaList = values.media

  const [duration, setDuration] = useState('00:00:00')
  const [transition, setTransition] = useState(1)
  const [transitionOptions, setTransitionOptions] = useState([])
  const [durationOptions, setDurationOptions] = useState([])

  const formControlSelectStyles = useMemo(
    () => ({
      singleValue: { ...themeTypography.darkText[themeType] },
      option: { ...themeTypography.lightText[themeType] }
    }),
    [themeTypography, themeType]
  )

  // ---- effects

  useEffect(
    () => {
      setDurationOptions(createDurationOptions())

      if (!transitionsReducer.response.length) {
        dispatchAction(getTransitions())
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(() => {
    if (transitionsReducer.response) {
      setTransitionOptions(
        transitionsReducer.response.map(i => ({
          id: i.id,
          value: i.id,
          label: i.name
        }))
      )
    }
  }, [transitionsReducer])

  useEffect(
    () => {
      if (transition) {
        const newMediaList = mediaList
        newMediaList.forEach(i => (i.transitionId = transition))
        onChange('media', newMediaList)
      }
    },
    // eslint-disable-next-line
    [transition]
  )

  useEffect(
    () => {
      if (duration) {
        const newMediaList = mediaList
        newMediaList.forEach(i => (i.duration = duration))
        onChange('media', newMediaList)
      }
    },
    // eslint-disable-next-line
    [duration]
  )

  // ---- methods

  const createDurationOptions = () => {
    const options = []

    for (let i = 0; i <= 3600; i += 10) {
      options.push({
        value: secToLabel(i),
        label: secToLabel(i)
      })
    }

    return options
  }

  // Tags stuff
  const tags = ['A1', 'A2', 'A3', 'A4', 'A5', 'T4']
  const TagsButtonComponent = (
    <CircleIconButton className={classes.tagsIcon}>
      <i className="icon-tag-double-1" />
    </CircleIconButton>
  )

  const handleItemValueChange = (field, value, index) => {
    const item = mediaList[index]

    item[field] = value

    const updatedMediaList = update(mediaList, {
      [index]: { $set: item }
    })

    onChange('media', updatedMediaList)
  }

  const onMediaDelete = index => {
    const updatedMediaList = update(mediaList, {
      $splice: [[index, 1]]
    })

    onChange('media', updatedMediaList)
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
      title={t('Playlist Items').toUpperCase()}
      rootClassName={classes.root}
      headerClasses={[classes.header]}
      headerTextClasses={[classes.headerText]}
    >
      <Grid container className={classes.mediaItemsWrap}>
        <Scrollbars style={{ height: '100%' }}>
          {mediaList.map((media, index) => (
            <Grid
              item
              xs={12}
              key={`feature-${index}`}
              className={classes.mediaItem}
            >
              <Grid container justify="space-between">
                <Grid item xs={8}>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.indexNumber}>
                        {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <LibraryTypeIcon
                        type={media.type}
                        wrapHelperClass={classes.typeIconWrap}
                      />
                    </Grid>
                    <Grid item className={classes.mediaInfoWrap}>
                      <Typography className={classes.mediaTitle}>
                        {media.title}
                      </Typography>
                      <Typography className={classes.mediaDuration}>
                        {media.duration}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4} className={classes.rightSide}>
                  <Popup
                    position={
                      mediaList.length > 10 && index + 1 >= mediaList.length - 3
                        ? 'top right'
                        : 'bottom right'
                    }
                    trigger={TagsButtonComponent}
                    contentStyle={{
                      width: 315,
                      borderRadius: 6,
                      animation: 'fade-in 500ms'
                    }}
                  >
                    <Grid container className={classes.tagsList}>
                      {tags.map((tag, index) => (
                        <Grid item key={`tag-${index}`}>
                          <TagChip label={tag} />
                        </Grid>
                      ))}
                    </Grid>
                  </Popup>

                  <Popup
                    position={
                      mediaList.length > 10 && index + 1 >= mediaList.length - 3
                        ? 'top right'
                        : 'bottom right'
                    }
                    trigger={
                      <WhiteButton className={classes.mediaActionBtn}>
                        <Settings className={classes.mediaActionBtnIcon} />
                        <KeyboardArrowDown
                          className={classes.mediaActionBtnIcon}
                        />
                      </WhiteButton>
                    }
                    contentStyle={{
                      width: 275,
                      borderRadius: 6,
                      animation: 'fade-in 500ms'
                    }}
                  >
                    <MediaActionDropdown
                      transitionId={media.transitionId}
                      daypartStartTime={media.daypartStartTime}
                      daypartEndTime={media.daypartEndTime}
                      playtime={media.playtime}
                      transitions={
                        transitionsReducer.response &&
                        transitionsReducer.response.map(i => ({
                          id: i.id,
                          value: i.code,
                          label: i.name
                        }))
                      }
                      onValueChange={(f, v) =>
                        handleItemValueChange(f, v, index)
                      }
                      onDelete={() => onMediaDelete(index)}
                    />
                  </Popup>
                </Grid>
              </Grid>
            </Grid>
          ))}
          {!mediaList.length && (
            <Grid item xs={12}>
              <Typography className={classes.noMedia}>
                <i
                  className={`icon-interface-alert-triangle ${classes.noMediaIcon}`}
                />
                Add collection, select tags and build playlist to see media
                items
              </Typography>
            </Grid>
          )}
        </Scrollbars>
      </Grid>
      <Grid
        container
        className={classes.footerActions}
        justify="space-between"
        alignContent="center"
      >
        <Grid item>
          <Grid container>
            <Grid item className={classes.selectWrap} style={{ width: 200 }}>
              <FormControlReactSelect
                label=""
                placeholder={t('Select Transition')}
                marginBottom={0}
                value={transition}
                options={transitionOptions}
                handleChange={e => setTransition(e.target.value)}
                styles={formControlSelectStyles}
              />
            </Grid>
            <Grid item className={classes.selectWrap}>
              <FormControlReactSelect
                label=""
                placeholder="HH:MM:SS"
                marginBottom={false}
                value={duration}
                options={durationOptions}
                handleChange={e => setDuration(e.target.value)}
                styles={formControlSelectStyles}
              />
            </Grid>
            <Grid item>
              <CheckboxSwitcher
                label={t('Randomize')}
                switchBaseClass={classes.switchBaseClass}
                value={!!values.playlistMediaOrder}
                handleChange={val => {
                  if (val) {
                    onChange('playlistMediaOrder', 'random')
                  } else onChange('playlistMediaOrder', undefined)
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <WhiteButton className={classes.previewAction} disabled={true}>
            {t('Preview')}
          </WhiteButton>
        </Grid>
      </Grid>
    </Card>
  )
}

export default translate('translations')(
  withStyles(styles, { withTheme: true })(PlaylistItems)
)
