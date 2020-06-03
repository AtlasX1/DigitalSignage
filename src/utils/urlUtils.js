export function hasHTTPS(value) {
  return Boolean(value.match(/^(https:\/\/)/))
}

export function completeUrl(value) {
  return value ? (hasHTTPS(value) ? value : `https://${value}`) : ''
}
