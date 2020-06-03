import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsDetailsLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 344
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="100" height="30" />
    <rect x="210" y="0" rx="6" ry="6" width="200" height="30" />

    <rect x="0" y="50" rx="6" ry="6" width="120" height="30" />
    <rect x="360" y="50" rx="6" ry="6" width="50" height="30" />

    <rect x="0" y="100" rx="6" ry="6" width="60" height="30" />
    <rect x="320" y="100" rx="6" ry="6" width="90" height="30" />

    <rect x="0" y="150" rx="6" ry="6" width="70" height="30" />
    <rect x="155" y="150" rx="6" ry="6" width="30" height="30" />
    <rect x="205" y="150" rx="6" ry="6" width="50" height="30" />
    <rect x="340" y="150" rx="6" ry="6" width="70" height="30" />

    <rect x="0" y="200" rx="6" ry="6" width="100" height="30" />
    <rect x="330" y="200" rx="6" ry="6" width="80" height="30" />

    <rect x="0" y="250" rx="6" ry="6" width="95" height="30" />
    <rect x="300" y="250" rx="6" ry="6" width="110" height="30" />

    <rect x="0" y="300" rx="6" ry="6" width="95" height="30" />
    <rect x="260" y="300" rx="6" ry="6" width="150" height="30" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsDetailsLoader)
