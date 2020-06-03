import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

import { withStyles, Grid, RootRef } from '@material-ui/core'

const styles = {
  centerContent: {
    width: 900,
    marginRight: 20,

    '@media (max-width: 1600px)': {
      marginRight: 0
    }
  },
  container: {
    position: 'relative',

    '&:hover': {
      '& > svg': {
        opacity: 1
      }
    }
  }
}

const CenterContent = ({
  id,
  cards,
  classes,
  hoverClassName,
  draggingClassName
}) => (
  <Droppable type="big" droppableId={id}>
    {provided => (
      <RootRef rootRef={provided.innerRef}>
        <Grid
          container
          direction="column"
          className={classes.centerContent}
          {...provided.droppableProps}
        >
          {cards.map(({ id, Card }, index) => (
            <Draggable key={`center-${id}`} draggableId={id} index={index}>
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <Grid
                    container
                    className={classes.container}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    <Card
                      key={id}
                      dragging={snapshot.isDragging}
                      hoverClassName={hoverClassName}
                      draggingClassName={draggingClassName}
                    />
                  </Grid>
                </RootRef>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Grid>
      </RootRef>
    )}
  </Droppable>
)

CenterContent.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  cards: PropTypes.array,
  id: PropTypes.string
}

export default withStyles(styles)(CenterContent)
