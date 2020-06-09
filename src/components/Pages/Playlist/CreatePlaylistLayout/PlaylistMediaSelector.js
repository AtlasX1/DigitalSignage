import React, { useState, useEffect, useMemo } from 'react'
import { withStyles, Grid, Tooltip, Typography } from '@material-ui/core'
import _get from 'lodash/get'
import Popup from 'components/Popup'

import { SingleIconTabs, SingleIconTab } from 'components/Tabs'
import { CircleIconButton } from 'components/Buttons'

import { useDispatch, useSelector } from 'react-redux'
import MediaList from './MediaList'
import PlaylistSearchForm from 'components/Pages/Playlist/PlaylistSearch'

import { getPlaylistById } from 'actions/playlistActions'

import { getConfigMediaCategory, getTransitions } from 'actions/configActions'
import { getMediaItemsAction } from 'actions/mediaActions'
import { getAllowedFeatureId } from 'utils/mediaUtils'

const TabIconStyles = () => ({
  tabIconWrap: {
    fontSize: '24px',
    lineHeight: '18px'
  },
  iconLabel: {
    fontWeight: 700,
    textTransform: 'none',
    color: 'inherit'
  }
})

const TabIcon = withStyles(TabIconStyles)(
  ({ iconClassName = '', classes, label = false, tooltip = false, title }) => {
    if (tooltip) {
      return (
        <Tooltip title={title}>
          <div className={classes.tabIconWrap}>
            <i className={iconClassName} />
          </div>
        </Tooltip>
      )
    } else {
      return (
        <Grid className={classes.tabIconWrap} container alignItems="center">
          <i className={iconClassName} />
          <Typography className={classes.iconLabel}>{title}</Typography>
        </Grid>
      )
    }
  }
)

const styles = theme => {
  const { palette, type } = theme
  return {
    tabHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: `1px solid ${palette[type].sideModal.tabs.header.border}`,
      borderBottom: `1px solid ${palette[type].sideModal.tabs.header.border}`,
      backgroundColor: palette[type].sideModal.tabs.header.background
    },
    moreIconsWrap: {
      display: 'flex',
      alignSelf: 'stretch',
      justifyContent: 'flex-end',
      margin: '0 5px 0 0'
    },
    moreIconWrap: {
      display: 'flex',
      alignItems: 'center'
    },
    moreIcon: {
      padding: '8px',
      color: '#afb7c7'
    },
    settingWrap: {
      marginLeft: '5px',
      paddingLeft: '5px',
      borderLeft: `solid 1px ${palette[type].sideModal.content.border}`
    },
    hidden: {
      display: 'none'
    },
    iconWithMargin: {
      marginRight: 15
    }
  }
}

const MediaListTabs = ({
  classes,
  tabName,
  playlistId,
  setLoading,
  media,
  setMedia
}) => {
  const [selectedTab, setSelectedTab] = useState('Text')
  const [icons, setIcons] = useState([])
  const [mediaLink, setMediaLink] = useState('')

  const dispatchAction = useDispatch()

  const [
    configMediaCategory,
    transitions,
    mediaReducer
  ] = useSelector(({ config, media }) => [
    config.configMediaCategory,
    config.transitions,
    media.library.response
  ])

  const handleTabChange = (event, selectedTab) => {
    setSelectedTab(selectedTab)
  }

  useEffect(() => {
    if (tabName && configMediaCategory.response.length) {
      const icons = configMediaCategory.response.find(i => i.name === tabName)
      const userIcons = _get(icons, 'feature')
      userIcons.length && setSelectedTab(userIcons[0].name)
      userIcons && setIcons(userIcons)
    }
  }, [tabName, configMediaCategory.response])

  useEffect(
    () => {
      const id = getAllowedFeatureId(configMediaCategory, tabName, selectedTab)

      if (id) {
        setLoading(true)
        dispatchAction(
          getMediaItemsAction({
            page: 1,
            limit: 10,
            featureId: id
          })
        )
      }
    },
    // eslint-disable-next-line
    [selectedTab, configMediaCategory]
  )

  useEffect(
    () => {
      setLoading(true)
      if (playlistId) {
        dispatchAction(getPlaylistById(playlistId))
      }
      if (!transitions.response.length) {
        // TODO: transitions only for simple playlists
        dispatchAction(getTransitions())
      }
      if (!configMediaCategory.response.length) {
        dispatchAction(getConfigMediaCategory())
      }
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (
        _get(mediaReducer, 'links') &&
        mediaReducer.links.firstPageUrl !== mediaLink
      ) {
        setMedia(mediaReducer.data)
        setMediaLink(mediaReducer.links.firstPageUrl)
      }
      setLoading(false)
    },
    // eslint-disable-next-line
    [mediaReducer]
  )

  const ShowMoreButtonComponent = useMemo(
    () => (
      <CircleIconButton className={classes.moreIcon}>
        <i className="icon-navigation-show-more-vertical" />
      </CircleIconButton>
    ),
    [classes.moreIcon]
  )
  const SettingsButtonComponent = useMemo(
    () => (
      <CircleIconButton className={classes.moreIcon}>
        <i className="icon-settings-1" />
      </CircleIconButton>
    ),
    [classes.moreIcon]
  )

  return (
    <>
      <header className={classes.tabHeader}>
        <SingleIconTabs value={selectedTab} onChange={handleTabChange}>
          {!!icons.length &&
            icons.map((icon, index) => {
              if (index > 5) {
                return (
                  <SingleIconTab
                    className={classes.hidden}
                    value={icon.name}
                    key={index}
                  />
                )
              } else {
                return (
                  <SingleIconTab
                    icon={
                      <TabIcon
                        iconClassName={
                          icon.name === 'Instagram'
                            ? 'icon-focus-face'
                            : icon.icon
                        }
                        title={icon.alias}
                        tooltip
                      />
                    }
                    disableRipple={true}
                    value={icon.name}
                    key={index}
                  />
                )
              }
            })}
        </SingleIconTabs>

        <div className={classes.moreIconsWrap}>
          {!!icons.length && icons.length > 6 && (
            <div className={classes.moreIconWrap}>
              <Popup
                trigger={ShowMoreButtonComponent}
                contentStyle={{
                  padding: 15,
                  animation: 'fade-in 200ms'
                }}
              >
                <Grid container direction="column" alignItems="center">
                  {icons.slice(6).map((icon, index) => (
                    <Grid key={index} item container alignItems="center">
                      <SingleIconTab
                        icon={
                          <TabIcon
                            iconClassName={[
                              icon.icon,
                              classes.iconWithMargin
                            ].join(' ')}
                            title={icon.alias}
                            label
                          />
                        }
                        disableRipple={true}
                        value={icon.name}
                        onClick={e => handleTabChange(e, icon.name)}
                        selected={selectedTab === icon.name}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Popup>
            </div>
          )}
          <div
            className={[classes.settingWrap, classes.moreIconWrap].join(' ')}
          >
            <Popup
              position="bottom right"
              trigger={SettingsButtonComponent}
              contentStyle={{
                borderRadius: 6,
                width: 315,
                animation: 'fade-in 200ms'
              }}
            >
              <PlaylistSearchForm />
            </Popup>
          </div>
        </div>
      </header>
      <div className={classes.mediaWrap}>
        <MediaList media={media} />
      </div>
    </>
  )
}

export default withStyles(styles)(MediaListTabs)
