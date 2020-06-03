import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsBandwidthLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 107
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="6" ry="6" width="153" height="36" />
    <rect x="314" y="15" rx="6" ry="6" width="231" height="21" />

    <rect x="0" y="50" rx="6" ry="6" width="100%" height="10" />

    <rect x="0" y="80" rx="6" ry="6" width="320" height="20" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsBandwidthLoader)
