export const formatBytes = (bytes, decimals) => {
  if (bytes === 0) return 0
  let k = 1024,
    dm = decimals <= 0 ? 0 : decimals || 2,
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
}
