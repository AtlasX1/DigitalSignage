import featureConstants from 'constants/featureConstants'

const {
  Feeds,
  RSSFeed,
  DemoFeeds,
  MediaRSS,
  LicensedChannels,
  YouTube,
  Radio,
  CustomWidget
} = featureConstants

const config = {
  [RSSFeed]: {
    keyWord: 'RSS Feed',
    title: 'RSS Feeds',
    tabTitle: 'RSS Feeds - Digital Signage',
    add: 'Add RSS Feed',
    placeholderMessage: 'No created RSS Feeds',
    columns: [
      { id: 'logo', label: 'Logo', display: true },
      { id: 'name', label: 'Name', display: true },
      { id: 'category', label: 'Category', display: true },
      { id: 'url', label: 'URL', display: true, align: 'center' },
      { id: 'updatedOn', label: 'Updated On', align: 'center', display: true }
    ]
  },
  [Feeds]: {
    keyWord: 'Feed',
    title: 'Feeds',
    tabTitle: 'Feeds - Digital Signage',
    add: 'Add Feed',
    placeholderMessage: 'No created Feeds',
    columns: [
      { id: 'client', label: 'Client', display: true },
      { id: 'thumbnail', label: 'Thumbnail', display: true },
      { id: 'feedUrl', label: 'Feed URL', align: 'center', display: true },
      {
        id: 'expireDate',
        label: 'Expire Date',
        align: 'center',
        display: true
      }
    ]
  },
  [DemoFeeds]: {
    keyWord: 'Demo Feed',
    title: 'Demo Feeds',
    tabTitle: 'Demo Feeds - Digital Signage',
    add: 'Add Demo Feed',
    placeholderMessage: 'No created Demo Feed',
    columns: [
      { id: 'thumbnail', label: 'Thumbnail', display: true },
      { id: 'name', label: 'Name', display: true },
      { id: 'category', label: 'Category', display: true },
      { id: 'feedUrl', label: 'Feed URL', display: true, align: 'center' }
    ]
  },
  [MediaRSS]: {
    keyWord: 'Media RSS Channel',
    title: 'Media RSS Channels',
    tabTitle: 'Media RSS Channels - Digital Signage',
    add: 'Add Media RSS Channel',
    placeholderMessage: 'No created RSS Channel',
    columns: [
      { id: 'logo', label: 'Logo', display: true },
      { id: 'name', label: 'Name', display: true },
      { id: 'category', label: 'Category', display: true },
      { id: 'url', label: 'URL', display: true, align: 'center' },
      { id: 'updatedOn', label: 'Updated On', display: true, align: 'center' }
    ]
  },
  [LicensedChannels]: {
    keyWord: 'Licensed Channel',
    title: 'Licensed Channels',
    tabTitle: 'Licensed Channels - Digital Signage',
    add: 'Add Licensed Channel',
    placeholderMessage: 'No created Licensed Channel',
    columns: [
      { id: 'logo', label: 'Logo', display: true },
      { id: 'name', label: 'Name', display: true },
      { id: 'category', label: 'Category', display: true },
      { id: 'url', label: 'URL', display: true, align: 'center' },
      { id: 'updatedOn', label: 'Updated On', display: true, align: 'center' }
    ]
  },
  [YouTube]: {
    keyWord: 'YouTube Channel',
    title: 'YouTube Channels',
    tabTitle: 'YouTube Channels - Digital Signage',
    add: 'Add YouTube',
    placeholderMessage: 'No created YouTube Channel',
    columns: [
      { id: 'logo', label: 'Logo', display: true },
      { id: 'name', label: 'Name', display: true },
      { id: 'category', label: 'Category', display: true },
      { id: 'url', label: 'URL', display: true, align: 'center' },
      { id: 'updatedOn', label: 'Updated On', display: true, align: 'center' }
    ]
  },
  [Radio]: {
    keyWord: 'Radio Station',
    title: 'Radio Stations',
    tabTitle: 'Radio Stations - Digital Signage',
    add: 'Add Radio Station',
    placeholderMessage: 'No created Radio Station',
    columns: [
      { id: 'logo', label: 'Logo', display: true },
      { id: 'name', label: 'Name', display: true },
      { id: 'category', label: 'Category', display: true },
      { id: 'url', label: 'URL', display: true, align: 'center' },
      { id: 'updatedOn', label: 'Updated On', display: true, align: 'center' }
    ]
  },
  [CustomWidget]: {
    keyWord: 'Custom Widget',
    title: 'Custom Widgets',
    tabTitle: 'Custom Widget - Digital Signage',
    add: 'Add Custom Widget',
    placeholderMessage: 'No created Custom Widget',
    columns: [
      { id: 'thumbnail', label: 'Thumbnail', display: true },
      { id: 'clientName', label: 'Client Name', display: true },
      { id: 'widgetName', label: 'Widget Name', display: true },
      { id: 'url', label: 'URL', display: true, align: 'center' },
      {
        id: 'expireDate',
        label: 'Expire Date',
        display: true,
        align: 'center'
      }
    ]
  }
}

export default config
