import update from 'immutability-helper'

import * as types from '../actions'

const shapeOfBody = {
  response: null,
  error: null
}

const initialState = {
  general: {
    qrcode: { ...shapeOfBody },
    file: { ...shapeOfBody },
    text: { ...shapeOfBody },
    htmlcode: { ...shapeOfBody },
    analytics: { ...shapeOfBody },
    msoffice: { ...shapeOfBody },
    tables: { ...shapeOfBody }
  },
  web: {
    rssfeed: { ...shapeOfBody },
    youtube: { ...shapeOfBody },
    weburl: { ...shapeOfBody },
    vimeo: { ...shapeOfBody },
    mediarss: { ...shapeOfBody },
    googledocs: { ...shapeOfBody },
    stockquote: { ...shapeOfBody },
    radio: { ...shapeOfBody },
    microsoftpowerbi: { ...shapeOfBody }
  },
  gallery: {
    picasa: { ...shapeOfBody },
    flickr: { ...shapeOfBody },
    quote: { ...shapeOfBody },
    stockphotos: { ...shapeOfBody },
    workplaceposters: { ...shapeOfBody },
    prezi: { ...shapeOfBody },
    profiles: { ...shapeOfBody },
    smugmug: { ...shapeOfBody }
  },
  local: {
    weather: { ...shapeOfBody },
    traffic: { ...shapeOfBody },
    scheduleOfEvents: { ...shapeOfBody },
    clock: { ...shapeOfBody },
    date: { ...shapeOfBody },
    timer: { ...shapeOfBody },
    pointofinterest: { ...shapeOfBody }
  },
  social: {
    socialwall: { ...shapeOfBody },
    twitter: { ...shapeOfBody },
    pinterest: { ...shapeOfBody },
    facebook: { ...shapeOfBody }
  },
  licensed: {
    feeds: { ...shapeOfBody },
    flightstats: { ...shapeOfBody },
    signagecreator: { ...shapeOfBody },
    livetransit: { ...shapeOfBody }
  },
  premium: {
    videoinput: { ...shapeOfBody },
    alertsystem: { ...shapeOfBody },
    dockets: { ...shapeOfBody },
    boxoffice: { ...shapeOfBody },
    currencyexchange: { ...shapeOfBody }
  },
  custom: {
    sunCity: { ...shapeOfBody },
    profiles: { ...shapeOfBody },
    workplacePosters: { ...shapeOfBody },
    quotes: { ...shapeOfBody },
    customwidget: { ...shapeOfBody }
  },
  kiosk: {
    button: { ...shapeOfBody }
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_MEDIA_SUCCESS:
      return update(state, {
        [action.meta.mediaName]: {
          [action.meta.tabName]: {
            response: { $set: action.payload }
          }
        }
      })
    case types.ADD_MEDIA_ERROR:
      return update(state, {
        [action.meta.mediaName]: {
          [action.meta.tabName]: {
            error: { $set: action.payload }
          }
        }
      })

    case types.CLEAR_ADDED_MEDIA:
      return update(state, {
        [action.meta.mediaName]: {
          [action.meta.tabName]: {
            $set: shapeOfBody
          }
        }
      })
    default:
      return state
  }
}
