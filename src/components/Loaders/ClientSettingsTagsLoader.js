import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsTagsLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 30
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="70" height="30" />
    <rect x="90" y="0" rx="6" ry="6" width="70" height="30" />
    <rect x="180" y="0" rx="6" ry="6" width="70" height="30" />
    <rect x="270" y="0" rx="6" ry="6" width="70" height="30" />
    <rect x="360" y="0" rx="6" ry="6" width="50" height="30" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsTagsLoader)
