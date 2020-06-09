import React, { useState, useEffect, Fragment, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Typography } from '@material-ui/core'

import LeftSidebarPanel from '../LeftSidebarPanel'
import { TABS_NAMES } from '../../../constans'

import { getShapes, getIcons, getEmojis } from 'actions/designGalleryActions'

import PreviewGrids from '../grids/PreviewGrids'
import CanvasBgSettingLoader from '../../commonBlocks/CanvasBgSettingLoader'
import { useCanvasState } from '../../canvas/CanvasProvider'

const tabButtons = [{ text: 'Shapes' }, { text: 'Icons' }, { text: 'Emojis' }]
const title = (
  <Typography variant="h6" className={'h6'}>
    Shapes
  </Typography>
)

const ShapesTab = () => {
  const leftSidebarState = useSelector(({ editor }) => editor.leftSidebar)
  const {
    shapes,
    shapesPage,
    icons,
    iconsPage,
    emojis,
    emojisPage,
    perPage,
    shapesTabQuery,
    isFetching
  } = leftSidebarState
  const dispatch = useDispatch()
  const [{ canvasHandlers }] = useCanvasState()
  const [searchTerm, setSearchTerm] = useState(shapesTabQuery)
  const [activeTab, setActiveTab] = useState(TABS_NAMES.shapes)
  const [scrollPosition, setScrollPosition] = useState(null)
  const [lastSearchTerms, setLastSearchTerm] = useState({
    [TABS_NAMES.shapes]: '',
    [TABS_NAMES.stockImages]: '',
    [TABS_NAMES.emojis]: ''
  })

  const handlePreviewClick = ({ src }) => {
    canvasHandlers.addSVG(src.original ? src.original : src.small)
  }

  const handleChangeSearch = term => {
    setScrollPosition(0)
    setSearchTerm(term)

    if (activeTab === TABS_NAMES.shapes) {
      dispatch(getShapes({ query: term, shapesPage: 0, perPage }))
    }
    if (activeTab === TABS_NAMES.icons) {
      dispatch(getIcons({ query: term, iconsPage: 0, perPage }))
    }
    if (activeTab === TABS_NAMES.emojis) {
      dispatch(getEmojis({ query: term, emojisPage: 0, perPage }))
    }
  }

  const handleContentScrollEnd = () => {
    if (activeTab === TABS_NAMES.shapes) {
      dispatch(
        getShapes({
          query: searchTerm,
          shapesPage: shapesPage + 1,
          perPage
        })
      )
    }
    if (activeTab === TABS_NAMES.icons) {
      dispatch(
        getIcons({
          query: searchTerm,
          iconsPage: iconsPage + 1,
          perPage
        })
      )
    }
    if (activeTab === TABS_NAMES.emojis) {
      dispatch(
        getEmojis({
          query: searchTerm,
          emojisPage: emojisPage + 1,
          perPage
        })
      )
    }
  }

  const handleChangeTab = tab => {
    updateLastSearchTerm()
    setActiveTab(tab)
  }

  const updateLastSearchTerm = () => {
    setLastSearchTerm(state => ({
      ...state,
      [activeTab]: searchTerm
    }))
  }

  const tabs = [
    {
      name: TABS_NAMES.shapes,
      grids: shapes
    },
    {
      name: TABS_NAMES.icons,
      grids: icons
    },
    {
      name: TABS_NAMES.emojis,
      grids: emojis
    }
  ]

  useEffect(() => {
    if (activeTab === TABS_NAMES.shapes) {
      if (lastSearchTerms[activeTab] !== searchTerm || !shapes.length) {
        dispatch(getShapes({ query: searchTerm, shapesPage, perPage }))
      }
    }
    if (activeTab === TABS_NAMES.icons) {
      if (lastSearchTerms[activeTab] !== searchTerm || !icons.length) {
        dispatch(getIcons({ query: searchTerm, iconsPage, perPage }))
      }
    }
    if (activeTab === TABS_NAMES.emojis) {
      if (lastSearchTerms[activeTab] !== searchTerm || !emojis.length) {
        dispatch(getEmojis({ query: searchTerm, emojisPage, perPage }))
      }
    }

    updateLastSearchTerm()
    // eslint-disable-next-line
  }, [activeTab])

  useEffect(() => {
    if (scrollPosition !== null) {
      setScrollPosition(null)
    }
    // eslint-disable-next-line
  }, [shapes, icons, emojis])

  return useMemo(() => {
    return (
      <LeftSidebarPanel
        withTabs
        title={title}
        searchTerm={searchTerm}
        placeholder={'Search Shapes'}
        onChangeSearch={handleChangeSearch}
        tabButtons={tabButtons}
        onChangeTabs={handleChangeTab}
        activeTab={activeTab}
        content={
          <>
            {tabs.map(({ name, grids }, key) => (
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
  }, [leftSidebarState, searchTerm, activeTab, scrollPosition])
}
export default ShapesTab
