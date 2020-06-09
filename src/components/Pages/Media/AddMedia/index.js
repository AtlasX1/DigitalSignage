import React, { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Link, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux'
import WebFontLoader from '@dr-kobros/react-webfont-loader'

import { withStyles } from '@material-ui/core'

import { SideModal } from 'components/Modal'
import { SideTabs, SideTab, TabIcon } from 'components/Tabs'
import { getMediaGroupsAction } from 'actions/mediaActions'
import { getItems } from 'actions/tagsActions'
import { getConfigMediaCategory } from 'actions/configActions'
import { sortBySortOrder } from 'utils/libraryUtils'
import MediaComponent from './MediaComponent'
import { Scrollbars } from 'components/Scrollbars'

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
      'Rasa',
      'Roboto',
      'Times',
      'Courier',
      'Verdana',
      'Palatino',
      'Garamond',
      'Bookman',
      'Comic Sans MS',
      'Candara',
      'Arial Black',
      'Impact'
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
  getConfigMediaCategory,
  isPending
}) => {
  const { mode: mediaMode, currentTab, ownTabName } = match.params
  const isEditMode = mediaMode === 'edit'

  const [selectedTab, setSelectedTab] = useState(
    ownTabName ? ownTabName : 'general'
  )
  const handleChange = useCallback(
    (event, tab) => {
      setSelectedTab(tab)
    },
    [setSelectedTab]
  )

  const leftSidebarTabs = () => {
    const tabs = sortBySortOrder(configMediaCategory.response)

    return tabs.map(({ name, icon, id }) => {
      const value = name.toLowerCase()
      return (
        <SideTab
          key={id}
          disabled={(isEditMode && selectedTab !== value) || isPending}
          disableRipple={true}
          icon={<TabIcon iconClassName={icon} />}
          component={Link}
          label={t(name)}
          value={value}
          to={`/media-library/media/${mediaMode}/${value}`}
        />
      )
    })
  }

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
            {leftSidebarTabs()}
          </SideTabs>
        </div>
        <div className={classes.addMediaContent}>
          <Scrollbars>
            <Route
              path={`/media-library/media/:mode/:ownTabName(general|web|local|gallery|social|premium|licensed|kiosk|custom)/:currentTab?/:id?`}
              component={MediaComponent}
            />
          </Scrollbars>
        </div>
      </SideModal>
    </WebFontLoader>
  )
}

AddMedia.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = ({ tags, media, config, appReducer }) => ({
  groups: media.groups,
  tags: tags.items,
  configMediaCategory: config.configMediaCategory,
  isPending: appReducer.isPending
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
