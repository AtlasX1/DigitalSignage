import update from 'immutability-helper'

import * as types from '../actions'

const initialState = {
  items: [],
  namesList: [],
  perPage: [],
  error: {},
  webFontConfig: {
    google: {
      families: ['Abril Fatface:400']
    }
  },
  downloadedFonts: [],
  addedFonts: [],
  myFonts: [],
  filters: {
    query: '',
    category: 'all',
    language: 'allLanguage',
    sort: 'trendingNow'
  },
  library: {},
  delete: {},
  post: {}
}

export default (state = initialState, action) => {
  if (action.type === 'MERGE_WEB_FONT_CONFIG' && !action.fonts.length) {
    return { ...state }
  }

  switch (action.type) {
    case types.GET_GOOGLE_FONTS_SUCCESS:
      return update(state, {
        items: {
          $set: action.items
        },
        fontLabels: {
          $set: action.fontLabels
        }
      })
    case types.GET_GOOGLE_FONTS_ERROR:
      return update(state, {
        error: { $set: action.error }
      })
    case types.GET_SAVED_FONTS_SUCCESS:
      return update(state, {
        myFonts: {
          $set: action.myFonts
        },
        perPage: { $set: action.perPage },
        downloadedFonts: {
          $set: action.downloadedFonts
        },
        webFontConfig: {
          google: {
            families: {
              $set: action.config
            }
          }
        }
      })
    case types.GET_SAVED_FONTS_ERROR:
      return update(state, {
        error: action.error
      })
    case types.EXTEND_FONTS_PER_PAGE: {
      const payload = {
        perPage: {
          $push: action.perPage
        },
        downloadedFonts: {
          $push: action.downloadedFonts
        }
      }
      return !action.config.length
        ? update(state, { ...payload })
        : update(state, {
            ...payload,
            webFontConfig: {
              google: {
                families: {
                  $set: action.config
                }
              }
            }
          })
    }
    case types.MERGE_WEB_FONT_CONFIG:
      return update(state, {
        webFontConfig: {
          google: {
            families: {
              $set: action.fonts
            }
          }
        },
        downloadedFonts: {
          $push: action.fonts
        }
      })
    case types.ADD_FONTS_TO_LIST:
      return update(state, {
        addedFonts: {
          $push: [action.font]
        },
        items: {
          $set: action.fonts
        }
      })
    case types.REMOVE_FONTS_TO_LIST:
      return update(state, {
        addedFonts: {
          $set: action.allFontsWithoutSelectedFont
        },
        items: {
          $set: action.fonts
        }
      })
    case types.CHANGE_VARIANT_OF_SELECTED_FONT:
      return update(state, {
        addedFonts: {
          $set: action.modifiedArray
        }
      })
    case types.CLEAR_ADDED_FONTS:
      return update(state, {
        addedFonts: {
          $set: []
        },
        items: {
          $set: action.unselectedItems
        }
      })
    case types.DELETE_SAVED_FONTS:
      return update(state, {
        myFonts: {
          $set: action.modifiedFonts
        },
        perPage: {
          $set: action.modifiedPerPage
        }
      })
    case types.SELECT_FONT:
      return update(state, {
        perPage: {
          $set: action.modifiedPerPage
        }
      })
    case types.UNSELECT_FONT:
      return update(state, {
        perPage: {
          $set: action.modifiedPerPage
        }
      })
    case types.SELECT_ALL_FONTS:
      return update(state, {
        perPage: {
          $set: action.modifiedPerPage
        }
      })
    case types.SET_FILTERS: {
      const payload = {
        filters: {
          $set: action.filters
        },
        perPage: {
          $set: action.modifiedPerPage
        },
        downloadedFonts: {
          $push: action.config
        }
      }
      return action.config.length
        ? update(state, {
            ...payload,
            webFontConfig: {
              google: {
                families: {
                  $set: action.config
                }
              }
            }
          })
        : update(state, { ...payload })
    }
    case types.DELETE_SELECTED_FONTS:
      return update(state, {
        myFonts: {
          $set: action.modifiedFonts
        }
      })
    case types.GET_FONTS_SUCCESS:
      return update(state, {
        library: {
          response: { $set: action.payload }
        }
      })
    case types.GET_FONTS_ERROR: {
      return update(state, {
        library: {
          error: { $set: action.payload }
        }
      })
    }
    case types.CLEAR_GET_FONTS_INFO:
      return update(state, {
        library: { $set: {} }
      })
    case types.DELETE_FONT_SUCCESS:
      return update(state, {
        delete: {
          response: { $set: action.payload }
        }
      })
    case types.DELETE_FONT_ERROR:
      return update(state, {
        delete: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_DELETE_FONT_INFO:
      return update(state, {
        delete: { $set: {} }
      })
    case types.POST_FONT_SUCCESS:
      return update(state, {
        post: {
          response: { $set: action.payload }
        }
      })
    case types.POST_FONT_ERROR:
      return update(state, {
        post: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_POST_FONT_INFO:
      return update(state, {
        post: { $set: {} }
      })
    default:
      return state
  }
}
