import React, { useState } from 'react'
import { Tooltip } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import { get as _get } from 'lodash'

import AlignLeftIcon from '../icons/AlignLeftIcon'
import AlignRightIcon from '../icons/AlignRightIcon'
import AlignBottomIcon from '../icons/AlignBottomIcon'
import AlignTopIcon from '../icons/AlignTopIcon'
import AlignHCenterIcon from '../icons/AlignHCenterIcon'
import AlignVCenterIcon from '../icons/AlignVCenterIcon'
import RotateLeftIcon from '../icons/RotateLeftIcon'
import RotateRightIcon from '../icons/RotateRightIcon'
import AlignHEvenCenterIcon from '../icons/AlignHEvenCenterIcon'
import AlignVEvenCenterIcon from '../icons/AlignVEvenCenterIcon'
import { FormControlInput } from '../../../../Form'

const useStyles = makeStyles({
  item: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#8D96A6',
    padding: '9.5px',
    cursor: 'pointer',
    '&:hover': {
      color: '#0084CE'
    },
    '&.is-disabled': {
      // color: 'rgba(141, 150, 166, 0.5)',
      opacity: '.5',
      pointerEvents: 'none'
    },
    '&:first-child': {
      paddingLeft: 0
    },
    '&:last-child': {
      paddingRight: 0
    }
  }
})

const alignRowControls = [
  {
    value: 'alignLeft',
    title: 'Left align group items',
    icon: <AlignLeftIcon />
  },
  {
    value: 'alignBottom',
    title: 'Bottom align group items',
    icon: <AlignBottomIcon />
  },
  {
    value: 'alignTop',
    title: 'Top align group items',
    icon: <AlignTopIcon />
  },
  {
    value: 'alignRight',
    title: 'Right align group items',
    icon: <AlignRightIcon />
  },
  {
    value: 'alignHCenter',
    title: 'Horizontal center align',
    icon: <AlignHEvenCenterIcon />
  },
  {
    value: 'alignVCenter',
    title: 'Vertical center align',
    icon: <AlignVEvenCenterIcon />
  }
]

const RotateControls = [
  {
    value: 'rotateLeft',
    title: 'Rotate left',
    icon: <RotateLeftIcon />
  },
  {
    value: 'rotateRight',
    title: 'Rotate right',
    icon: <RotateRightIcon />
  }
]

const EvenAlignControls = [
  {
    value: 'alignHEventCenter',
    title: 'Horizontal even spacing',
    icon: <AlignHCenterIcon />
  },
  {
    value: 'alignVEventCenter',
    title: 'Vertical even spacing',
    icon: <AlignVCenterIcon />
  }
]

const TemplateControls = ({ controls, onClick, activeObject, disable }) => {
  const classes = useStyles({ activeObject: activeObject })
  return controls.map((c, key) => (
    <Tooltip
      key={key}
      title={c.title}
      className={classNames(classes.item, {
        'is-disabled': disable
      })}
      onClick={() => onClick(c.value)}
    >
      <span>{c.icon}</span>
    </Tooltip>
  ))
}

const AlignmentsRotations = ({
  activeObject,
  onAlignmentChange,
  onRotateChange
}) => {
  const [universalValue, setUniversalValue] = useState(5)

  const handleRotateClick = direction => {
    onRotateChange(direction, universalValue)
  }

  const isManyActiveObjects =
    activeObject && _get(activeObject, '_objects', []).length < 2

  return (
    <>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': !activeObject
        })}
      >
        <TemplateControls
          activeObject={activeObject}
          controls={alignRowControls}
          onClick={onAlignmentChange}
        />
      </div>
      <div
        className={classNames('sidebar-row sidebar-row__border', {
          'is-disabled': !activeObject
        })}
      >
        <TemplateControls
          activeObject={activeObject}
          controls={RotateControls}
          onClick={handleRotateClick}
        />
        <TemplateControls
          disable={isManyActiveObjects}
          activeObject={activeObject}
          controls={EvenAlignControls}
          onClick={val => onAlignmentChange(val, universalValue)}
        />

        <FormControlInput
          custom
          type="number"
          value={universalValue}
          formControlContainerClass={'numeric-input sm-size'}
          formControlInputClass={'form-control'}
          name={'key'}
          handleChange={val => setUniversalValue(val)}
        />
      </div>
    </>
  )
}
export default AlignmentsRotations
