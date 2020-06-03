import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'

import { withTheme } from '@material-ui/core'

const PlaceholderRow = memo(({ leftColY, rowY, dividerY, lineHeight }) => (
  <>
    <rect x="20" y={leftColY} rx="5" ry="5" width="24" height={lineHeight} />
    <rect x="150" y={rowY} rx="5" ry="5" width="100" height={lineHeight} />
    <rect x="400" y={rowY} rx="5" ry="5" width="200" height={lineHeight} />
    <rect x="700" y={rowY} rx="5" ry="5" width="250" height={lineHeight} />
    <rect x="1000" y={rowY} rx="5" ry="5" width="200" height={lineHeight} />
    <rect x="1225" y={rowY} rx="5" ry="5" width="50" height={lineHeight} />
    <rect x="1300" y={rowY} rx="5" ry="5" width="55" height={lineHeight} />
    <rect x="1400" y={rowY} rx="5" ry="5" width="170" height={lineHeight} />

    <rect x="20" y={dividerY} rx="5" ry="5" width="1550" height="5" />
  </>
))

const PlaceholderHeader = memo(({ dividerY, lineHeight }) => (
  <PlaceholderRow
    leftColY={20}
    rowY={20}
    dividerY={dividerY}
    lineHeight={lineHeight}
  />
))

const LibraryLoader = ({
  theme,
  rowCount,
  rowSpacing,
  lineHeight,
  headerHeight
}) => (
  <ContentLoader
    style={{
      width: '100%',
      height: (rowCount + 2) * rowSpacing + headerHeight
    }}
    backgroundColor={theme.palette[theme.type].loader.background}
    foregroundColor={theme.palette[theme.type].loader.foreground}
  >
    <PlaceholderHeader dividerY={headerHeight} lineHeight={lineHeight} />

    {new Array(rowCount).fill(0).map((a, i) => (
      <PlaceholderRow
        key={i}
        leftColY={i * rowSpacing + headerHeight + (rowSpacing - lineHeight) / 2}
        rowY={i * rowSpacing + headerHeight + (rowSpacing - lineHeight) / 2}
        dividerY={(i + 1) * rowSpacing + headerHeight}
        lineHeight={lineHeight}
      />
    ))}
  </ContentLoader>
)

LibraryLoader.defaultProps = {
  rowCount: 10,
  rowSpacing: 103,
  lineHeight: 24,
  headerHeight: 60
}
LibraryLoader.propTypes = {
  rowCount: PropTypes.number,
  rowSpacing: PropTypes.number,
  lineHeight: PropTypes.number,
  headerHeight: PropTypes.number
}

export default withTheme()(LibraryLoader)
