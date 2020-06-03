import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'

import { withStyles, Grid, RootRef } from '@material-ui/core'

const styles = {
  rightSideBar: {
    width: '330px',
    '@media (max-width: 1600px)': {
      flexDirection: 'row',
      width: '100%',
      flexWrap: 'wrap'
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

const RightSidebar = ({
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
          className={classes.rightSideBar}
          {...provided.droppableProps}
        >
          {cards.map(({ id, Card }, index) => (
            <Draggable key={`right-${id}`} draggableId={id} index={index}>
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

RightSidebar.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  cards: PropTypes.array,
  id: PropTypes.string
}

export default withStyles(styles)(RightSidebar)
