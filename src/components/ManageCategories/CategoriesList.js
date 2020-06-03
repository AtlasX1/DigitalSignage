import React, { useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ListItem from './ListItem'
import arrayMove from 'array-move'
import { useDispatch } from 'react-redux'
import { putCategory } from 'actions/categoriesActions'

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
    color: palette[type].pages.rss.addRss.manage.titleColor
  },
  wrapper: { height: 'inherit', overflowX: 'hidden', overflowY: 'auto' }
})

const CategoriesList = ({ t, items, classes }) => {
  const translate = useMemo(
    () => ({
      category: t('Category'),
      icon: t('Icon')
    }),
    [t]
  )

  const [categories, setCategories] = useState(items)

  useEffect(() => {
    if (items.length) {
      setCategories(items.sort((a, b) => (a.sortOrder > b.sortOrder ? 1 : -1)))
    }
  }, [items])

  const dispatch = useDispatch()

  const handleReorder = useCallback(
    ({ source, destination }) => {
      if (source && destination) {
        const { index: sInd } = source
        const { index: dInd } = destination

        setCategories(values => {
          dispatch(putCategory(values[sInd].id, { sortOrder: dInd + 1 }))
          return arrayMove(values, sInd, dInd)
        })
      }
    },
    [dispatch]
  )

  return (
    <section className={classes.wrapper}>
      <header className={classes.categoriesHeader}>
        <Grid container>
          <Grid item xs={6}>
            <Typography className={classes.categoriesHeaderText}>
              {translate.category}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.categoriesHeaderText}>
              {translate.icon}
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
                    key={`category-${item.id}`}
                    draggableId={`category-${item.id}`}
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
                            <ListItem
                              item={item}
                              isLast={index === categories.length - 1}
                            />
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

CategoriesList.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired
}
CategoriesList.defaultProps = {
  items: []
}
export default translate('translations')(withStyles(styles)(CategoriesList))
