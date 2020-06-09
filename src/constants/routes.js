import {
  HTML_CONTENT,
  EMAIL_TEMPLATE,
  CUSTOM_EMAIL_TEMPLATE
} from 'constants/library'
import featureConstants from 'constants/featureConstants'

const {
  Feeds,
  RSSFeed,
  DemoFeeds,
  MediaRSS,
  YouTube,
  Radio,
  CustomWidget
} = featureConstants

const systemPrefix = '/system'

const libraryGroups = {
  workplacePoster: `${systemPrefix}/workplace-posters-library`,
  [HTML_CONTENT]: `${systemPrefix}/html-contents-library`,
  [EMAIL_TEMPLATE]: `${systemPrefix}/messages-library`,
  [CUSTOM_EMAIL_TEMPLATE]: `${systemPrefix}/custom-messages-library`,
  banner: `${systemPrefix}/banners-library`,

  [RSSFeed]: `${systemPrefix}/rss-feeds-library`,
  [Feeds]: `${systemPrefix}/feeds`,
  [DemoFeeds]: `${systemPrefix}/demo-feeds`,
  [MediaRSS]: `${systemPrefix}/media-rss`,
  [YouTube]: `${systemPrefix}/youtube`,
  [Radio]: `${systemPrefix}/radio`,
  [CustomWidget]: `${systemPrefix}/custom-widget`
}

const generateLibraryRoutes = prefix => ({
  root: libraryGroups[prefix],
  add: libraryGroups[prefix] + '/add',
  tags: libraryGroups[prefix] + '/tags',
  edit: libraryGroups[prefix] + '/:id/edit',
  categories: libraryGroups[prefix] + '/categories'
})

const libraryRoutes = Object.keys(libraryGroups).reduce(
  (accum, prefix) => ({
    ...accum,
    [prefix]: generateLibraryRoutes(prefix)
  }),
  {}
)

const routeByName = {
  ...libraryRoutes,
  users: {
    root: 'users-library',
    add: 'users-library/add',
    groups: 'users-library/group',
    edit: 'users-library/:id/edit',
    permissions: 'users-library/:id/permissions/:entity',
    groupsPermission: 'users-library/group/:id/permissions/:entity',
    clone: 'users-library/:id/clone'
  },
  clientUsers: {
    root: `${systemPrefix}/org-users-library`,
    add: `${systemPrefix}/org-users-library/add`,
    edit: `${systemPrefix}/org-users-library/:id/edit`
  },
  clients: {
    root: 'clients-library',
    edit: 'clients-library/:id/edit',
    notes: (clientId = ':id') => `clients-library/note/${clientId}`,
    add: 'clients-library/add',
    groups: 'clients-library/groups',
    superAdminSettings: 'clients-library/:id/super-admin-settings',
    WLSuperAdminSettings:
      'clients-library/:id/white-label-super-admin-settings',
    superAdminSettingsWithId: id =>
      `clients-library/${id}/super-admin-settings`,
    WLSuperAdminSettingsWithId: id =>
      `clients-library/${id}/white-label-super-admin-settings`,
    editWithId: id => `clients-library/${id}/edit`
  },
  playlist: {
    root: '/playlist-library',
    edit: '/playlist-library/:id/edit',
    create: '/playlist-library/create',
    groups: '/playlist-library/groups',
    preview: '/playlist-library/:id/preview',
    interactive: '/playlist-library/interactive-playlist',
    editInteractive: '/playlist-library/interactive-playlist/:id/edit',
    smart: '/playlist-library/smart-playlist',
    editSmart: '/playlist-library/smart-playlist/:id/edit',
    editSmartPlaylist: id => `/playlist-library/smart-playlist/${id}/edit`,
    editWithId: id => `/playlist-library/${id}/edit`,
    previewWithId: id => `/playlist-library/${id}/preview`
  },
  schedule: {
    root: '/schedule-library',
    edit: '/schedule-library/:id/edit',
    groups: '/schedule-library/groups',
    publish: '/schedule-library/schedule-publish',
    editWithId: id => `/schedule-library/${id}/edit`
  },
  template: {
    root: '/template-library',
    list: '/template-library/list',
    grid: '/template-library/grid',
    groups: '/template-library/list/groups',
    create: '/template-library/list/create-template',
    edit: '/template-library/list/create-template/:id?',
    editWithId: id => `/template-library/list/create-template/${id}`
  },
  device: {
    root: 'device-library',
    list: 'device-library/list',
    grid: 'device-library/grid',
    edit: 'device-library/list/edit/:id',
    goToEdit: id => `device-library/list/edit/${id}`,
    editGrid: 'device-library/grid/edit/:id',
    goToEditGrid: id => `device-library/grid/edit/${id}`,
    editCloseLink: backTo => `device-library/${backTo}`,
    add: 'device-library/list/add-device',
    screenPreview: 'device-library/grid/screen-previews',
    channelsPreview: 'device-library/grid/channel-previews',
    groups: 'device-library/grid/groups',
    note: 'device-library/list/note/:id',
    goToNote: id => `device-library/list/note/${id}`,
    alerts: {
      set: 'device-library/list/set-alerts',
      match: 'device-library/list/set-alerts/:id',
      getByName: name => `device-library/list/set-alerts/${name}`
    }
  },
  dashboard: {
    root: `${systemPrefix}/dashboard`
  },
  tag: {
    root: 'tags-library'
  }
}

export default routeByName
