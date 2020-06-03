import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { DragDropContext } from 'react-beautiful-dnd'
import { Grid, withStyles } from '@material-ui/core'
import update from 'immutability-helper'
import LeftSidebar from './LeftSidebar'
import CenterContent from './CenterContent'
import RightSidebar from './RightSidebar'

const styles = () => ({
  rightBorderWrap: {
    '@media (max-width: 1600px)': {
      width: '1250px'
    }
  },
  cardHover: {
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      width: 4,
      height: '100%',
      left: 0,
      top: 0,
      transform: 'scale3d(0,0,0)',
      transformOrigin: 'bottom',
      transition: 'transform 150ms ease-in-out, background 200ms ease-out'
    },
    '&:hover:before': {
      background: '#0378ba',
      transform: 'none'
    }
  },
  cardDrag: {
    boxShadow: '2px 4px 16px -4px #30598E20',
    '&:before': {
      background: '#0378ba',
      transform: 'scale3d(2,1,1)',
      transformOrigin: 'left',
      transition: 'transform 150ms ease-in'
    }
  }
})

const defaultColumns = {
  left: {
    id: 'droppable-1',
    cards: []
  },
  center: {
    id: 'droppable-2',
    cards: []
  },
  right: {
    id: 'droppable-3',
    cards: []
  }
}

const Dashboard = ({ classes, cards, positions, onUpdateColumns }) => {
  const [columns, setColumns] = useState(defaultColumns)

  const sortBlocksByColumn = useCallback(
    xAxis =>
      positions
        .filter(({ name, x }) => !!cards[name] && x === xAxis)
        .sort((a, b) => a.y - b.y)
        .map(({ name }) => ({
          id: name,
          Card: cards[name]
        })),
    [cards, positions]
  )

  useEffect(() => {
    if (cards && positions) {
      setColumns({
        left: {
          id: 'droppable-1',
          cards: sortBlocksByColumn(0)
        },
        center: {
          id: 'droppable-2',
          cards: sortBlocksByColumn(1)
        },
        right: {
          id: 'droppable-3',
          cards: sortBlocksByColumn(2)
        }
      })
    }
    // eslint-disable-next-line
  }, [])

  const transformCardsToPositions = useCallback(
    (cards, xAxis) =>
      cards.map(({ id }, index) => ({
        name: id,
        x: xAxis,
        y: index,
        width: 1,
        height: 1
      })),
    []
  )

  const buildNewPositions = useCallback(
    columns => [
      ...transformCardsToPositions(columns.left.cards, 0),
      ...transformCardsToPositions(columns.center.cards, 1),
      ...transformCardsToPositions(columns.right.cards, 2)
    ],
    [transformCardsToPositions]
  )

  const handleDragEnd = useCallback(
    result => {
      const { destination, source } = result

      if (!destination) return

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      )
        return

      const destColumn =
        destination.droppableId === 'droppable-1'
          ? 'left'
          : destination.droppableId === 'droppable-2'
          ? 'center'
          : destination.droppableId === 'droppable-3'
          ? 'right'
          : ''

      const sourceColumn =
        source.droppableId === 'droppable-1'
          ? 'left'
          : source.droppableId === 'droppable-2'
          ? 'center'
          : source.droppableId === 'droppable-3'
          ? 'right'
          : ''

      const item = columns[sourceColumn].cards[source.index]

      const updatedColumnsObj =
        source.droppableId === destination.droppableId
          ? {
              [destColumn]: {
                cards: {
                  $splice: [
                    [source.index, 1],
                    [destination.index, 0, item]
                  ]
                }
              }
            }
          : {
              [sourceColumn]: {
                cards: {
                  $splice: [[source.index, 1]]
                }
              },
              [destColumn]: {
                cards: {
                  $splice: [[destination.index, 0, item]]
                }
              }
            }

      const updatedColumns = update(columns, updatedColumnsObj)
      const updatedPositions = buildNewPositions(updatedColumns)
      onUpdateColumns(updatedPositions)
      setColumns(update(columns, updatedColumnsObj))
    },
    [columns, buildNewPositions, onUpdateColumns]
  )

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Grid container justify="center">
        <Grid item>
          <LeftSidebar
            id={columns.left.id}
            cards={columns.left.cards}
            draggingClassName={classes.cardDrag}
            hoverClassName={classes.cardHover}
          />
        </Grid>
        <Grid item>
          <CenterContent
            id={columns.center.id}
            cards={columns.center.cards}
            draggingClassName={classes.cardDrag}
            hoverClassName={classes.cardHover}
          />
        </Grid>
        <Grid item className={classes.rightBorderWrap}>
          <RightSidebar
            id={columns.right.id}
            cards={columns.right.cards}
            draggingClassName={classes.cardDrag}
            hoverClassName={classes.cardHover}
          />
        </Grid>
      </Grid>
    </DragDropContext>
  )
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  cards: PropTypes.shape({}).isRequired,
  positions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onUpdateColumns: PropTypes.func.isRequired
}

export default withStyles(styles)(Dashboard)
