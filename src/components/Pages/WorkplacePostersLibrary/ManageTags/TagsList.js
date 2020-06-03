import React, { useCallback, useEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ListItem from './ListItem'
import arrayMove from 'array-move'

const styles = ({ palette, type }) => ({
  categoriesHeader: {
    padding: '0 15px',
    opacity: 0.64,
    border: `solid 1px ${palette[type].pages.rss.addRss.manage.border}`,
    backgroundColor: palette[type].pages.rss.addRss.manage.background
  },
  categoriesHeaderText: {
    fontSize: '15px',
    lineHeight: '50px',
    margin: '0 10',
    color: palette[type].pages.rss.addRss.manage.titleColor
  }
})

const TagsList = ({ t, items, classes, onDelete }) => {
  const [categories, setCategories] = useState(items)

  useEffect(() => {
    setCategories(items)
  }, [items])

  const handleReorder = useCallback(({ source, destination }) => {
    if (source && destination) {
      const { index: sInd } = source
      const { index: dInd } = destination
      setCategories(values => arrayMove(values, sInd, dInd))
    }
  }, [])

  const translate = useMemo(() => {
    return {
      action: t('Action'),
      tagName: t('Tag Name')
    }
  }, [t])

  return (
    <section>
      <header className={classes.categoriesHeader}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography className={classes.categoriesHeaderText}>
              {translate.tagName}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.categoriesHeaderText}>
              {translate.action}
            </Typography>
          </Grid>
        </Grid>
      </header>
      <DragDropContext onDragEnd={handleReorder}>
        <Grid container direction="column">
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {categories.map((item, index) => (
                  <Draggable
                    key={`tag-${item.id}`}
                    draggableId={`tag-${item.id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {
                          <div className={classes.draggable}>
                            <ListItem item={item} onDelete={onDelete} />
                          </div>
                        }
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Grid>
      </DragDropContext>
    </section>
  )
}

TagsList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired
}
TagsList.defaultProps = {
  items: []
}
export default translate('translations')(withStyles(styles)(TagsList))
