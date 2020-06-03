import React from 'react'
import PropTypes from 'prop-types'
import { uniqueId as _uniqueId } from 'lodash'
import { makeStyles } from '@material-ui/styles'

import TypesTextItem from './TypesTextItem'

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(147, 148, 161, 0.08)'
  },
  title: {
    display: 'inline-flex',
    maxWidth: '100%',
    padding: '0 14px',
    marginBottom: '23px',
    fontWeight: 500,
    lineHeight: 1,
    cursor: 'pointer',
    '&:last-child': {
      marginBottom: 0
    }
  }
})

const TypesText = ({ onItemClick }) => {
  const classes = useStyles()

  const types = [
    {
      id: _uniqueId(),
      type: 'h1',
      fontSize: 29,
      text: 'Add Headline'
    },
    {
      id: _uniqueId(),
      type: 'h2',
      fontSize: 20,
      text: 'Add Subheadline'
    },
    {
      id: _uniqueId(),
      type: 'p',
      fontSize: 14,
      text: 'Add paragraph text '
    }
  ]

  return (
    <div className={classes.wrapper}>
      {types.map((item, key) => (
        <TypesTextItem
          onClick={() => onItemClick(item)}
          item={item}
          key={key}
          classes={classes}
        />
      ))}
    </div>
  )
}

TypesText.propTypes = {
  onItemClick: PropTypes.func
}

export default TypesText
