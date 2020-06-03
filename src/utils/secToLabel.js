const pad = num => ('0' + num).slice(-2)

export const secToLabel = secs => {
  let minutes = Math.floor(secs / 60)
  secs = secs % 60
  const hours = Math.floor(minutes / 60)
  minutes = minutes % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
}

export const labelToSec = label => {
  const times = label.split(':')
  times.reverse()
  const x = times.length
  let y = 0,
    z
  for (let i = 0; i < x; i++) {
    z = times[i] * Math.pow(60, i)
    y += z
  }
  return y
}
