import React, { useEffect, useState, Fragment } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { debounce as _debounce } from 'lodash'
import update from 'immutability-helper'

import { Typography } from '@material-ui/core'

import { useCanvasState } from '../../canvas/CanvasProvider'
import CanvasBgSettingLoader from '../../commonBlocks/CanvasBgSettingLoader'
import PreviewGrids from '../grids/PreviewGrids'
import LeftSidebarPanel from '../LeftSidebarPanel'

import { getStockImages } from 'actions/signageEditorActions'
import { getMediaItemsAction } from 'actions/mediaActions'

import { TABS_NAMES } from '../../../constans'

const Title = () => {
  return (
    <Typography variant="h6" className={'h6'}>
      Images
    </Typography>
  )
}

const ImagesTab = () => {
  const dispatchAction = useDispatch()

  const getImagesApi = term => {
    dispatchAction(getStockImages({ query: term, stockImagesPage, perPage }))
  }

  const [leftSidebarState, mediaReducer] = useSelector(state => [
    state.editor.leftSidebar,
    state.media.library.response
  ])

  const {
    stockImages,
    stockImagesPage,
    libraryImages,
    imagesTabQuery,
    perPage,
    isFetching
  } = leftSidebarState

  const [{ canvasHandlers }] = useCanvasState()
  const [getImages] = useState(() => _debounce(getImagesApi, 1000))
  const [searchTerm, setSearchTerm] = useState(imagesTabQuery)
  const [activeTab, setActiveTab] = useState(TABS_NAMES.libraryImages)
  const [scrollPosition, setScrollPosition] = useState(null)
  const [mediaPage, setMediaPage] = useState(1)
  const [tabs, setTabs] = useState([
    {
      name: TABS_NAMES.libraryImages,
      grids: libraryImages
    },
    {
      name: TABS_NAMES.stockImages,
      grids: stockImages
    }
  ])

  // ---- methods

  const handlePreviewClick = ({ id, src, type }) => {
    canvasHandlers.addImage({ id, url: src.original, type })
  }

  const handleChangeSearch = term => {
    setScrollPosition(0)
    setSearchTerm(term)

    if (activeTab === TABS_NAMES.libraryImages) {
      term &&
        dispatchAction(
          getMediaItemsAction({
            page: 1,
            featureId: 8,
            title: term
          })
        )

      !term &&
        dispatchAction(
          getMediaItemsAction({
            limit: 20,
            page: 1,
            featureId: 8
          })
        )
    }

    if (activeTab === TABS_NAMES.stockImages) {
      term.length && getImages(term)
    }
  }

  const handleContentScrollEnd = () => {
    if (activeTab === TABS_NAMES.libraryImages) {
      setMediaPage(mediaPage + 1)
    }

    if (activeTab === TABS_NAMES.stockImages) {
      if (!searchTerm.length) return false
      dispatchAction(
        getStockImages({
          query: searchTerm,
          stockImagesPage: stockImagesPage + 1,
          perPage
        })
      )
    }
  }

  const handleChangeTab = tab => {
    setActiveTab(tab)
  }

  // --- effects

  useEffect(() => {
    if (activeTab === TABS_NAMES.libraryImages) {
      setMediaPage(1)
    }
    if (activeTab === TABS_NAMES.stockImages) {
      getImagesApi(searchTerm || 'business')
    }

    // eslint-disable-next-line
  }, [activeTab])

  useEffect(() => {
    setSearchTerm(imagesTabQuery)
    // eslint-disable-next-line
  }, [imagesTabQuery])

  useEffect(
    () => {
      const imageFormats = ['bmp', 'jpg', 'jpeg', 'svg', 'png']
      const index = activeTab === TABS_NAMES.libraryImages ? 0 : 1

      if (
        activeTab === TABS_NAMES.libraryImages &&
        mediaReducer &&
        mediaReducer.data.length
      ) {
        if (mediaReducer.data.length) {
          const grids = []

          mediaReducer.data.forEach(i => {
            if (imageFormats.includes(i.format)) {
              grids.push({
                id: i.id,
                name: i.title,
                src: { original: i.mediaUrl },
                type: TABS_NAMES.libraryImages,
                showAs: 'image'
              })
            }
          })

          const newTabs =
            mediaPage === 1
              ? update(tabs, {
                  [index]: {
                    grids: { $set: grids }
                  }
                })
              : update(tabs, {
                  [index]: {
                    grids: { $push: [grids] }
                  }
                })

          setTabs(newTabs)
        }
      }

      if (
        activeTab === TABS_NAMES.stockImages &&
        stockImages &&
        stockImages.length
      ) {
        const newTabs = update(tabs, {
          [index]: {
            grids: { $set: stockImages }
          }
        })

        setTabs(newTabs)
      }
    },
    // eslint-disable-next-line
    [mediaReducer, stockImages]
  )

  useEffect(
    () => {
      if (activeTab === TABS_NAMES.libraryImages) {
        dispatchAction(
          getMediaItemsAction({
            limit: 20,
            page: mediaPage,
            featureId: 8
          })
        )
      }
    },
    // eslint-disable-next-line
    [mediaPage]
  )

  useEffect(() => {
    if (scrollPosition !== null) {
      setScrollPosition(null)
    }
    // eslint-disable-next-line
  }, [libraryImages, stockImages])

  // ---- UI

  return (
    <LeftSidebarPanel
      withTabs
      activeTab={activeTab}
      placeholder={'Search Images'}
      searchTerm={searchTerm}
      onChangeSearch={handleChangeSearch}
      tabButtons={tabs.map(el => ({ text: el.name }))}
      onChangeTabs={handleChangeTab}
      isLoading={isFetching}
      title={<Title />}
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
                colWidth={1}
              />
            </Fragment>
          ))}
        </>
      }
    />
  )
}

export default ImagesTab
