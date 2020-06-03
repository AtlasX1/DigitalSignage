import React, { useState, useEffect } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core'
import {
  Warning,
  TouchApp,
  PlaylistAdd,
  LibraryBooks,
  FontDownload,
  Subscriptions
} from '@material-ui/icons'
import NavigationLink from './NavigationLink'

import { roles } from 'utils/index'
import routeByName from 'constants/routes'
import { ANNOUNCEMENT, HTML_CONTENT } from 'constants/library'
import featureConstants from 'constants/featureConstants'

const {
  Feeds,
  RSSFeed,
  DemoFeeds,
  MediaRSS,
  LicensedChannels,
  YouTube,
  Radio,
  CustomWidget
} = featureConstants

const styles = () => ({
  navigation: {
    display: 'flex',
    alignItems: 'stretch'
  }
})

const Navigation = ({ t, classes, detailsReducer }) => {
  const [role, setRole] = useState({})

  useEffect(() => {
    if (detailsReducer.response) {
      setRole(roles.parse(detailsReducer.response.role))
    }
  }, [detailsReducer])

  const navigationStructure = [
    {
      url: '/devices',
      color: '#00bceb',
      linkIconClassName: 'icon-computer-screen-1',
      linkText: t('Devices menu item'),
      menuItems: [
        {
          linkTo: `/${role.role}/device-library/list/add-device`,
          label: t('Add Device'),
          iconClassName: 'icon-add-circle-1',
          render: role.system
        },
        {
          linkTo: `/${role.role}/device-library/list`,
          label: t('Device Library'),
          iconClassName: 'icon-book-shelf'
        },
        {
          render: false, // Hide the page until further notice
          linkTo: `/${role.role}/channels-library`,
          label: t('Channels'),
          iconClassName: 'icon-list-bullets-2'
        }
      ]
    },
    {
      url: '/media',
      color: '#ff3d84',
      linkIconClassName: 'icon-files-landscape-video',
      linkText: t('Media menu item'),
      menuItems: [
        {
          linkTo: '/media-library/media/add/general',
          label: t('Add Media'),
          iconClassName: 'icon-add-circle-1'
        },
        {
          linkTo: '/design-gallery',
          label: t('Design Gallery'),
          iconClassName: 'icon-paint-palette'
        },
        {
          linkTo: '/media-library',
          label: t('Media Library'),
          iconClassName: 'icon-book-shelf'
        },
        // { linkTo: '/media-library/groups', label: t('Media Groups'), icon: Folder },
        {
          linkTo: '/font-library',
          label: t('Font Library'),
          icon: FontDownload
        },
        {
          linkTo: routeByName[RSSFeed].root,
          label: t('RSS Feeds'),
          iconClassName: 'icon-share-rss-feed',
          render: role.system
        },
        {
          linkTo: routeByName[Feeds].root,
          label: t('Feeds'),
          iconClassName: 'icon-share-rss-feed',
          render: role.system
        },
        {
          linkTo: routeByName[DemoFeeds].root,
          label: t('Demo Feeds'),
          iconClassName: 'icon-share-rss-feed',
          render: role.system
        },
        {
          linkTo: routeByName[HTML_CONTENT].root,
          label: t('HTML Content'),
          iconClassName: 'icon-programming-html',
          render: role.system
        },
        {
          linkTo: routeByName[MediaRSS].root,
          label: t('Media RSS Channels'),
          iconClassName: 'icon-files-landscape-video-1',
          render: role.system
        },
        {
          linkTo: routeByName[LicensedChannels].root,
          label: t('Licensed Channels'),
          iconClassName: 'icon-tag-lock',
          render: role.system
        },
        {
          linkTo: routeByName.workplacePoster.root,
          label: t('Workplace Posters'),
          iconClassName: 'icon-picture-layer-2',
          render: role.system
        },
        {
          linkTo: routeByName[YouTube].root,
          label: t('YouTube Channels'),
          iconClassName: 'icon-programming-video-1',
          render: role.system
        },
        {
          linkTo: routeByName[Radio].root,
          label: t('Radio Stations'),
          iconClassName: 'icon-radio-2',
          render: role.system
        },
        {
          linkTo: routeByName[CustomWidget].root,
          label: t('Custom Widgets'),
          iconClassName: 'icon-paint-palette',
          render: role.system
        },
        {
          linkTo: routeByName[ANNOUNCEMENT].root,
          label: t('Announcements Library'),
          icon: LibraryBooks,
          render: role.system
        }
      ]
    },
    {
      url: '/playlist',
      color: '#4a82ee',
      linkIconClassName: 'icon-playlist-2',
      linkText: t('Playlists menu item'),
      render: role.org,
      menuItems: [
        {
          linkTo: '/playlist-library/create/',
          label: t('Create Playlist'),
          icon: PlaylistAdd
        },
        {
          linkTo: '/playlist-library/smart-playlist',
          label: t('Smart Playlist'),
          iconClassName: 'icon-lightbulb-4'
        },
        {
          linkTo: '',
          label: t('Interactive Playlist'),
          icon: TouchApp
        },
        {
          linkTo: '/playlist-library',
          label: t('Playlist Library'),
          icon: Subscriptions
        }
        // { linkTo: '/playlist-library/groups', label: t('Playlist Groups'), iconClassName: 'icon-playlist-3' },
      ]
    },
    {
      url: '/template',
      color: '#c077fd',
      linkIconClassName: 'icon-content-view-agenda',
      linkText: t('Templates menu item'),
      render: role.org,
      menuItems: [
        {
          linkTo: '/template-library/list/create-template',
          label: t('Create Template'),
          iconClassName: 'icon-add-circle-1'
        },
        {
          linkTo: '/template-library/list',
          label: t('Template Library'),
          iconClassName: 'icon-book-shelf'
        }
        // { linkTo: '/template-library/list/groups', label: t('Template Groups'), iconClassName: 'icon-picture-layer-2' },
      ]
    },
    {
      url: '/publish',
      color: '#50e3c2',
      linkIconClassName: 'icon-cloud-downloading-2',
      linkText: t('Publish menu item'),
      render: role.org,
      menuItems: [
        {
          linkTo: '/schedule-library/schedule-publish',
          label: t('Schedule & Publish'),
          iconClassName: 'icon-calendar-timeout'
        },
        {
          linkTo: '/schedule-library',
          label: t('Schedule Library'),
          iconClassName: 'icon-book-shelf'
        },
        {
          linkTo: '/schedule-timeline',
          label: t('Schedule Timeline'),
          iconClassName: 'icon-list-bullets-2'
        }
        // { linkTo: '/schedule-library/groups', label: t('Schedule Groups'), icon: VerticalSplit },
      ]
    },
    {
      url: '/controls',
      color: '#ff833d',
      linkIconClassName: 'icon-slider-2',
      linkText: t('Controls menu item'),
      render: role.system,
      menuItems: [
        {
          linkTo: '',
          label: t('Queue Library'),
          iconClassName: 'icon-book-shelf'
        },
        { linkTo: '', label: t('Alert System'), icon: Warning }
      ]
    },
    {
      url: '/reports',
      color: '#535d73',
      linkIconClassName: 'icon-content-note',
      linkText: t('Reports menu item'),
      menuItems: [
        {
          linkTo: '/custom-reports/generate',
          label: t('Create Report'),
          iconClassName: 'icon-rewards-gift'
        },
        {
          linkTo: '/report-library',
          label: t('Reports Library'),
          iconClassName: 'icon-user-group-conversation'
        }
      ]
    }
  ]

  return (
    <nav className={classes.navigation}>
      {navigationStructure
        .filter(item => (item.hasOwnProperty('render') ? item.render : true))
        .map((item, index) => (
          <NavigationLink key={`${item.linkText}-${index}`} {...item} />
        ))}
    </nav>
  )
}

const mapStateToProps = ({ user }) => ({
  detailsReducer: user.details
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(Navigation))
)
