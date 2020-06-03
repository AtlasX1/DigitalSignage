import React, { useMemo } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { withStyles, Typography } from '@material-ui/core'
import classNames from 'classnames'

import LocationItem from 'components/Media/Local/Interest/LocationItem'
import PortalAwareItem from 'components/Media/Local/Interest/PortalAwareItem'
import { translate } from 'react-i18next'
import DirectionItem from 'components/Media/Local/Interest/DirectionItem'

const portal = document.createElement('div')
document.body.appendChild(portal)

const styles = () => ({
  root: {
    display: 'flex',
    marginTop: '20px'
  },
  column: {
    flexGrow: '1',
    width: '100%'
  },
  space: {
    marginLeft: 30
  }
})

const SelectDirections = ({
  locations,
  onReorder = f => f,
  directions,
  onDeleteLocations,
  onDeleteDirections,
  onAddToDirections,
  onEdit,
  classes,
  t
}) => {
  const transformDirections = useMemo(
    () => (directions === '' ? [] : directions.split(':')),
    [directions]
  )

  return (
    <DragDropContext onDragEnd={onReorder}>
      <div className={classes.root}>
        <div className={classNames(classes.column)}>
          {locations.length ? <Typography>{t('LOCATIONS')}</Typography> : null}
          {locations.map(({ location }, index) => (
            <LocationItem
              key={`location-item-${location}-${index}`}
              index={index}
              hasAlreadyDirection={transformDirections.some(
                direction => direction === location
              )}
              countDirections={transformDirections.length}
              label={location}
              onDelete={onDeleteLocations}
              onAddToDirections={onAddToDirections}
              onEdit={onEdit}
            />
          ))}
        </div>
        {transformDirections.length ? (
          <div className={classNames(classes.column, classes.space)}>
            <Typography>{t('DIRECTION SETTINGS')}</Typography>
            <Droppable droppableId="droppable2">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {transformDirections.map((location, index) => (
                    <Draggable
                      key={location + index}
                      draggableId={location + index}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <PortalAwareItem
                          provided={provided}
                          snapshot={snapshot}
                          portal={portal}
                        >
                          <DirectionItem
                            key={`location-item-${location}-${index}`}
                            index={index}
                            label={location}
                            onDelete={onDeleteDirections}
                            isLast={transformDirections.length - 1 === index}
                          />
                        </PortalAwareItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ) : null}
      </div>
    </DragDropContext>
  )
}

export default translate('translations')(withStyles(styles)(SelectDirections))
