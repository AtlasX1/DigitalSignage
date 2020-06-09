import React from 'react'
import classNames from 'classnames'

import { FormControlInput } from '../../../../Form'
import ListNumberIcon from '../icons/ListNumberIcon'
import ListBulletsIcon from '../icons/ListBulletsIcon'
import { useCanvasState } from '../canvas/CanvasProvider'

const controls = [
  {
    label: 'Bullet',
    value: 'bullet',
    icon: <ListBulletsIcon />
  },
  {
    label: 'Number',
    value: 'number',
    icon: <ListNumberIcon />
  }
]

const BulletsSpacing = ({ activeObject, onListChange, onTextStyleChange }) => {
  const [{ canvasHandlers }] = useCanvasState()
  const { isTextBoxObjects } = canvasHandlers

  const { getObjectsStyleValue } = canvasHandlers

  return (
    <div
      className={classNames('sidebar-row sidebar-row__border', {
        'is-disabled': !isTextBoxObjects()
      })}
    >
      {controls.map((item, key) => (
        <div
          key={key}
          onClick={() => onListChange(item.value)}
          className={classNames('item item-column', {
            item__active: false
          })}
        >
          <div className={'item-icon'}>{item.icon}</div>
          <div className={'item-label'}>{item.label}</div>
        </div>
      ))}
      <div className="item item-column item__fill item-input-wrap">
        <FormControlInput
          custom
          type="number"
          value={getObjectsStyleValue('lineHeight') || 1}
          min={1}
          formControlContainerClass={'numeric-input'}
          formControlInputClass={'form-control'}
          name={'key'}
          handleChange={value => onTextStyleChange('lineHeight', value)}
        />
        <div className="item-input-label">
          <span>Line Spacing</span>
        </div>
      </div>
    </div>
  )
}

export default BulletsSpacing
