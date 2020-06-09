import React, { useEffect, useState, Fragment, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Typography } from '@material-ui/core'
import { debounce as _debounce } from 'lodash'

import { getPatterns, getBackgroundImages } from 'actions/designGalleryActions'

import LeftSidebarPanel from '../LeftSidebarPanel'
import PreviewGrids from '../grids/PreviewGrids'
import CanvasBgSettingLoader from '../../commonBlocks/CanvasBgSettingLoader'
import { TABS_NAMES } from '../../../constans'
import { useCanvasState } from '../../canvas/CanvasProvider'

const Title = () => {
  return (
    <Typography variant="h6" className={'h6'}>
      Textures
    </Typography>
  )
}

const BackgroundsTab = () => {
  const dispatch = useDispatch()
  const leftSidebarState = useSelector(({ editor }) => editor.leftSidebar)
  const {
    patterns,
    photos,
    backgroundsTabQuery,
    photosPage,
    patternsPage,
    perPage,
    isFetching
  } = leftSidebarState

  const getPhotosApi = term => {
    dispatch(getBackgroundImages({ query: term, photosPage, perPage }))
  }
  const [getPhotos] = useState(() => _debounce(getPhotosApi, 1000))
  const [{ canvasHandlers }] = useCanvasState()
  const [searchTerm, setSearchTerm] = useState(backgroundsTabQuery)
  const [activeTab, setActiveTab] = useState(TABS_NAMES.patterns)
  const [scrollPosition, setScrollPosition] = useState(null)
  const [lastSearchTerms, setLastSearchTerm] = useState({
    [TABS_NAMES.patterns]: '',
    [TABS_NAMES.background]: ''
  })

  const tabs = [
    {
      name: TABS_NAMES.patterns,
      grids: patterns
    },
    {
      name: TABS_NAMES.background,
      grids: photos
    }
  ]

  const updateLastSearchTerm = () => {
    setLastSearchTerm(state => ({
      ...state,
      [activeTab]: searchTerm
    }))
  }

  const handlePreviewClick = ({ id, src, type, selected }) => {
    if (selected) {
      canvasHandlers.removeBackground()
    } else {
      const url = src.original ? src.original : src.small
      canvasHandlers.setBackground({ id, url, type })
    }
  }

  const handleChangeSearch = term => {
    setSearchTerm(term)
    setScrollPosition(0)

    if (activeTab === TABS_NAMES.patterns) {
      dispatch(getPatterns({ query: term, patternsPage: 0, perPage }))
    }
    if (activeTab === TABS_NAMES.background && term.length) {
      getPhotos(term)
    }
  }

  const handleContentScrollEnd = () => {
    if (activeTab === TABS_NAMES.patterns) {
      dispatch(
        getPatterns({
          query: searchTerm,
          patternsPage: patternsPage + 1,
          perPage
        })
      )
    }

    if (activeTab === TABS_NAMES.background) {
      if (!searchTerm.length) return false
      dispatch(
        getBackgroundImages({
          query: searchTerm,
          photosPage: photosPage + 1,
          perPage
        })
      )
    }
  }

  const handleChangeTab = tab => {
    updateLastSearchTerm()
    setActiveTab(tab)
  }

  useEffect(() => {
    if (activeTab === TABS_NAMES.patterns) {
      setSearchTerm('')
      if (lastSearchTerms[activeTab] !== searchTerm || !patterns.length) {
        dispatch(getPatterns({ query: '', patternsPage, perPage }))
      }
    }
    if (activeTab === TABS_NAMES.background) {
      if (lastSearchTerms[activeTab] !== searchTerm || !photos.length) {
        getPhotosApi(searchTerm || 'texture')
      }
    }

    updateLastSearchTerm()
    // eslint-disable-next-line
  }, [activeTab])

  useEffect(() => {
    setSearchTerm(backgroundsTabQuery)
    // eslint-disable-next-line
  }, [backgroundsTabQuery])

  useEffect(() => {
    if (scrollPosition !== null) {
      setScrollPosition(null)
    }
    // eslint-disable-next-line
  }, [patterns, photos])

  return useMemo(() => {
    return (
      <LeftSidebarPanel
        withTabs
        activeTab={activeTab}
        placeholder={'Search Background'}
        searchTerm={searchTerm}
        onChangeSearch={handleChangeSearch}
        tabButtons={tabs.map(el => ({ text: el.name }))}
        onChangeTabs={handleChangeTab}
        isLoading={isFetching}
        title={<Title />}
        content={
          <>
            {tabs.map(({ name, grids, styles }, key) => (
              <Fragment key={key}>
                {isFetching && name === activeTab && (
                  <CanvasBgSettingLoader itemsLength={grids.length} />
                )}
                <PreviewGrids
                  isVisible={name === activeTab}
                  isLoading={isFetching}
                  grids={grids}
                  onPreviewClick={handlePreviewClick}
                  scrollPosition={scrollPosition}
                  onContentScrollEnd={handleContentScrollEnd}
                  colWidth={3}
                />
              </Fragment>
            ))}
          </>
        }
      />
    )
    // eslint-disable-next-line
  }, [leftSidebarState, activeTab, searchTerm, scrollPosition])
}

export default BackgroundsTab
