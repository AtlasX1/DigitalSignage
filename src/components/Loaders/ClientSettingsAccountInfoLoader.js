import React from 'react'

import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const ClientSettingsAccountInfoLoader = ({ theme }) => (
  <ContentLoader
    style={{
      width: '100%',
      height: 61
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <rect x="0" y="0" rx="50%" ry="50%" width="57" height="57" />
    <rect x="155" y="20" rx="6" ry="6" width="100" height="20" />
    в
    <rect x="340" y="15" rx="10" ry="10" width="70" height="30" />
  </ContentLoader>
)

export default withTheme()(ClientSettingsAccountInfoLoader)
