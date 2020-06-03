import React from 'react'
import classNames from 'classnames'

import TextAlignLeftIcon from '../icons/TextAlignLeftIcon'
import TextAlignCenterIcon from '../icons/TextAlignCenterIcon'
import TextAlignRightIcon from '../icons/TextAlignRightIcon'
import TextAlignJustifyIcon from '../icons/TextAlignJustifyIcon'
import { useCanvasState } from '../canvas/CanvasProvider'

const controls = [
  {
    label: 'Left',
    value: 'left',
    icon: <TextAlignLeftIcon />
  },
  {
    label: 'Center',
    value: 'center',
    icon: <TextAlignCenterIcon />
  },
  {
    label: 'Right',
    value: 'right',
    icon: <TextAlignRightIcon />
  },
  {
    label: 'Justify',
    value: 'justify',
    icon: <TextAlignJustifyIcon />
  }
]

const TextAlign = ({ activeObject, onTextStyleChange }) => {
  const [{ canvasHandlers, canvasUtils }] = useCanvasState()
  const { isTextBoxObjects } = canvasHandlers

  const getActiveClass = value => {
    if (!activeObject) return false

    const { checkTextAlign } = canvasUtils
    if (activeObject.isType('textbox')) {
      return checkTextAlign(activeObject, value)
    }
    if (activeObject.isType('activeSelection')) {
      const { _objects } = activeObject
      const styledObjects = _objects.filter(obj => {
        return obj.isType('textbox') && checkTextAlign(obj, value)
      })
      return _objects.length === styledObjects.length
    }
  }

  return (
    <div className={'sidebar-row sidebar-row__border'}>
      {controls.map((item, key) => (
        <div
          key={key}
          onClick={() => onTextStyleChange('textAlign', item.value)}
          className={classNames('item item-column', {
            item__active: getActiveClass(item.value),
            item__disable: !isTextBoxObjects()
          })}
        >
          <div className={'item-icon'}>{item.icon}</div>
          <div className={'item-label'}>{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export default TextAlign
