const parseShortHexColor = color => {
  const m = color.match(/^#([0-9a-f]{3})$/i)
  if (m && m[1]) {
    // in 3-character format translated to 6-character
    // by multiplying each value by 0x11
    return [
      parseInt(m[1].charAt(0), 16) * 0x11,
      parseInt(m[1].charAt(1), 16) * 0x11,
      parseInt(m[1].charAt(2), 16) * 0x11
    ]
  }
}
const parseHexColor = color => {
  const m = color.match(/^#([0-9a-f]{6})$/i)
  if (m && m[1]) {
    return [
      parseInt(m[1].substr(0, 2), 16),
      parseInt(m[1].substr(2, 2), 16),
      parseInt(m[1].substr(4, 2), 16)
    ]
  }
}
const parseRgbaColor = color => {
  // Will also work for rgb format
  const m = color.match(
    /^rgb(a)?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*(\d*.\d*)\s*)?\)$/i
  )
  if (m && m[2] && m[3] && m[4]) {
    const hues = [parseInt(m[2], 10), parseInt(m[3], 10), parseInt(m[4], 10)]
    const alpha =
      m[6] && m[6][0] !== '1' ? (m[6][0] === '.' ? `0${m[6]}` : m[6]) : null
    return alpha ? [...hues, Math.round(parseFloat(alpha, 10) * 255)] : hues
  }
}
const shadeColor = (color, percent = 0, displayShort = false) => {
  if (!color) {
    return '#000'
  }
  const parsedColor =
    parseShortHexColor(color) || parseHexColor(color) || parseRgbaColor(color)
  if (!parsedColor) {
    return '#000'
  }

  const shadedColor = parsedColor.map(hue =>
    Math.min(255, Math.round(hue * (1 + percent / 100)))
  )
  const isShortHex = () => shadedColor.every(hue => hue % 0x11 === 0)

  return shadedColor.reduce(
    (color, hue) =>
      color +
      (displayShort && isShortHex()
        ? hue.toString(16)[0]
        : hue.toString(16).padStart(2, '0')),
    '#'
  )
}

export default shadeColor
