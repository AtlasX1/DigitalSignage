import React, { useState } from 'react'
import { withStyles } from '@material-ui/core'
import ConfirmModal from '../../modals/ConfirmModal'
import { useCanvasState } from '../../canvas/CanvasProvider'
import { FormControlInput } from 'components/Form'

const styles = theme => ({
  resolutionList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '5px 0 0',
    width: '100%'
  },
  optionWrapper: {
    display: 'flex',
    height: 26,
    cursor: 'pointer',
    borderBottom: '1px solid rgba(151,151,151,0.2)',
    transition: 'all .3s',
    padding: '0 21px 0 10px',

    '& span': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '25%',

      '&:last-child': {
        justifyContent: 'flex-end'
      }
    },

    '&:first-child': {
      cursor: 'default',

      '&:hover': {
        background: 'white'
      }
    },
    '&:last-child': {
      border: '0'
    },

    '&:hover': {
      background: 'rgba(151,151,151,0.2)'
    }
  },
  icon: {
    border: '1px solid #B0B8C2',
    background: '#DBDBDB'
  }
})

const resolutions = [
  {
    iconSettings: {
      width: 18,
      height: 18
    },
    height: 360,
    width: 360,
    ratio: '1:1'
  },
  {
    iconSettings: {
      width: 11,
      height: 18
    },
    height: 540,
    width: 360,
    ratio: '2:3'
  },
  {
    iconSettings: {
      width: 18,
      height: 5
    },
    height: 180,
    width: 720,
    ratio: '4:1'
  },
  {
    iconSettings: {
      width: 18,
      height: 9
    },
    height: 360,
    width: 720,
    ratio: '2:1'
  },
  {
    iconSettings: {
      width: 18,
      height: 14
    },
    height: 540,
    width: 720,
    ratio: '4:3'
  },
  {
    iconSettings: {
      width: 8,
      height: 18
    },
    height: 1080,
    width: 480,
    ratio: '4:9'
  },
  {
    iconSettings: {
      width: 3,
      height: 18
    },
    height: 1920,
    width: 540,
    ratio: '5:32'
  },
  {
    iconSettings: {
      width: 18,
      height: 8
    },
    height: 180,
    width: 1080,
    ratio: '6:1'
  },
  {
    iconSettings: {
      width: 18,
      height: 13
    },
    height: 720,
    width: 1080,
    ratio: '3:2'
  },
  {
    iconSettings: {
      width: 18,
      height: 18
    },
    height: 1080,
    width: 1080,
    ratio: '1:1'
  },
  {
    iconSettings: {
      width: 15,
      height: 18
    },
    height: 1920,
    width: 1080,
    ratio: '9:16'
  },
  {
    iconSettings: {
      width: 18,
      height: 5
    },
    height: 360,
    width: 1440,
    ratio: '4:1'
  },
  {
    iconSettings: {
      width: 18,
      height: 9
    },
    height: 720,
    width: 1440,
    ratio: '2:1'
  },
  {
    iconSettings: {
      width: 18,
      height: 13
    },
    height: 1080,
    width: 1440,
    ratio: '4:3'
  },
  {
    iconSettings: {
      width: 18,
      height: 3
    },
    height: 180,
    width: 1920,
    ratio: '32:3'
  },
  {
    iconSettings: {
      width: 18,
      height: 5
    },
    height: 360,
    width: 1920,
    ratio: '16:3'
  },
  {
    iconSettings: {
      width: 18,
      height: 6
    },
    height: 720,
    width: 1920,
    ratio: '8:3'
  },
  {
    iconSettings: {
      width: 18,
      height: 10
    },
    height: 1080,
    width: 1920,
    ratio: '16:9'
  }
]

const CanvasResolutions = ({ classes, onChangeResolution }) => {
  const [settings, setSettings] = useState({ width: 1920, height: 1020 })
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [{ canvasHandlers }] = useCanvasState()

  const handleOptionChange = val => {
    if (!canvasHandlers.isEmptyFrame()) {
      setSettings(val)
      setConfirmDialogOpen(true)
    } else {
      setSettings(val)
      onChangeResolution(val)
    }
  }

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false)
    onChangeResolution(settings)
  }

  return (
    <>
      <div className={classes.resolutionList}>
        <div className={classes.optionWrapper}>
          <span>Preview</span>
          <span>Width</span>
          <span>Height</span>
          <span>Ratio</span>
        </div>
        {resolutions.map(option => (
          <div
            className={classes.optionWrapper}
            onClick={() =>
              handleOptionChange({ width: option.width, height: option.height })
            }
          >
            <span>
              <div style={option.iconSettings} className={classes.icon} />
            </span>
            <span>{option.width}</span>
            <span>{option.height}</span>
            <span>{option.ratio}</span>
          </div>
        ))}

        <div className={'sidebar-row sidebar-row__border shadow-options'}>
          <div className="item item-inline item__fill item-input-wrap">
            <div className="item-input-label">
              <span>Width</span>
            </div>
            <FormControlInput
              custom
              type="number"
              value={settings.width}
              formControlContainerClass={'numeric-input'}
              formControlInputClass={'form-control'}
              name={'key'}
              handleChange={val =>
                handleOptionChange({ ...settings, width: val })
              }
            />
          </div>
          <div className="item item-inline item__fill item-input-wrap">
            <div className="item-input-label">
              <span>Height</span>
            </div>
            <FormControlInput
              custom
              type="number"
              value={settings.height}
              formControlContainerClass={'numeric-input'}
              formControlInputClass={'form-control'}
              name={'key'}
              handleChange={val =>
                handleOptionChange({ ...settings, height: val })
              }
            />
          </div>
        </div>
      </div>

      <ConfirmModal
        isShow={isConfirmDialogOpen}
        title={'Apply a template to your design'}
        contentText={
          'By applying a template you will lose your existing design. To restore, click Undo button.'
        }
        onApply={handleCloseDialog}
        onCancel={() => setConfirmDialogOpen(false)}
        onClose={() => setConfirmDialogOpen(false)}
      />
    </>
  )
}
export default withStyles(styles)(CanvasResolutions)
