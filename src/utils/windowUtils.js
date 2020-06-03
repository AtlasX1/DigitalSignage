import * as R from 'ramda'
import { capitalize } from 'utils/index'

const parsePathname = R.compose(
  R.join(' '),
  R.map(capitalize),
  R.split('-'),
  R.head,
  R.split('/'),
  R.tail,
  R.replace('/org', ''),
  R.replace('/system', ''),
  R.replace('/enterprise', '')
)
const getTitle = R.join(' | ')
const setTitle = (pathname, windowTitle) => {
  document.title = getTitle([parsePathname(pathname), windowTitle])
}

export default {
  setTitle
}
