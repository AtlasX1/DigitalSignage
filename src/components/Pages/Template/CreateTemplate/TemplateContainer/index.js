import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, Grid } from '@material-ui/core'

import TemplateTypes from './TemplateTypes'
import BottomTemplateActions from './BottomTemplateActions'
import Template from './Template'
import bgGridPattern from 'common/icons/bg-grid-pattern.svg'

const styles = () => ({
  templateTypesRoot: {
    width: '100%',
    height: '46px'
  },
  templateRoot: {
    width: '100%',
    minHeight: 'calc(100% - (46px + 42px))',
    backgroundImage: `url(${bgGridPattern})`
  },
  bottomTemplateActionsRoot: {
    width: '100%',
    height: '42px'
  }
})

const TemplateContainer = props => {
  const {
    classes,
    rootClass,
    container,
    items = {},
    currentItem = {},
    multiplier = 1,
    currentItemId = -1,
    selectedItems = [],
    multipleSelected = false
  } = props

  return (
    <Grid xs item className={rootClass}>
      <TemplateTypes
        position={currentItem.position}
        rootClass={classes.templateTypesRoot}
      />
      <Template
        container={container}
        items={items}
        rootClass={classes.templateRoot}
        multiplier={multiplier}
        currentItemId={currentItemId}
        selectedItems={selectedItems}
      />
      <BottomTemplateActions
        rootClass={classes.bottomTemplateActionsRoot}
        currentItemId={currentItemId}
        container={container}
        currentItem={currentItem}
        multipleSelected={multipleSelected}
      />
    </Grid>
  )
}

TemplateContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  container: PropTypes.object.isRequired,
  items: PropTypes.object,
  currentItem: PropTypes.object,
  multiplier: PropTypes.number,
  currentItemId: PropTypes.number,
  selectedItems: PropTypes.array,
  multipleSelected: PropTypes.bool
}

export default withStyles(styles)(TemplateContainer)
