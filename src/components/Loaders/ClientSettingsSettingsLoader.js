import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsSettingsLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 147
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="15" rx="6" ry="6" width="100" height="20" />
    <rect x="505" y="15" rx="6" ry="6" width="40" height="20" />

    <rect x="0" y="65" rx="6" ry="6" width="150" height="20" />
    <rect x="395" y="60" rx="6" ry="6" width="150" height="30" />

    <rect x="0" y="115" rx="6" ry="6" width="300" height="20" />
    <rect x="505" y="115" rx="6" ry="6" width="40" height="20" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsSettingsLoader)
