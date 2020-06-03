import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useDispatch, useSelector } from 'react-redux'

import { Typography, withStyles } from '@material-ui/core'

import Item from './Item'
import { getConfigMediaCategory } from 'actions/configActions'

const styles = theme => {
  const { palette, type } = theme
  return {
    templateTypesContainer: {
      borderBottom: `1px solid ${palette[type].pages.createTemplate.border}`,
      background: palette[type].pages.createTemplate.types.background,
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: '13px'
    },
    templateTypes: {
      display: 'flex',
      height: '100%',
      alignItems: 'center',
      paddingLeft: '35px'
    },
    coordinatesContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    coordinate: {
      fontSize: '11px',
      color: '#8897ac',
      letterSpacing: '-0.02px',

      '&:first-child': {
        marginRight: '5px'
      }
    }
  }
}

const TemplateTypes = ({ classes, rootClass = '', position = {} }) => {
  const dispatchAction = useDispatch()

  const { configMediaCategory } = useSelector(({ config }) => config)

  useEffect(
    () => {
      if (!configMediaCategory.response.length) {
        dispatchAction(getConfigMediaCategory())
      }
    },
    //eslint-disable-next-line
    []
  )
  const menuItems = useMemo(
    () =>
      !!configMediaCategory.response.length &&
      configMediaCategory.response
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item, index) => <Item key={index} {...item} />),
    [configMediaCategory.response]
  )

  return (
    <div className={[classes.templateTypesContainer, rootClass].join(' ')}>
      <div className={classes.templateTypes}>{menuItems}</div>
      <div className={classes.coordinatesContainer}>
        <Typography className={classes.coordinate}>{`X: ${
          position.x || 0
        }`}</Typography>
        <Typography className={classes.coordinate}>{`Y: ${
          position.y || 0
        }`}</Typography>
      </div>
    </div>
  )
}

TemplateTypes.propTypes = {
  position: PropTypes.object
}

export default withStyles(styles)(TemplateTypes)
