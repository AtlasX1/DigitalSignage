import React from 'react'
import PropTypes from 'prop-types'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { withStyles, Grid, RootRef } from '@material-ui/core'

const styles = {
  leftSideBar: {
    width: 330,
    marginRight: 20
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

const LeftSidebar = ({
  id,
  cards,
  classes,
  hoverClassName,
  draggingClassName
}) => (
  <Droppable type="small" droppableId={id}>
    {provided => (
      <RootRef rootRef={provided.innerRef}>
        <Grid
          container
          direction="column"
          className={classes.leftSideBar}
          {...provided.droppableProps}
        >
          {cards.map(({ id, Card }, index) => (
            <Draggable key={`left-${id}`} draggableId={id} index={index}>
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

LeftSidebar.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  cards: PropTypes.array,
  id: PropTypes.string
}

export default withStyles(styles)(LeftSidebar)
