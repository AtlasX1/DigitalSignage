let id = 0

export function createMediaDummyData(
  type,
  fileName,
  group,
  duration,
  updatedOn,
  size,
  status,
  approved,
  screenPreviewURL
) {
  id += 1
  return {
    id,
    type,
    fileName,
    group,
    duration,
    updatedOn,
    size,
    status,
    approved,
    screenPreviewURL
  }
}
export function createPlaylistDummyData(
  type,
  title,
  group,
  createdBy,
  fileCount,
  status,
  screenPreviewURL
) {
  id += 1
  return {
    id,
    type,
    title,
    group,
    createdBy,
    fileCount,
    status,
    screenPreviewURL
  }
}
export function createPlaylistPreviewMediaDummyData(
  type,
  title,
  duration,
  resolution,
  lastUpdated,
  data
) {
  id += 1
  return { id, type, title, duration, resolution, lastUpdated, data }
}
export function createTemplateDummyData(
  type,
  name,
  group,
  duration,
  resolution,
  orientation,
  status,
  screenPreviewURL
) {
  id += 1
  return {
    id,
    type,
    name,
    group,
    duration,
    resolution,
    orientation,
    status,
    screenPreviewURL
  }
}
export function createReportDummyData(
  type,
  userName,
  email,
  phone,
  timeStamp,
  status,
  IPAddress
) {
  id += 1
  return { id, type, userName, email, phone, timeStamp, status, IPAddress }
}
export function createUserDummyData(
  type,
  name,
  client,
  email,
  phone,
  lastLogin,
  status
) {
  id += 1
  return { id, type, name, client, email, phone, lastLogin, status }
}
export function createDeviceDummyData(
  teamviewerStatus,
  deviceName,
  label,
  account,
  lastUpdate,
  firmwareVersion,
  status,
  screenPreviewURL
) {
  id += 1
  return {
    id,
    teamviewerStatus,
    deviceName,
    label,
    account,
    lastUpdate,
    firmwareVersion,
    status,
    screenPreviewURL
  }
}
export function createDeviceGridDummyData(
  teamviewerStatus,
  deviceName,
  label,
  account,
  lastUpdate,
  firmwareVersion,
  status,
  titleName,
  location,
  lanIP,
  wanIP,
  lastReboot,
  lastCheckIn,
  details,
  deviceHardDisk
) {
  id += 1
  return {
    id,
    teamviewerStatus,
    deviceName,
    label,
    account,
    lastUpdate,
    firmwareVersion,
    status,
    titleName,
    location,
    lanIP,
    wanIP,
    lastReboot,
    lastCheckIn,
    details,
    deviceHardDisk
  }
}
export function createDeviceScreenPreviewDummyData(titleName, screenPreview) {
  id += 1
  return { titleName, screenPreview }
}
export function createClientDummyData(
  id,
  client,
  trial,
  packageName,
  createdOn,
  devices,
  users,
  type
) {
  return { id, client, trial, packageName, createdOn, devices, users, type }
}
export function createPackagesDummyData(featurePackage, bandwidth) {
  id += 1
  return { id, featurePackage, bandwidth }
}
export function createMessagesDummyData(emailTemplate, subject) {
  id += 1
  return { id, emailTemplate, subject }
}
export function createHelpPagesDummyData(page, pageAlias, url, enabled) {
  id += 1
  return { id, page, pageAlias, url, enabled }
}
export function createBannersDummyData(
  bannerType,
  bannerName,
  enabledUserType,
  expirationDate
) {
  id += 1
  return { id, bannerType, bannerName, enabledUserType, expirationDate }
}
export function createChannelsDummyData(
  channel,
  client,
  embeddedCode,
  lastUpdated
) {
  id += 1
  return { id, channel, client, embeddedCode, lastUpdated }
}
export function createOEMClientsDummyData(
  name,
  packageName,
  createdOn,
  deviceCount,
  expireDate,
  status
) {
  id += 1
  return { id, name, packageName, createdOn, deviceCount, expireDate, status }
}
export function createRSSFeedsDummyData(
  name,
  category,
  updatedOn,
  url,
  enabled
) {
  id += 1
  return { id, name, category, updatedOn, url, enabled }
}
export function createMediaUsageDummyData(
  typeName,
  fileName,
  valid,
  inValid,
  size,
  screenPreviewURL
) {
  id += 1
  return { id, typeName, fileName, valid, inValid, size, screenPreviewURL }
}
export function createClientsByWidgetsDummyData(
  typeName,
  fileName,
  clients,
  screenPreviewURL
) {
  id += 1
  return { id, typeName, fileName, clients, screenPreviewURL }
}
export function createFontDummyData(name, type, selected) {
  id += 1
  return { id, name, type, selected }
}
export function createTagsDummyData(name, color, items) {
  id += 1
  return { id, name, color, items }
}
