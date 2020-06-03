import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsSecurityLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 86
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="15" rx="6" ry="6" width="200" height="20" />
    <rect x="485" y="15" rx="6" ry="6" width="60" height="20" />

    <rect x="0" y="65" rx="6" ry="6" width="180" height="20" />
    <rect x="495" y="65" rx="6" ry="6" width="50" height="20" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsSecurityLoader)
