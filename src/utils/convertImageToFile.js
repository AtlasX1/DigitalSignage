const convertImageToFile = (src, type = 'image/jpg') =>
  new Promise(resolve => {
    try {
      const img = new Image()
      const c = document.createElement('canvas')
      const ctx = c.getContext('2d')

      img.src = src
      img.crossOrigin = ''

      img.onload = function () {
        c.width = this.naturalWidth
        c.height = this.naturalHeight
        ctx.drawImage(this, 0, 0)
        c.toBlob(
          blob => {
            const fileName = src.replace(/^.*[\\/]/, '')
            const file = new File([blob], fileName, { type })
            file.path = src

            resolve(file)
          },
          type,
          0.75
        )
      }
    } catch (err) {
      resolve(err)
    }
  })

export default convertImageToFile
