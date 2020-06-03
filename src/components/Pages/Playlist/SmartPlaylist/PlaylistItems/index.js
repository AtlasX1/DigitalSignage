import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'

import Popup from 'components/Popup'
import { Card } from 'components/Card'
import { CircleIconButton, WhiteButton } from 'components/Buttons'
import { FormControlCustomSelect } from 'components/Form'
import { CheckboxSwitcher } from 'components/Checkboxes'
import { TagChip } from 'components/Chip'
import { MediaActionDropdown } from 'components/Media'
import UploadPlaylistFiles from './UploadPlaylistFiles'
import LibraryTypeIcon from 'components/LibraryTypeIcon'

import { secToLabel } from 'utils/secToLabel'
import { Scrollbars } from 'components/Scrollbars'

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
      height: '370px'
    },
    mediaItem: {
      padding: '0 12px',

      '&:not(:last-child)': {
        borderBottom: `1px solid ${palette[type].sideModal.content.border}`
      }
    },
    indexNumber: {
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '70px',
      color: palette[type].sideModal.tabs.item.titleColor
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
      fontSize: '14px',
      fontWeight: 'bold',
      lineHeight: '18px',
      color: palette[type].sideModal.tabs.item.titleColor,
      maxWidth: '25ch',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    mediaDuration: {
      fontSize: '14px',
      lineHeight: '18px',
      color: palette[type].sideModal.tabs.item.titleColor
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
      marginRight: '20px'
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
      color: palette[type].sideModal.action.button.color
    },
    transitionInputClass: {
      minWidth: 158,
      fontSize: 12,
      color: '#9394a0'
    },
    durationInputClass: {
      fontSize: 12,
      color: '#9394a0'
    }
  }
}

const PlaylistItems = ({ t, classes, media: mediaList }) => {
  const [transition, setTransition] = useState(null)
  const [duration, setDuration] = useState(0)

  const [transitionDropdown, setTransitionDropdown] = useState(false)
  const [durationDropdown, setDurationDropdown] = useState(false)

  const [durationOptions, setDurationOptions] = useState([])

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
    { value: 'slideTop', label: t('Slide Top') },
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

  useEffect(() => {
    setDurationOptions(createDurationOptions())
  }, [])

  const createDurationOptions = () => {
    const options = []

    for (let i = 10; i <= 3600; i += 10) {
      options.push({
        value: i,
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
        <Scrollbars style={{ height: '370px' }}>
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
                    position="bottom right"
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
                    position="bottom right"
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
                    <MediaActionDropdown />
                  </Popup>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <UploadPlaylistFiles
              hidden={mediaList.length > 0}
              containerHeight={
                mediaList.length > 4 ? undefined : 315 - mediaList.length * 70
              }
            />
          </Grid>
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
            <Grid item className={classes.selectWrap}>
              <FormControlCustomSelect
                placeholder={t('Select Transition')}
                value={transition}
                options={transitionOptions}
                handleChange={setTransition}
                inputClassName={classes.transitionInputClass}
                customOpen={transitionDropdown}
                onOpen={() => {
                  setDurationDropdown(false)
                  setTransitionDropdown(true)
                }}
                onClose={() => setTransitionDropdown(false)}
              />
            </Grid>
            <Grid item className={classes.selectWrap}>
              <FormControlCustomSelect
                placeholder="HH:MM:SS"
                value={duration}
                options={durationOptions}
                handleChange={setDuration}
                inputClassName={classes.durationInputClass}
                customOpen={durationDropdown}
                onOpen={() => {
                  setTransitionDropdown(false)
                  setDurationDropdown(true)
                }}
                onClose={() => setDurationDropdown(false)}
              />
            </Grid>
            <Grid item>
              <CheckboxSwitcher
                label={t('Randomize')}
                switchBaseClass={classes.switchBaseClass}
              />
            </Grid>
          </Grid>
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

export default translate('translations')(withStyles(styles)(PlaylistItems))
