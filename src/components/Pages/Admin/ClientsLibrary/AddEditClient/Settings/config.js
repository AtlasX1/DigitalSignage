const settingsField = [
  {
    id: 1,
    label: 'Playback Reporting',
    name: 'playbackReporting'
  },
  {
    id: 2,
    label: "Substitute for 'No media to display",
    name: 'substituteNoMediaToDisplay'
  },
  {
    id: 3,
    label: 'Enable Desktop Emergency Notification',
    name: 'desktopNotification'
  },
  {
    id: 4,
    label: 'Enable / Disable Sleep Mode',
    name: 'sleepMode'
  }
]

const settingsSecurityField = [
  {
    id: 1,
    label: 'Two Factor Authentication(2FA)',
    name: 'is2faEnabled'
  },
  {
    id: 2,
    label: 'SAML Single Sign-On (SSO)',
    name: 'ssoStatus'
  },
  {
    id: 3,
    label: 'Auto logout ( 24min - 8hr )',
    name: 'autoLogOut'
  }
]

export { settingsField, settingsSecurityField }
