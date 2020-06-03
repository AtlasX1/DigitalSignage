import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import classNames from 'classnames'

import { withStyles, Grid } from '@material-ui/core'

import Search from './Search'
import TemplatePreferences from './TemplatePreferences'
import SizePositioning from './SizePositioning'
import AlignmentsRotations from './AlignmentsRotations'
import Background from './Background'
import TemplateStyle from './TemplateStyle'

const styles = theme => {
  const { palette, type } = theme
  return {
    settingsContainer: {
      borderLeft: `1px solid ${palette[type].pages.createTemplate.border}`,
      overflowY: 'auto',
      overflowX: 'hidden'
    }
  }
}

const expandedTabTypes = {
  PREFERENCES: 'preferences',
  SIZE_POSITIONING: 'size_positioning',
  ALIGNMENT: 'alignment',
  BACKGROUND: 'background',
  STYLE: 'style'
}

const SettingsSide = ({
  classes,
  rootClass = '',
  currentItem = {},
  container = {},
  itemsCount = 0,
  multipleSelected
}) => {
  const [expandedTab, setExpandedTab] = useState()
  const changeExpandedTab = useCallback(
    tab => () => {
      setExpandedTab(tab === expandedTab ? '' : tab)
    },
    [expandedTab, setExpandedTab]
  )

  return (
    <Grid item className={classNames(classes.settingsContainer, rootClass)}>
      <Search />
      <TemplatePreferences
        container={container}
        itemsCount={itemsCount}
        isExpanded={expandedTab === expandedTabTypes.PREFERENCES}
        onExpanded={changeExpandedTab(expandedTabTypes.PREFERENCES)}
      />
      <SizePositioning
        size={currentItem.size}
        position={currentItem.position}
        locked={currentItem.locked || multipleSelected}
        isExpanded={expandedTab === expandedTabTypes.SIZE_POSITIONING}
        onExpanded={changeExpandedTab(expandedTabTypes.SIZE_POSITIONING)}
      />
      <AlignmentsRotations
        styles={currentItem.styles}
        locked={currentItem.locked || multipleSelected}
        isExpanded={expandedTab === expandedTabTypes.ALIGNMENT}
        onExpanded={changeExpandedTab(expandedTabTypes.ALIGNMENT)}
      />
      <Background
        styles={currentItem.styles}
        container={container}
        locked={currentItem.locked || multipleSelected}
        isExpanded={expandedTab === expandedTabTypes.BACKGROUND}
        onExpanded={changeExpandedTab(expandedTabTypes.BACKGROUND)}
      />
      <TemplateStyle
        styles={currentItem.styles}
        locked={currentItem.locked || multipleSelected}
        isExpanded={expandedTab === expandedTabTypes.STYLE}
        onExpanded={changeExpandedTab(expandedTabTypes.STYLE)}
      />
    </Grid>
  )
}

SettingsSide.propTypes = {
  classes: PropTypes.object.isRequired,
  currentItem: PropTypes.object,
  container: PropTypes.object,
  itemsCount: PropTypes.number,
  multipleSelected: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(SettingsSide))
