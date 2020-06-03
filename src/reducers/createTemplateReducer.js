import update from 'immutability-helper'

import * as types from '../actions'
import { createTemplateConstants } from '../constants'
import { calculateMultiplier } from '../utils/createTemplate'

const initialState = {
  container: {
    size: { width: 1920, height: 1080 },
    orientation: 'landscape',
    showGrid: false,
    snapToGrid: false,
    videoWall: {
      active: false,
      props: { x: 0, y: 0 },
      zoomed: false
    },
    background: 'rgba(0,0,0,1)',
    pattern: 'original',
    patternOpacity: 1
  },
  items: {},
  currentItemId: -1,
  maxId: -1,
  maxOrder: 0,
  renderMultiplier: 1.5,
  selectedItems: []
}

export default (state = initialState, action) => {
  let item,
    size,
    position,
    value,
    multiplier,
    orientation,
    newItem,
    newId,
    newOrder,
    newVideoWall

  if (
    [
      types.UPDATE_CURRENT_TEMPLATE_ITEM,
      types.SET_CURRENT_TEMPLATE_ITEM_SIZE,
      types.SET_CURRENT_TEMPLATE_ITEM_POSITION,
      types.SET_CURRENT_TEMPLATE_ITEM_ALIGNMENT,
      types.SET_CURRENT_TEMPLATE_ITEM_ROTATION,
      types.FLIP_CURRENT_TEMPLATE_ITEM
    ].includes(action.type) &&
    state.currentItemId === -1
  )
    return state

  switch (action.type) {
    case types.RESET_TEMPLATE_CONTAINER:
      return update(state, {
        $set: initialState
      })
    case types.UPDATE_TEMPLATE_CONTAINER:
      return update(state, {
        container: { $merge: action.payload }
      })
    case types.SET_TEMPLATE_CONTAINER_ORIENTATION:
      size = state.container.size
      orientation = action.payload.toUpperCase()

      multiplier = calculateMultiplier(
        size,
        state.container.videoWall,
        orientation
      )

      return update(state, {
        container: {
          orientation: { $set: action.payload }
        },
        renderMultiplier: { $set: multiplier }
      })
    case types.SET_TEMPLATE_CONTAINER_SIZE:
      size = {}
      orientation = state.container.orientation.toUpperCase()

      size.width = action.payload.width
      size.height = action.payload.height

      multiplier = calculateMultiplier(
        size,
        state.container.videoWall,
        orientation
      )

      return update(state, {
        container: {
          size: { $set: size }
        },
        renderMultiplier: { $set: multiplier }
      })
    case types.SET_TEMPLATE_CONTAINER_VIDEO_WALL:
      multiplier = state.renderMultiplier
      orientation = state.container.orientation.toUpperCase()

      newVideoWall = update(state.container.videoWall, {
        $merge: action.payload
      })

      multiplier = calculateMultiplier(
        state.container.size,
        newVideoWall,
        orientation
      )

      return update(state, {
        container: {
          videoWall: { $set: newVideoWall }
        },
        renderMultiplier: { $set: multiplier }
      })

    case types.SET_CURRENT_TEMPLATE_ITEM:
      return update(state, {
        currentItemId: { $set: action.payload },
        selectedItems: { $set: [] }
      })

    case types.UPDATE_CURRENT_TEMPLATE_ITEM:
      return update(state, {
        items: {
          $merge: {
            [state.currentItemId]: update(state.items[state.currentItemId], {
              [action.payload.field]:
                action.payload.field === createTemplateConstants.TITLE ||
                action.payload.field === createTemplateConstants.FEATURE_ID
                  ? { $set: action.payload.data }
                  : { $merge: action.payload.data }
            })
          }
        }
      })

    case types.SET_CURRENT_TEMPLATE_ITEM_SIZE:
      item = state.items[state.currentItemId]
      size = { ...item.size }
      position = { ...item.position }

      value = action.payload.value

      switch (action.payload.field) {
        case createTemplateConstants.WIDTH:
          if (value > state.container.size.width - position.x) {
            value = state.container.size.width - position.x
          }
          size.width = value
          break
        case createTemplateConstants.HEIGHT:
          if (value > state.container.size.height - position.y) {
            value = state.container.size.height - position.y
          }
          size.height = value
          break
        default:
          return state
      }

      return update(state, {
        items: {
          $merge: {
            [state.currentItemId]: update(state.items[state.currentItemId], {
              size: { $set: size }
            })
          }
        }
      })

    case types.SET_CURRENT_TEMPLATE_ITEM_POSITION:
      item = state.items[state.currentItemId]
      position = { ...item.position }

      value = action.payload.value

      switch (action.payload.field) {
        case createTemplateConstants.X_AXIS:
          if (value > state.container.size.width - item.size.width) {
            value = state.container.size.width - item.size.width
          }
          position.x = value
          break
        case createTemplateConstants.Y_AXIS:
          if (value > state.container.size.height - item.size.height) {
            value = state.container.size.height - item.size.height
          }
          position.y = value
          break
        default:
          return state
      }

      return update(state, {
        items: {
          $merge: {
            [state.currentItemId]: update(state.items[state.currentItemId], {
              position: { $set: position }
            })
          }
        }
      })

    case types.SET_CURRENT_TEMPLATE_ITEM_ALIGNMENT:
      item = state.items[state.currentItemId]
      size = { ...item.size }
      position = { ...item.position }
      orientation = state.container.orientation.toUpperCase()

      const landscape = orientation === createTemplateConstants.LANDSCAPE

      const videoWallActive = state.container.videoWall.active
      const { x, y } = state.container.videoWall.props

      switch (action.payload) {
        case createTemplateConstants.LEFT:
          position.x = 0
          break
        case createTemplateConstants.RIGHT:
          position.x =
            (landscape
              ? state.container.size.width
              : state.container.size.height) *
              (videoWallActive ? x : 1) -
            item.size.width
          break
        case createTemplateConstants.TOP:
          position.y = 0
          break
        case createTemplateConstants.BOTTOM:
          position.y =
            (landscape
              ? state.container.size.height
              : state.container.size.width) *
              (videoWallActive ? y : 1) -
            item.size.height
          break
        case createTemplateConstants.H_STRETCH:
          size.width =
            (landscape
              ? state.container.size.width
              : state.container.size.height) * (videoWallActive ? x : 1)
          position.x = 0
          break
        case createTemplateConstants.V_STRETCH:
          size.height =
            (landscape
              ? state.container.size.height
              : state.container.size.width) * (videoWallActive ? y : 1)
          position.y = 0
          break
        default:
          return state
      }

      return update(state, {
        items: {
          $merge: {
            [state.currentItemId]: update(state.items[state.currentItemId], {
              position: { $set: position },
              size: { $set: size }
            })
          }
        }
      })

    case types.SET_CURRENT_TEMPLATE_ITEM_ROTATION:
      item = state.items[state.currentItemId]
      let rotate = item.styles.rotate

      switch (action.payload) {
        case createTemplateConstants.L_ROTATE:
          rotate = (rotate + 270) % 360
          break
        case createTemplateConstants.R_ROTATE:
          rotate = (rotate + 90) % 360
          break
        default:
          return state
      }

      return update(state, {
        items: {
          $merge: {
            [state.currentItemId]: update(state.items[state.currentItemId], {
              styles: {
                rotate: { $set: rotate }
              }
            })
          }
        }
      })

    case types.FLIP_CURRENT_TEMPLATE_ITEM:
      item = state.items[state.currentItemId]
      let vFlip = item.styles.vFlip
      let hFlip = item.styles.hFlip

      switch (action.payload) {
        case createTemplateConstants.H_FLIP:
          hFlip = !hFlip
          break
        case createTemplateConstants.V_FLIP:
          vFlip = !vFlip
          break
        default:
          return state
      }

      return update(state, {
        items: {
          $merge: {
            [state.currentItemId]: update(state.items[state.currentItemId], {
              styles: { $merge: { hFlip, vFlip } }
            })
          }
        }
      })

    case types.DELETE_TEMPLATE_ITEMS:
      return update(state, {
        items: { $set: {} }
      })

    case types.DELETE_TEMPLATE_ITEM:
      const itemsToDelete = [action.payload, ...state.selectedItems]

      return update(state, {
        items: { $unset: itemsToDelete },
        currentItemId: { $set: -1 },
        selectedItems: { $set: [] }
      })

    case types.ADD_TEMPLATE_ITEM:
      newId = state.maxId + 1
      newOrder = state.maxOrder + 1
      newItem = {
        id: newId,
        featureId: action.payload.featureId,
        title: action.payload.featureTitle
          ? action.payload.featureTitle
          : newId + 1 + '. ' + action.payload.featureTab,
        type: action.payload.type,
        icon: action.payload.icon,
        size: action.payload.size
          ? action.payload.size
          : { width: 640, height: 360 },
        position: action.payload.position
          ? action.payload.position
          : { x: 0, y: 0 },
        media: action.payload.playbackContent
          ? action.payload.playbackContent
          : {},
        touch: action.payload.touch ? action.payload.touch : {},
        zoneSettings: action.payload.zoneSettings
          ? action.payload.zoneSettings
          : {},
        order: newOrder,
        locked: false,
        styles: {
          isTouchZone: action.payload.isTouchZone
            ? action.payload.isTouchZone
            : false,
          rotate: 0,
          opacity: 1,
          background: '#414874',
          borderWidth: 0,
          borderHeight: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderColor: '#000',
          vFlip: false,
          hFlip: false,
          ...(action.payload.styles && action.payload.styles)
        }
      }

      return update(state, {
        items: {
          $merge: { [newId]: newItem }
        },
        maxId: { $set: newId },
        maxOrder: { $set: newOrder }
      })

    case types.COPY_TEMPLATE_ITEM:
      item = state.items[action.payload]
      newId = state.maxId + 1
      newOrder = state.maxOrder + 1
      newItem = update(item, {
        title: { $set: `${item.title} Copy` },
        id: { $set: newId },
        order: { $set: newOrder }
      })

      return update(state, {
        items: {
          $merge: { [newId]: newItem }
        },
        maxId: { $set: newId },
        maxOrder: { $set: newOrder }
      })

    case types.MOVE_TEMPLATE_ITEM_FORWARD:
      newOrder = state.maxOrder + 1

      return update(state, {
        items: {
          [action.payload]: {
            order: { $set: newOrder }
          }
        },
        maxOrder: { $set: newOrder }
      })

    case types.MOVE_TEMPLATE_ITEM_BACK:
      const itemsCopy = { ...state.items }

      newOrder = state.maxOrder + 1

      Object.keys(itemsCopy).forEach(id => {
        if (+id === action.payload) {
          itemsCopy[id].order = 0
        } else {
          itemsCopy[id].order += 1
        }
      })

      return update(state, {
        items: { $set: itemsCopy },
        maxOrder: { $set: newOrder }
      })

    case types.ZOOM_IN_TEMPLATE_CONTAINER:
      newVideoWall = update(state.container.videoWall, {
        zoomed: { $set: true }
      })

      orientation = state.container.orientation.toUpperCase()
      multiplier = calculateMultiplier(
        state.container.size,
        newVideoWall,
        orientation
      )

      return update(state, {
        container: {
          videoWall: { $set: newVideoWall }
        },
        renderMultiplier: { $set: multiplier }
      })

    case types.ZOOM_OUT_TEMPLATE_CONTAINER:
      newVideoWall = update(state.container.videoWall, {
        zoomed: { $set: false }
      })

      orientation = state.container.orientation.toUpperCase()
      multiplier = calculateMultiplier(
        state.container.size,
        newVideoWall,
        orientation
      )

      return update(state, {
        container: {
          videoWall: { $set: newVideoWall }
        },
        renderMultiplier: { $set: multiplier }
      })

    case types.SET_MULTIPLIER:
      return update(state, {
        renderMultiplier: { $set: action.payload }
      })

    case types.LOCK_TEMPLATE_ITEM:
      return update(state, {
        items: {
          [action.payload]: {
            locked: { $set: true }
          }
        }
      })

    case types.UNLOCK_TEMPLATE_ITEM:
      return update(state, {
        items: {
          [action.payload]: {
            locked: { $set: false }
          }
        }
      })

    case types.TOGGLE_TEMPLATE_ITEM_TO_SELECTED:
      const index = state.selectedItems.indexOf(action.payload)
      if (index !== -1) {
        return update(state, {
          selectedItems: { $splice: [[index, 1]] }
        })
      } else {
        return update(state, {
          selectedItems: { $push: [action.payload] }
        })
      }

    case types.CLEAR_SELECTED_ITEMS:
      return update(state, {
        selectedItems: { $set: [] }
      })

    default:
      return state
  }
}
