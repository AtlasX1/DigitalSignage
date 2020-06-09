import {
  getItems as getHTMLContents,
  deleteItem as deleteHTMLContents,
  deleteSelectedItems as deleteSelectedHTMLContents,
  clearResponseInfo as clearResponseInfoHTMLContent
} from '../../../actions/htmlContentActions'

const groupActions = {
  getItems: getHTMLContents,
  deleteItem: deleteHTMLContents,
  clearResponseInfo: clearResponseInfoHTMLContent,
  deleteSelectedItems: deleteSelectedHTMLContents
}

const translateConfig = {
  tabTitle: 'HTML Content Library - Digital Signage',
  title: 'HTML Content page',
  add: 'Add Themes',
  category: 'HTML Category',
  notifyKey: 'HTML Content'
}

const columns = [
  { id: 'thumbUri', label: 'Thumb nail' },
  { id: 'name', label: 'Name' },
  {
    id: 'category',
    label: 'Category'
  },
  {
    id: 'updatedAt',
    label: 'Updated on'
  }
]

const placeholder = 'No saved HTML content'

export { groupActions, translateConfig, columns, placeholder }
