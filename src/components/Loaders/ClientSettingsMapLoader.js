import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsMapLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 280
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="100%" height="280" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsMapLoader)
