export default function fontsTransform(fonts) {
  let formattedFonts = []
  fonts.forEach((font, index) => {
    formattedFonts.push({
      id: index,
      name: font.family,
      selected: false,
      type: font.variants[0]
    })
  })
  return formattedFonts
}
