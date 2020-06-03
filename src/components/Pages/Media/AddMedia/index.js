import React, { useEffect, useState, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import WebFontLoader from '@dr-kobros/react-webfont-loader'

import { withStyles } from '@material-ui/core'

import { SideModal } from 'components/Modal'
import { SideTabs, SideTab, TabIcon } from 'components/Tabs'
import {
  AddMediaGeneralTab,
  AddMediaWebTab,
  AddMediaLocalTab,
  AddMediaGalleryTab,
  AddMediaSocialTab,
  AddMediaPremiumTab,
  AddMediaLicensedTab,
  AddMediaKioskTab,
  AddMediaCustomTab
} from './Tabs'
import { getMediaGroupsAction } from 'actions/mediaActions'
import { getItems } from 'actions/tagsActions'
import { getConfigMediaCategory } from 'actions/configActions'

const styles = theme => ({
  root: {
    display: 'flex',
    overflow: 'auto'
  },
  addMediaContent: {
    width: '100%'
  },
  addMediaTabsWrap: {
    borderRight: `1px solid ${
      theme.palette[theme.type].sideModal.content.border
    }`
  }
})
const webFontLoaderConfig = {
  google: {
    families: [
      'Arial',
      'Courier New',
      'Times New Roman',
      'Georgia',
      'Alegreya Sans SC',
      'Coiny',
      'Indie Flower',
      'Kanit',
      'Kite One',
      'Lobster',
      'Montserrat',
      'Pacifico',
      'Poppins',
      'Rasa'
    ]
  },
  events: false,
  classes: false
}

const AddMedia = ({
  t,
  classes,
  match,
  getMediaGroupsAction,
  getTags,
  tags,
  groups,
  configMediaCategory,
  getConfigMediaCategory
}) => {
  const { mode: mediaMode, currentTab } = match.params
  const isEditMode = mediaMode === 'edit'

  const [selectedTab, setSelectedTab] = useState('general')
  const handleChange = useCallback(
    (event, tab) => {
      setSelectedTab(tab)
    },
    [setSelectedTab]
  )

  const leftSidebarTabs = useMemo(() => {
    const tabs = [
      {
        name: 'favorites',
        icon: 'icon-vote-heart-favorite-star',
        label: 'Favorite Tab'
      },
      { name: 'general', icon: 'icon-file-copy', label: 'General Tab' },
      { name: 'local', icon: 'icon-close-bubble', label: 'Local Tab' },
      { name: 'web', icon: 'icon-world-wide-web', label: 'Web Tab' },
      { name: 'gallery', icon: 'icon-sheriff-star', label: 'Gallery Tab' },
      { name: 'social', icon: 'icon-pet-dog', label: 'Social Tab' },
      { name: 'premium', icon: 'icon-user-business-man', label: 'Premium Tab' },
      {
        name: 'licensed',
        icon: 'icon-romance-marriage-license',
        label: 'Licensed Tab'
      },
      { name: 'kiosk', icon: 'icon-hurricane-1', label: 'Kiosk Tab' },
      { name: 'custom', icon: 'icon-cog-play', label: 'Custom Tab' }
    ]

    return tabs.map(tab => {
      const { name, icon, label } = tab
      return (
        <SideTab
          key={name}
          disabled={isEditMode && selectedTab !== name}
          disableRipple={true}
          icon={<TabIcon iconClassName={icon} />}
          component={Link}
          label={t(label)}
          value={name}
          to={`/media-library/media/${mediaMode}/${name}`}
        />
      )
    })
  }, [t, isEditMode, mediaMode, selectedTab])

  useEffect(() => {
    if (!groups.response) {
      getMediaGroupsAction({
        limit: 9999
      })
    }

    if (!configMediaCategory.response || !configMediaCategory.response.length) {
      getConfigMediaCategory()
    }

    if (!tags.response.length) {
      getTags({ limit: 9999 })
    }
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (currentTab) {
      setSelectedTab(currentTab)
    }
  }, [currentTab, setSelectedTab])

  useEffect(() => {
    if (tags.meta.count < tags.meta.total) {
      getTags({ limit: tags.meta.total })
    }
  }, [tags, getTags])

  return (
    <WebFontLoader config={webFontLoaderConfig}>
      <SideModal
        width="89%"
        title={isEditMode ? t('Edit Media') : t('Add Media')}
        closeLink="/media-library"
        childrenWrapperClass={classes.root}
      >
        <div className={classes.addMediaTabsWrap}>
          <SideTabs value={selectedTab} onChange={handleChange}>
            {leftSidebarTabs}
          </SideTabs>
        </div>
        <div className={classes.addMediaContent}>
          <Route
            path={`/media-library/media/:mode/general/:currentTab?/:id?`}
            component={AddMediaGeneralTab}
          />
          <Route
            path={`/media-library/media/:mode/web/:currentTab?/:id?`}
            component={AddMediaWebTab}
          />
          <Route
            path={`/media-library/media/:mode/local/:currentTab?/:id?`}
            component={AddMediaLocalTab}
          />
          <Route
            path={`/media-library/media/:mode/gallery/:currentTab?/:id?`}
            component={AddMediaGalleryTab}
          />
          <Route
            path={`/media-library/media/:mode/social/:currentTab?/:id?`}
            component={AddMediaSocialTab}
          />
          <Route
            path={`/media-library/media/:mode/premium/:currentTab?/:id?`}
            component={AddMediaPremiumTab}
          />
          <Route
            path={`/media-library/media/:mode/licensed/:currentTab?/:id?`}
            component={AddMediaLicensedTab}
          />
          <Route
            path={`/media-library/media/:mode/kiosk/:currentTab?/:id?`}
            component={AddMediaKioskTab}
          />
          <Route
            path={`/media-library/media/:mode/custom/:currentTab?/:id?`}
            component={AddMediaCustomTab}
          />
        </div>
      </SideModal>
    </WebFontLoader>
  )
}

AddMedia.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ tags, media, config }) => ({
  groups: media.groups,
  tags: tags.items,
  configMediaCategory: config.configMediaCategory
})

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getMediaGroupsAction,
      getConfigMediaCategory,
      getTags: getItems
    },
    dispatch
  )
}

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(AddMedia)
