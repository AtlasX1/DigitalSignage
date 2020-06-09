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
    },
    titleText: {
      color: '#74809A',
      lineHeight: '30px',
      fontSize: 18,
      fontWeight: 700
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
  const [subTab, setSubTab] = useState('fonts')
  const [activeTab, setActiveTab] = useState(TABS_NAMES.systemFonts)

  const [combinationPage, setCombinationPage] = useState(1)

  const { perPage, webFontConfig, filters } = useSelector(({ fonts }) => fonts)

  const [{ canvas, canvasHandlers }] = useCanvasState()

  const handleChangeSearch = term => {
    setScrollPosition(0)
    setSearchTerm(term)
    activeTab !== TABS_NAMES.systemFonts && setActiveTab(TABS_NAMES.systemFonts)
    dispatch(setFilters({ ...filters, query: term }, 20))
  }

  const handleChangeTab = tab => {
    setActiveTab(tab)
  }

  const handlePreviewClick = item => {
    const activeObj = canvas.getActiveObject()

    if (activeObj && activeObj.isType('textbox') && subTab === 'fonts') {
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
    if (subTab === 'fonts') {
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
      if (subTab === 'fontCombinations') {
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
    [subTab]
  )

  useEffect(() => {
    if (combinationPage && subTab === 'fontCombinations') {
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

  const fontsTabContent = () => {
    if (activeTab === TABS_NAMES.customFonts) {
      return (
        <div>
          <Typography className={classes.titleText}>Coming Soon ...</Typography>
        </div>
      )
    } else {
      return (
        <>
          <TypesText />
          <TabToggleButtonGroup
            className={classes.tabToggleButtonContainer}
            value={subTab}
            exclusive
            onChange={(e, v) => v && setSubTab(v)}
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
      )
    }
  }

  return (
    <LeftSidebarPanel
      withTabs
      tabButtons={[
        { text: TABS_NAMES.systemFonts },
        { text: TABS_NAMES.customFonts }
      ]}
      onChangeTabs={handleChangeTab}
      activeTab={activeTab}
      title={<Title />}
      searchTerm={searchTerm}
      placeholder={'Search Fonts'}
      onChangeSearch={handleChangeSearch}
      content={fontsTabContent()}
      scrollPosition={scrollPosition}
      onContentScrollEnd={handleContentScrollEnd}
    />
  )
}
export default withStyles(styles)(FontsTab)
