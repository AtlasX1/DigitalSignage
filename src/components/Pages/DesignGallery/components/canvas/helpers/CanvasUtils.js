class CanvasUtils {
  checkTextProp = (obj, prop) => {
    switch (prop) {
      case 'bold':
        return obj.fontWeight === prop
      case 'italic':
        return obj.fontStyle === prop
      case 'underline':
        return obj.underline
      case 'through':
        return obj.linethrough
      case 'caps':
        return obj.fontUppercase
      default:
        return false
    }
  }

  checkTextAlign = (obj, prop) => {
    switch (prop) {
      case 'left':
      case 'right':
      case 'center':
      case 'justify':
        return obj.textAlign === prop
      default:
        return false
    }
  }
}

export default CanvasUtils
