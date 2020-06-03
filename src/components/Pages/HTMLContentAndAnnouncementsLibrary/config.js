import {
  getItems as getAnnouncements,
  deleteItem as deleteAnnouncements,
  deleteSelectedItems as deleteSelectedAnnouncements,
  clearResponseInfo as clearResponseInfoAnnouncement
} from '../../../actions/announcementActions'

import {
  getItems as getHTMLContents,
  deleteItem as deleteHTMLContents,
  deleteSelectedItems as deleteSelectedHTMLContents,
  clearResponseInfo as clearResponseInfoHTMLContent
} from '../../../actions/htmlContentActions'
import { ANNOUNCEMENT, HTML_CONTENT } from 'constants/library'

const groupActions = {
  [ANNOUNCEMENT]: {
    getItems: getAnnouncements,
    deleteItem: deleteAnnouncements,
    clearResponseInfo: clearResponseInfoAnnouncement,
    deleteSelectedItems: deleteSelectedAnnouncements
  },
  [HTML_CONTENT]: {
    getItems: getHTMLContents,
    deleteItem: deleteHTMLContents,
    clearResponseInfo: clearResponseInfoHTMLContent,
    deleteSelectedItems: deleteSelectedHTMLContents
  }
}

const translateConfig = {
  [ANNOUNCEMENT]: {
    tabTitle: 'Announcements Library - Digital Signage',
    title: 'Announcements page title',
    add: 'Add announcement theme',
    category: 'Announcement Category',
    notifyKey: 'Announcement'
  },
  [HTML_CONTENT]: {
    tabTitle: 'HTML Content Library - Digital Signage',
    title: 'HTML Content page',
    add: 'Add Themes',
    category: 'HTML Category',
    notifyKey: 'HTML Content'
  }
}

const columns = {
  [ANNOUNCEMENT]: [
    { id: 'thumbUri', label: 'Theme' },
    { id: 'name', label: 'Name' },
    {
      id: 'category',
      label: 'Category'
    },
    {
      id: 'orientation',
      label: 'Orientation'
    },
    {
      id: 'updatedAt',
      label: 'Updated on'
    }
  ],
  [HTML_CONTENT]: [
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
}

const placeholder = {
  [ANNOUNCEMENT]: 'No saved announcement',
  [HTML_CONTENT]: 'No saved HTML content'
}
export { groupActions, translateConfig, columns, placeholder }
