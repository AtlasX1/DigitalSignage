import React from 'react'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import { useDrag } from 'react-dnd'
import className from 'classnames'

import ImagePreview from './ImagePreview'
import FontPreview from './FontPreview'
import FontCombinationPreview from './FontCombinationPreview'

const useStyles = makeStyles({
  item: {
    width: '100%',
    height: 'auto',
    position: 'relative',
    cursor: 'pointer',
    border: '4px solid transparent',
    borderRadius: 4,
    transition: 'opacity .25s ease',
    '&:hover': {
      borderColor: '#1175BC'
    },
    '&.is-selected': {
      borderColor: '#1175BC',

      '& > span': {
        top: 2,
        right: 2,
        position: 'absolute',
        background: '#1175BC',
        height: 16,
        lineHeight: 1,
        borderRadius: '50%',
        width: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }
    },
    '&.col-1': {
      width: '100%',
      borderWidth: '2px',
      '&.image': {
        padding: '10px',
        height: '169px'
      }
    },
    '&.col-2': {
      width: 'calc(100% / 2 - 7.5px)',
      marginTop: '15px',
      marginRight: '15px',
      height: '80px',
      '&:first-child, &:nth-child(2)': {
        marginTop: 0
      },
      '&:last-child, &:nth-last-child(2)': {
        marginBottom: 0
      },
      '&:nth-child(2n)': {
        marginRight: 0
      }
    },
    '&.col-3': {
      width: 'calc(100% / 3 - 2px)',
      margin: '1px',
      height: '75px',
      '&:first-child, &:nth-child(2), &:nth-child(3)': {
        marginTop: 0
      },
      '&:last-child, &:nth-last-child(2),  &:nth-last-child(3)': {
        marginBottom: 0
      }
    },
    '&.image': {
      background: '#FFF',
      border: '1px solid #E7EBF1',
      borderBottomWidth: '0px',
      borderRadius: '0',
      '& > div': {
        backgroundSize: 'cover',
        '& > img': {
          maxHeight: 'none'
        }
      },
      '&:last-child': {
        borderBottomWidth: '1px'
      }
    },
    '&.font': {
      display: 'flex',
      alignItems: 'center',
      height: '75px',
      padding: '8px 14px',
      marginBottom: '4px',
      '&:last-child': {
        marginBottom: '0'
      }
    },
    '&.template': {
      background: '#FFF',
      border: '1px solid #E7EBF1',
      borderRadius: '0',
      padding: '6px',
      '&:after': {
        content: '" "',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        border: '7px solid #1175BC',
        borderRadius: '4px',
        opacity: 0
      },
      '&:hover': {
        borderColor: 'transparent',
        '&:after': {
          opacity: 1
        }
      },
      '&.col-1': {
        height: '169px',
        padding: '10px',
        borderBottomWidth: '0px',
        '&:last-child': {
          borderBottomWidth: '1px'
        }
      }
    }
  }
})

const PreviewGridsItem = ({ grid, onClick, colWidth }) => {
  const { showAs, selected } = grid
  const classes = useStyles({ colWidth })

  const [{ opacity }, dragRef] = useDrag({
    item: grid,
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    }),
    end(item, monitor) {
      if (item.isConfirmAction) {
        const canDrop = monitor.didDrop()
        const isCanvasDropResult = monitor.getTargetIds().length

        if (!canDrop && isCanvasDropResult) {
          item.isConfirmAction = false
          onClick(grid)
        }
      }
    }
  })

  const getContentByType = () => {
    switch (showAs) {
      case 'svg':
      case 'image':
      case 'bg':
      case 'template':
        return <ImagePreview {...grid} />
      case 'font':
        return <FontPreview {...grid} />
      case 'fontCombination':
        return <FontCombinationPreview {...grid} />
      default:
        return <div>Example div</div>
    }
  }

  return (
    <div
      ref={dragRef}
      style={{ opacity }}
      onClick={() => onClick(grid)}
      className={className(classes.item, `col-${colWidth}`, showAs, {
        'is-selected': selected
      })}
    >
      {selected && (
        <span>
          <i className="icon-check-circle-2" />
        </span>
      )}
      {getContentByType()}
    </div>
  )
}

PreviewGridsItem.propTypes = {
  grid: PropTypes.object,
  onClick: PropTypes.func,
  colWidth: PropTypes.number
}

export default PreviewGridsItem
