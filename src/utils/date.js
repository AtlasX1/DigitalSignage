export const secToMs = sec => sec * 1000

export const calculateExpires = sec => {
  const ms = secToMs(sec)
  return Date.now() + ms
}

export const isExpired = () => Date.now() > localStorage.getItem('expiresIn')
