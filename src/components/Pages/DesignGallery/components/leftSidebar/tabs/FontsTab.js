import React, { useState, useEffect } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { uniqueId as _uniqueId } from 'lodash'
import WebfontLoader from '@dr-kobros/react-webfont-loader'
import update from 'immutability-helper'

import { Typography, withStyles } from '@material-ui/core'

import LeftSidebarPanel from '../LeftSidebarPanel'
import PreviewGrids from '../grids/PreviewGrids'
import CanvasBgSettingLoader from '../../commonBlocks/CanvasBgSettingLoader'
import TypesText from '../TypesText'
import { useCanvasState } from '../../canvas/CanvasProvider'

import { TabToggleButton, TabToggleButtonGroup } from 'components/Buttons'

import {
  extendFontsPerPage,
  setFilters,
  getSavedFonts
} from 'actions/fontsActions'

import { mergeWebFontConfig } from 'actions/fontsActions'

import { randomSentence } from 'utils/buzzwordGenerator'

import { TABS_NAMES, FONT_COMBINATIONS } from '../../../constans'

const styles = theme => {
  return {
    tabToggleButtonContainer: {
      justifyContent: 'center',
      background: 'transparent',
      marginBottom: '16px',
      overflow: 'unset',
      paddingLeft: 15
    },
    tabToggleButton: {
      width: '50%',
      whiteSpace: 'nowrap'
    }
  }
}

const Title = () => {
  return (
    <Typography variant="h6" className={'h6'}>
      Text Styles
    </Typography>
  )
}

const FontsTab = ({ classes }) => {
  const dispatch = useDispatch()

  const [fonts, setFonts] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [scrollPosition, setScrollPosition] = useState(null)
  const [tab, setTab] = useState('fonts')

  const [combinationPage, setCombinationPage] = useState(1)

  const { perPage, webFontConfig, filters } = useSelector(({ fonts }) => fonts)

  const [{ canvas, canvasHandlers }] = useCanvasState()

  const handleChangeSearch = term => {
    setScrollPosition(0)
    setSearchTerm(term)
    dispatch(setFilters({ ...filters, query: term }, 20))
  }

  const handlePreviewClick = item => {
    const activeObj = canvas.getActiveObject()

    if (activeObj && activeObj.isType('textbox') && tab === 'fonts') {
      canvasHandlers.setTextBoxProps({
        fontFamily: item.family
      })
    } else {
      item.showAs === 'font'
        ? canvasHandlers.addText(item)
        : canvasHandlers.addTextCombination(item)
    }
  }

  const handleContentScrollEnd = async () => {
    if (tab === 'fonts') {
      setLoading(true)
      const fontsLength = perPage.length
      const response = await dispatch(
        extendFontsPerPage(fontsLength, fontsLength + 10)
      )
      if (!response.perPage.length) setLoading(false)
    } else {
      setCombinationPage(combinationPage + 1)
    }
  }

  useEffect(() => {
    dispatch(getSavedFonts())
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const payloadFonts = perPage.map(el => ({
      ...el,
      id: _uniqueId(),
      type: TABS_NAMES.fonts,
      showAs: 'font'
    }))
    setFonts(payloadFonts)
    // eslint-disable-next-line
  }, [perPage])

  useEffect(() => {
    setLoading(false)
    if (scrollPosition !== null) {
      setScrollPosition(null)
    }
    // eslint-disable-next-line
  }, [fonts])

  useEffect(
    () => {
      if (tab === 'fontCombinations') {
        setCombinationPage(1)

        dispatch(
          mergeWebFontConfig(
            FONT_COMBINATIONS.map(i => [i.main, i.secondary])
              .flat()
              .slice(0, 20)
          )
        )

        const fonts = FONT_COMBINATIONS.slice(0, 20).map(combination => ({
          ...combination,
          id: _uniqueId(),
          type: TABS_NAMES.fonts,
          showAs: 'fontCombination',
          secondaryText: randomSentence()
        }))

        setFonts(fonts)
      } else {
        dispatch(getSavedFonts())
      }
    },
    // eslint-disable-next-line
    [tab]
  )

  useEffect(() => {
    if (combinationPage && tab === 'fontCombinations') {
      const newFontCombinations = FONT_COMBINATIONS.slice(
        fonts.length - 1,
        combinationPage * 20
      ).map(combination => ({
        ...combination,
        id: _uniqueId(),
        type: TABS_NAMES.fonts,
        showAs: 'fontCombination',
        secondaryText: randomSentence()
      }))

      dispatch(
        mergeWebFontConfig(
          newFontCombinations.map(i => [i.main, i.secondary]).flat()
        )
      )

      setFonts(
        update(fonts, {
          $push: newFontCombinations
        })
      )
    }
    // eslint-disable-next-line
  }, [combinationPage])

  return (
    <LeftSidebarPanel
      title={<Title />}
      searchTerm={searchTerm}
      placeholder={'Search Fonts'}
      onChangeSearch={handleChangeSearch}
      content={
        <>
          <TypesText />
          <TabToggleButtonGroup
            className={classes.tabToggleButtonContainer}
            value={tab}
            exclusive
            onChange={(e, v) => v && setTab(v)}
          >
            <TabToggleButton
              className={classes.tabToggleButton}
              value={'fonts'}
            >
              Fonts
            </TabToggleButton>
            <TabToggleButton
              className={classes.tabToggleButton}
              value={'fontCombinations'}
            >
              Font Combinations
            </TabToggleButton>
          </TabToggleButtonGroup>
          {isLoading && <CanvasBgSettingLoader itemsLength={fonts.length} />}
          <WebfontLoader config={webFontConfig}>
            <PreviewGrids
              isVisible
              isOwnScroll={false}
              isLoading={isLoading}
              grids={fonts}
              onPreviewClick={handlePreviewClick}
              colWidth={1}
            />
          </WebfontLoader>
        </>
      }
      scrollPosition={scrollPosition}
      onContentScrollEnd={handleContentScrollEnd}
    />
  )
}
export default withStyles(styles)(FontsTab)
