import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const DeviceGridLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 1200
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="20" y="20" rx="6" ry="6" width="375" height="514" />
    <rect x="415" y="20" rx="6" ry="6" width="375" height="514" />
    <rect x="810" y="20" rx="6" ry="6" width="375" height="514" />
    <rect x="1205" y="20" rx="6" ry="6" width="375" height="514" />

    <rect x="20" y="554" rx="6" ry="6" width="375" height="514" />
    <rect x="415" y="554" rx="6" ry="6" width="375" height="514" />
    <rect x="810" y="554" rx="6" ry="6" width="375" height="514" />
    <rect x="1205" y="554" rx="6" ry="6" width="375" height="514" />
  </ContentLoader>
)

export default withTheme()(DeviceGridLoader)
