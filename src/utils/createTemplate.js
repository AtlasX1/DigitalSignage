import { createTemplateConstants } from '../constants'

export const calculateSizeForRender = ({
  width,
  height,
  multiplier,
  videoWall = { active: false }
}) => {
  if (!videoWall.active) {
    return {
      width: Math.round(width / multiplier),
      height: Math.round(height / multiplier)
    }
  } else {
    const w1 = Math.round(width / multiplier)
    const h1 = Math.round(height / multiplier)

    return {
      width: w1 * videoWall.props.x,
      height: h1 * videoWall.props.y
    }
  }
}

export const calculateSizeForConfig = ({ width, height, multiplier }) => ({
  width: Math.round(width * multiplier),
  height: Math.round(height * multiplier)
})

export const calculatePositionForRender = ({ x, y, multiplier }) => ({
  x: Math.round(x / multiplier),
  y: Math.round(y / multiplier)
})

export const calculatePositionForConfig = ({ x, y, multiplier }) => ({
  x: Math.round(x * multiplier),
  y: Math.round(y * multiplier)
})

export const calculateMultiplier = (size, videoWall, orientation) => {
  const defaultMult =
    Math.max(size.width, size.height) /
    (orientation === createTemplateConstants.LANDSCAPE
      ? createTemplateConstants.MAX_WIDTH_LANDSCAPE
      : createTemplateConstants.MAX_HEIGHT_PORTRAIT)
  const { x, y } = videoWall.props

  let multiplier = defaultMult

  if (!videoWall.active || videoWall.zoomed) return multiplier

  if (orientation === createTemplateConstants.LANDSCAPE) {
    if (x === 1 && y === 1) {
      multiplier = defaultMult
    } else if (
      (x === 1 && y === 2) ||
      (x === 2 && y === 1) ||
      (x === 2 && y === 2)
    ) {
      multiplier = defaultMult * 2.05
    } else if (
      (x === 1 && y === 3) ||
      (x === 3 && y === 1) ||
      (x === 2 && y === 3) ||
      (x === 3 && y === 2)
    ) {
      multiplier = defaultMult * 3
    } else if (
      (x === 1 && y === 4) ||
      (x === 4 && y === 1) ||
      (x === 2 && y === 4) ||
      (x === 4 && y === 2)
    ) {
      multiplier = defaultMult * 4
    } else if ((x === 1 && y === 6) || (x === 6 && y === 1)) {
      multiplier = defaultMult * 6
    } else if ((x === 1 && y === 8) || (x === 8 && y === 1)) {
      multiplier = defaultMult * 8
    }
  } else {
    if (x === 1 && y === 1) {
      multiplier = defaultMult
    } else if (x === 1 && y === 2) {
      multiplier = defaultMult * 2.43
    } else if (x === 2 && y === 1) {
      multiplier = defaultMult * 1.02
    } else if (
      (x === 2 && y === 2) ||
      (x === 3 && y === 2) ||
      (x === 4 && y === 2)
    ) {
      multiplier = defaultMult * 2
    } else if ((x === 1 && y === 3) || (x === 2 && y === 3)) {
      multiplier = defaultMult * 3.64
    } else if (x === 3 && y === 1) {
      if (size.width === 1280 && size.height === 768) {
        multiplier = 1.8
      } else if (size.width === 1280 && size.height === 728) {
        multiplier = 1.7
      } else if (size.width === 1024 && size.height === 768) {
        multiplier = 1.79
      } else if (size.width === 960 && size.height === 600) {
        multiplier = 1.45
      } else if (size.width === 800 && size.height === 600) {
        multiplier = 1.4
      } else if (size.width === 700 && size.height === 450) {
        multiplier = 1.05
      } else {
        multiplier = defaultMult * 1.12
      }
    } else if ((x === 1 && y === 4) || (x === 2 && y === 4)) {
      multiplier = defaultMult * 4.87
    } else if (x === 4 && y === 1) {
      if (
        (size.width === 1280 && size.height === 768) ||
        (size.width === 1024 && size.height === 768)
      ) {
        multiplier = 2.4
      } else if (
        (size.width === 960 && size.height === 600) ||
        (size.width === 800 && size.height === 600)
      ) {
        multiplier = 1.87
      } else if (size.width === 700 && size.height === 450) {
        multiplier = 1.4
      } else {
        multiplier = defaultMult * 1.49
      }
    } else if (x === 1 && y === 6) {
      multiplier = defaultMult * 7.35
    } else if (x === 6 && y === 1) {
      if (
        (size.width === 1280 && size.height === 768) ||
        (size.width === 1024 && size.height === 768)
      ) {
        multiplier = 3.6
      } else if (
        (size.width === 960 && size.height === 600) ||
        (size.width === 800 && size.height === 600)
      ) {
        multiplier = 2.81
      } else if (size.width === 700 && size.height === 450) {
        multiplier = 2.1
      } else {
        multiplier = defaultMult * 2.24
      }
    } else if (x === 1 && y === 8) {
      multiplier = defaultMult * 9.77
    } else if (x === 8 && y === 1) {
      if (
        (size.width === 1280 && size.height === 768) ||
        (size.width === 1024 && size.height === 768)
      ) {
        multiplier = 4.8
      } else if (
        (size.width === 960 && size.height === 600) ||
        (size.width === 800 && size.height === 600)
      ) {
        multiplier = 3.75
      } else if (size.width === 700 && size.height === 450) {
        multiplier = 2.81
      } else {
        multiplier = defaultMult * 3
      }
    }
  }

  return multiplier
}
