import React, { useState, useEffect, useMemo } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { translate } from 'react-i18next'

import { Typography } from '@material-ui/core'

import CanvasBgSettingLoader from '../../commonBlocks/CanvasBgSettingLoader'
import { useCanvasState } from '../../canvas/CanvasProvider'
import ConfirmModal from '../../modals/ConfirmModal'
import LeftSidebarPanel from '../LeftSidebarPanel'
import PreviewGrids from '../grids/PreviewGrids'

import { getTemplates } from 'actions/signageEditorActions'
import { TEMPLATES_GROUPS, SORTING_TYPES } from '../../../constans'

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

  const {
    templates,
    templatesPage,
    templatesTabQuery,
    templatesFilter,
    perPage
  } = useSelector(({ editor }) => editor.leftSidebar)
  const [{ canvasHistory, canvasHandlers }] = useCanvasState()
  const [searchTerm, setSearchTerm] = useState(templatesTabQuery)
  const templatesOptions = TEMPLATES_GROUPS.map(name => {
    return { label: t(name), value: name.toLowerCase() }
  })

  useEffect(() => {
    if (!templates.length) {
      dispatch(
        getTemplates({
          filter: templatesFilter,
          query: searchTerm,
          templatesPage,
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
  }, [templates])

  useEffect(() => {
    dispatch(
      getTemplates({
        filter: templatesFilter,
        query: searchTerm,
        templatesPage: 0,
        perPage
      })
    )
    // eslint-disable-next-line
  }, [searchTerm])

  const handleChangeSearch = term => {
    setScrollPosition(0)
    setSearchTerm(term)
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
      getTemplates({
        filter: templatesFilter,
        query: searchTerm,
        templatesPage: templatesPage + 1,
        perPage
      })
    )
  }

  const handleChangeFilter = filter => {
    setScrollPosition(0)
    setLoading(true)
    dispatch(
      getTemplates({
        filter,
        query: searchTerm,
        templatesPage: templatesPage,
        perPage
      })
    )
  }

  const handleChangeSorting = type => {
    setSortingType(type)
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

  return useMemo(() => {
    return (
      <>
        <LeftSidebarPanel
          title={<Title />}
          withFilter
          filterOptions={templatesOptions}
          sortingBy={sortingType}
          onChangeSorting={handleChangeSorting}
          onChangeFilter={handleChangeFilter}
          searchTerm={searchTerm}
          placeholder={'Search Designs'}
          onChangeSearch={handleChangeSearch}
          content={
            <>
              {isLoading && (
                <CanvasBgSettingLoader itemsLength={templates.length} />
              )}
              <PreviewGrids
                isVisible
                isLoading={isLoading}
                grids={templates}
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
    // eslint-disable-next-line
  }, [
    templates,
    isLoading,
    scrollPosition,
    sortingType,
    isConfirmDialogOpen,
    canvasHistory
  ])
}

export default translate('translations')(DesignsTab)
