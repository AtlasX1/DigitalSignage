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

const BulletsSpacing = ({ activeObject, onListChange }) => {
  const [{ canvasHandlers }] = useCanvasState()
  const { isTextBoxObjects } = canvasHandlers

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
      <div className={'numeric-wrapper ml-auto'}>
        <FormControlInput
          custom
          type="number"
          value={28}
          formControlContainerClass={'numeric-input'}
          formControlInputClass={'form-control'}
          name={'key'}
          handleChange={() => {}}
        />
        <span className={'helper-text'}>Line Spacing</span>
      </div>
    </div>
  )
}

export default BulletsSpacing
