import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { translate } from 'react-i18next'

import { Typography } from '@material-ui/core'

import CanvasBgSettingLoader from '../../commonBlocks/CanvasBgSettingLoader'
import { useCanvasState } from '../../canvas/CanvasProvider'
import ConfirmModal from '../../modals/ConfirmModal'
import LeftSidebarPanel from '../LeftSidebarPanel'
import PreviewGrids from '../grids/PreviewGrids'

import { SORTING_TYPES, TABS_NAMES } from '../../../constans'

import { getDesigns } from 'actions/designGalleryActions'

const Title = () => {
  return (
    <Typography variant="h6" className={'h6'}>
      Designs
    </Typography>
  )
}
// Designs Tab
const DesignsTab = ({ t }) => {
  const dispatch = useDispatch()
  const [sortingType, setSortingType] = useState(SORTING_TYPES.grids)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState()
  const [isLoading, setLoading] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(null)

  const [activeTab, setActiveTab] = useState(TABS_NAMES.myDesigns) // stock

  const {
    designs,
    designsPage,
    designsTabQuery,
    designsFilter,
    perPage
  } = useSelector(({ editor }) => editor.leftSidebar)

  const [{ canvasHistory, canvasHandlers }] = useCanvasState()
  const [searchTerm, setSearchTerm] = useState(designsTabQuery)

  // ---- methods

  const handleChangeSearch = term => {
    setScrollPosition(0)
    setSearchTerm(term)
    //TODO: add live search when BE will be ready
  }

  const handlePreviewClick = item => {
    if (canvasHistory.state.length > 1) {
      setSelectedTemplate(item)
      setConfirmDialogOpen(true)
    } else {
      canvasHandlers.applyCanvasConfig(item.canvas)
    }
  }

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false)
    canvasHandlers.applyCanvasConfig(selectedTemplate.canvas)
  }

  const handleContentScrollEnd = () => {
    setLoading(true)
    dispatch(
      getDesigns({
        filter: designsFilter,
        query: searchTerm,
        designsPage: designsPage + 1,
        perPage
      })
    )
  }

  const handleChangeFilter = filter => {
    // setScrollPosition(0)
    // setLoading(true)
    // dispatch(
    //   getDesigns({
    //     filter,
    //     query: searchTerm,
    //     designsPage: designsPage,
    //     perPage
    //   })
    // )
    console.log('filter', filter)
  }

  const handleChangeSorting = type => {
    setSortingType(type)
  }

  const handleChangeTab = tab => {
    setActiveTab(tab)
  }

  const getColWidth = type => {
    switch (type) {
      case 'grids':
        return 2
      case 'row':
        return 1
      default:
        return 2
    }
  }

  // ---- effects

  useEffect(() => {
    if (!designs.length) {
      dispatch(
        getDesigns({
          filter: designsFilter,
          query: searchTerm,
          designsPage,
          perPage
        })
      )
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setLoading(false)
    setScrollPosition(null)
    // eslint-disable-next-line
  }, [designs])

  useEffect(() => {
    dispatch(
      getDesigns({
        filter: designsFilter,
        query: searchTerm,
        designsPage: 0,
        perPage
      })
    )
    // eslint-disable-next-line
  }, [searchTerm])

  useEffect(
    () => {
      //TODO: fix requests when BE will be ready
      dispatch(
        getDesigns({
          filter: activeTab,
          query: searchTerm,
          designsPage,
          perPage
        })
      )
    },
    // eslint-disable-next-line
    [activeTab]
  )
  // ---- UI

  return (
    <>
      <LeftSidebarPanel
        withTabs
        withFilter
        activeTab={activeTab}
        title={<Title />}
        sortingBy={sortingType}
        onChangeSorting={handleChangeSorting}
        onChangeFilter={handleChangeFilter}
        searchTerm={searchTerm}
        placeholder={'Search Designs'}
        onChangeSearch={handleChangeSearch}
        tabButtons={[
          { text: TABS_NAMES.myDesigns },
          { text: TABS_NAMES.stockDesigns },
          { text: TABS_NAMES.sharedDesigns }
        ]}
        onChangeTabs={handleChangeTab}
        content={
          <>
            {isLoading && (
              <CanvasBgSettingLoader itemsLength={designs.length} />
            )}
            <PreviewGrids
              isVisible
              isLoading={isLoading}
              grids={designs}
              onPreviewClick={handlePreviewClick}
              colWidth={getColWidth(sortingType)}
            />
          </>
        }
        scrollPosition={scrollPosition}
        onContentScrollEnd={handleContentScrollEnd}
      />

      <ConfirmModal
        isShow={isConfirmDialogOpen}
        title={'Apply a template to your design'}
        contentText={
          'By applying a template you will lose your existing design. To restore, click Undo button.'
        }
        onApply={handleCloseDialog}
        onCancel={() => setConfirmDialogOpen(false)}
        onClose={() => setConfirmDialogOpen(false)}
      />
    </>
  )
}

export default translate('translations')(DesignsTab)
