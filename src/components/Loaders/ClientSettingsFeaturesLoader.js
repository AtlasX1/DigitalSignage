import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsFeaturesLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 500
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="15" rx="6" ry="6" width="100" height="15" />
    <rect x="185" y="15" rx="6" ry="6" width="30" height="15" />
    <rect x="240" y="15" rx="6" ry="6" width="100" height="15" />
    <rect x="419" y="15" rx="6" ry="6" width="30" height="15" />

    <rect x="0" y="55" rx="6" ry="6" width="100" height="15" />
    <rect x="185" y="55" rx="6" ry="6" width="30" height="15" />
    <rect x="240" y="55" rx="6" ry="6" width="100" height="15" />
    <rect x="419" y="55" rx="6" ry="6" width="30" height="15" />

    <rect x="0" y="95" rx="6" ry="6" width="100" height="15" />
    <rect x="185" y="95" rx="6" ry="6" width="30" height="15" />
    <rect x="240" y="95" rx="6" ry="6" width="100" height="15" />
    <rect x="419" y="95" rx="6" ry="6" width="30" height="15" />

    <rect x="0" y="135" rx="6" ry="6" width="100" height="15" />
    <rect x="185" y="135" rx="6" ry="6" width="30" height="15" />
    <rect x="240" y="135" rx="6" ry="6" width="100" height="15" />
    <rect x="419" y="135" rx="6" ry="6" width="30" height="15" />

    <rect x="0" y="175" rx="6" ry="6" width="100" height="15" />
    <rect x="185" y="175" rx="6" ry="6" width="30" height="15" />
    <rect x="240" y="175" rx="6" ry="6" width="100" height="15" />
    <rect x="419" y="175" rx="6" ry="6" width="30" height="15" />

    <rect x="0" y="215" rx="6" ry="6" width="100" height="15" />
    <rect x="185" y="215" rx="6" ry="6" width="30" height="15" />
    <rect x="240" y="215" rx="6" ry="6" width="100" height="15" />
    <rect x="419" y="215" rx="6" ry="6" width="30" height="15" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsFeaturesLoader)
