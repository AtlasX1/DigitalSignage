import * as types from './index'

import store from '../store/configureStore'

import { fontsService } from '../services'

import lodash from 'lodash'

const getGoogleFonts = () => ({ type: types.GET_GOOGLE_FONTS })

const getSavedFonts = () => ({ type: types.GET_SAVED_FONTS })

const extendFontsPerPage = (currentSize, extensionSize) => {
  const {
    fonts: { myFonts, filters }
  } = store.getState()
  let perPage = []

  if (filters.language !== 'allLanguage') {
    if (filters.category === 'all') {
      perPage = myFonts.filter(({ subsets }) => {
        return subsets.some(language => language === filters.language)
      })
    } else {
      perPage = myFonts.filter(({ category, subsets }) => {
        return (
          category === filters.category &&
          subsets.some(language => language === filters.language)
        )
      })
    }
  } else {
    if (filters.category === 'all') {
      perPage = myFonts
    } else {
      perPage = myFonts.filter(font => {
        return font.category === filters.category
      })
    }
  }
  if (filters.query) {
    const searchQuery = filters.query.toLowerCase()
    perPage = myFonts.filter(({ family }) => {
      return family.toLowerCase().includes(searchQuery)
    })
  }

  const config = perPage
    .slice(currentSize, extensionSize)
    .map(
      ({ family, variants }) =>
        `${family}:${variants.map(({ variant }) => variant).join(',')}`
    )

  const downloadedFonts = perPage
    .slice(currentSize, extensionSize)
    .map(
      ({ family, variants }) =>
        `${family}:${variants.map(({ variant }) => variant).join(',')}`
    )

  return {
    type: types.EXTEND_FONTS_PER_PAGE,
    perPage:
      perPage.length < extensionSize
        ? []
        : perPage.slice(currentSize, extensionSize),
    config,
    downloadedFonts
  }
}

const mergeWebFontConfig = webFontsArray => {
  let {
    fonts: { downloadedFonts }
  } = store.getState()
  let newFonts = []
  if (lodash.difference(webFontsArray, downloadedFonts).length) {
    newFonts = lodash.difference(webFontsArray, downloadedFonts)
  }
  return {
    type: types.MERGE_WEB_FONT_CONFIG,
    fonts: newFonts
  }
}
const addFontToList = (font, variantOfFont) => {
  const {
    fonts: { items }
  } = store.getState()

  const allFonts = items.map(f =>
    f.family === font.family ? { ...f, selected: true } : f
  )
  const transformFont = { ...font, variants: [variantOfFont] }

  return {
    type: types.ADD_FONTS_TO_LIST,
    font: transformFont,
    fonts: allFonts
  }
}
const removeFontFromList = fontFamily => {
  const {
    fonts: { addedFonts, items }
  } = store.getState()

  const allFontsWithoutSelectedFont = [...addedFonts]
  allFontsWithoutSelectedFont.splice(
    addedFonts.map(({ family }) => family).indexOf(fontFamily),
    1
  )

  let allFonts = items.map(font =>
    font.family === fontFamily ? { ...font, selected: false } : font
  )

  return {
    type: types.REMOVE_FONTS_TO_LIST,
    allFontsWithoutSelectedFont,
    fonts: allFonts
  }
}
const changeVariantOfSelectedFont = (fontFamily, variant) => {
  const {
    fonts: { addedFonts }
  } = store.getState()

  const modifiedArray = addedFonts.map(font => {
    if (fontFamily === font.family) {
      return { ...font, variants: [variant] }
    }
    return font
  })
  return {
    type: types.CHANGE_VARIANT_OF_SELECTED_FONT,
    modifiedArray
  }
}
const clearAddedFonts = () => {
  const {
    fonts: { items }
  } = store.getState()
  const unselectedItems = items.map(font => ({ ...font, selected: false }))
  return { type: types.CLEAR_ADDED_FONTS, unselectedItems }
}

const deleteSavedFont = fontFamily => {
  const {
    fonts: { myFonts, perPage }
  } = store.getState()

  const modifiedFonts = myFonts.filter(font => font.family !== fontFamily)
  const modifiedPerPage = perPage.filter(font => font.family !== fontFamily)

  fontsService.deleteFont(fontFamily)

  return { type: types.DELETE_SAVED_FONTS, modifiedFonts, modifiedPerPage }
}

const selectFont = fontFamily => {
  const {
    fonts: { perPage }
  } = store.getState()
  const modifiedPerPage = perPage.map(font =>
    font.family === fontFamily ? { ...font, selected: true } : font
  )
  return { type: types.SELECT_FONT, modifiedPerPage }
}

const unselectFont = fontFamily => {
  const {
    fonts: { perPage }
  } = store.getState()
  const modifiedPerPage = perPage.map(font =>
    font.family === fontFamily ? { ...font, selected: false } : font
  )
  return { type: types.UNSELECT_FONT, modifiedPerPage }
}

const selectAllFonts = flag => {
  const {
    fonts: { perPage }
  } = store.getState()
  const modifiedPerPage = perPage.map(font => ({ ...font, selected: flag }))
  return { type: types.SELECT_ALL_FONTS, modifiedPerPage }
}

const setFilters = (filters, fontsPerPage) => {
  const {
    fonts: { myFonts, downloadedFonts }
  } = store.getState()
  let modifiedPerPage = []
  if (filters.language !== 'allLanguage') {
    if (filters.category === 'all') {
      modifiedPerPage = myFonts
        .filter(({ subsets }) => {
          return subsets.some(language => language === filters.language)
        })
        .slice(0, fontsPerPage)
    } else {
      modifiedPerPage = myFonts
        .filter(({ category, subsets }) => {
          return (
            category === filters.category &&
            subsets.some(language => language === filters.language)
          )
        })
        .slice(0, fontsPerPage)
    }
  } else {
    if (filters.category === 'all') {
      modifiedPerPage = myFonts.slice(0, fontsPerPage)
    } else {
      modifiedPerPage = myFonts
        .filter(font => {
          return font.category === filters.category
        })
        .slice(0, fontsPerPage)
    }
  }
  if (filters.query) {
    const searchQuery = filters.query.toLowerCase()
    modifiedPerPage = myFonts
      .filter(({ family }) => {
        return family.toLowerCase().includes(searchQuery)
      })
      .slice(0, fontsPerPage)
  }
  const config = lodash.difference(
    modifiedPerPage.map(
      font =>
        `${font.family}:${font.variants
          .map(({ variant }) => variant)
          .join(',')}`
    ),
    downloadedFonts
  )

  return { type: types.SET_FILTERS, filters, modifiedPerPage, config }
}

const deleteSelectedFonts = () => {
  const {
    fonts: { myFonts }
  } = store.getState()

  const modifiedFonts = myFonts.filter(({ selected }) => !selected)
  return { type: types.DELETE_SELECTED_FONTS, modifiedFonts }
}

const getFonts = () => ({
  type: types.GET_FONTS
})

const clearGetFontsInfo = () => ({
  type: types.CLEAR_GET_FONTS_INFO
})

const deleteFontAction = id => ({
  type: types.DELETE_FONT,
  payload: id
})

const clearDeleteFontInfoAction = () => ({
  type: types.CLEAR_DELETE_FONT_INFO
})

const postFontAction = data => ({
  type: types.POST_FONT,
  payload: data
})

const clearPostFontInfoAction = () => ({
  type: types.CLEAR_POST_FONT_INFO
})

export {
  getGoogleFonts,
  getSavedFonts,
  extendFontsPerPage,
  mergeWebFontConfig,
  addFontToList,
  removeFontFromList,
  changeVariantOfSelectedFont,
  clearAddedFonts,
  deleteSavedFont,
  deleteSelectedFonts,
  selectFont,
  unselectFont,
  selectAllFonts,
  setFilters,
  getFonts,
  clearGetFontsInfo,
  deleteFontAction,
  clearDeleteFontInfoAction,
  postFontAction,
  clearPostFontInfoAction
}
