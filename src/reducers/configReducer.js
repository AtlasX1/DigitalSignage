import update from 'immutability-helper'

import * as types from '../actions'

const fieldBodyShape = {
  response: [],
  error: {}
}

const initialState = {
  orgConfigOrgRole: {},
  mediaCategory: {},
  configOrgRole: {
    ...fieldBodyShape
  },
  enterpriseRole: {
    ...fieldBodyShape
  },
  systemRole: {
    ...fieldBodyShape
  },
  clientTypes: {
    ...fieldBodyShape
  },
  configFeatureClient: {
    ...fieldBodyShape
  },
  configFeatureDevice: {
    ...fieldBodyShape
  },
  configFeatureMedia: {
    ...fieldBodyShape
  },
  configMediaCategory: {
    ...fieldBodyShape,
    cities: []
  },
  themeOfMedia: {
    ...fieldBodyShape
  },
  contentSourceOfMediaFeature: {
    ...fieldBodyShape
  },
  transitions: {
    ...fieldBodyShape
  },
  alertTypes: {
    ...fieldBodyShape
  },
  locationsInfo: fieldBodyShape
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.GET_CONFIG_ORG_ROLE_SUCCESS:
      return update(state, {
        configOrgRole: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_ORG_ROLE_ERROR:
      return update(state, {
        configOrgRole: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_ORG_CONFIG_ORG_ROLE_INFO:
      return update(state, {
        configOrgRole: { $set: {} }
      })
    case types.GET_CONFIG_ENTERPRISE_ROLE_SUCCESS:
      return update(state, {
        enterpriseRole: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_ENTERPRISE_ROLE_ERROR:
      return update(state, {
        enterpriseRole: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_SYSTEM_ROLE_SUCCESS:
      return update(state, {
        systemRole: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_SYSTEM_ROLE_ERROR:
      return update(state, {
        systemRole: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_CLIENT_TYPE_SUCCESS:
      return update(state, {
        clientTypes: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_CLIENT_TYPE_ERROR:
      return update(state, {
        clientTypes: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_FEATURE_CLIENT_SUCCESS:
      return update(state, {
        configFeatureClient: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_FEATURE_CLIENT_ERROR:
      return update(state, {
        configFeatureClient: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_FEATURE_DEVICE_SUCCESS:
      return update(state, {
        configFeatureDevice: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_FEATURE_DEVICE_ERROR:
      return update(state, {
        configFeatureDevice: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_FEATURE_MEDIA_SUCCESS:
      return update(state, {
        configFeatureMedia: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_FEATURE_MEDIA_ERROR:
      return update(state, {
        configFeatureMedia: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_MEDIA_CATEGORY_SUCCESS:
      return update(state, {
        configMediaCategory: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_MEDIA_CATEGORY_ERROR:
      return update(state, {
        configMediaCategory: {
          error: { $set: action.payload }
        }
      })
    case types.GET_THEME_OF_MEDIA_FEATURE_BY_ID_SUCCESS:
      return update(state, {
        themeOfMedia: {
          response: { $set: action.payload }
        }
      })
    case types.GET_THEME_OF_MEDIA_FEATURE_BY_ID_ERROR:
      return update(state, {
        themeOfMedia: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONTENT_SOURCE_OF_MEDIA_FEATURE_BY_ID_SUCCESS:
      return update(state, {
        contentSourceOfMediaFeature: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONTENT_SOURCE_OF_MEDIA_FEATURE_BY_ID_ERROR:
      return update(state, {
        contentSourceOfMediaFeature: {
          error: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_ALERT_TYPES_SUCCESS:
      return update(state, {
        alertTypes: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_ALERT_TYPES_ERROR:
      return update(state, {
        alertTypes: {
          error: { $set: action.payload }
        }
      })
    case types.CLEAR_GET_CONFIG_ALERT_TYPES_INFO:
      return update(state, {
        alertTypes: { $set: {} }
      })
    case types.CLEAR_MEDIA_CATEGORY_CONFIG:
      return update(state, {
        mediaCategory: { $set: {} }
      })
    case types.GET_LOCATION_SUCCESS: {
      if (action.payload.meta && action.payload.meta.currentPage !== 1) {
        return update(state, {
          configMediaCategory: {
            cities: { $push: action.payload.data }
          }
        })
      }
      return update(state, {
        configMediaCategory: {
          cities: { $set: action.payload.data }
        }
      })
    }
    case types.GET_LOCATION_ERROR: {
      return update(state, {
        configMediaCategory: {
          cities: { $set: action.payload.data }
        }
      })
    }
    case types.CLEAR_THEME_OF_MEDIA_SUCCESS: {
      return update(state, {
        themeOfMedia: {
          response: { $set: action.payload }
        }
      })
    }
    case types.GET_CONFIG_TRANSITIONS_SUCCESS:
      return update(state, {
        transitions: {
          response: { $set: action.payload }
        }
      })
    case types.GET_CONFIG_TRANSITIONS_ERROR:
      return update(state, {
        transitions: {
          error: { $set: action.payload }
        }
      })
    case types.GET_LOCATION_INFO_SUCCESS:
      return update(state, {
        locationsInfo: {
          response: { $set: action.payload }
        }
      })
    case types.GET_LOCATION_INFO_ERROR:
      return update(state, {
        locationsInfo: {
          error: { $set: action.payload }
        }
      })
    default:
      return state
  }
}
