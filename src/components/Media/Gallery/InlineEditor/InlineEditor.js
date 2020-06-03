import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  withStyles
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { WhiteButton } from '../../../Buttons'
import { FormControlInput } from '../../../Form'
import DialogActions from '@material-ui/core/DialogActions'
import MediaImage from './MediaImage'

const styles = theme => {
  const { palette, type } = theme
  return {
    whiteBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    imageWrapper: {
      height: 70,
      width: 70
    },
    image: {
      height: '100%',
      width: '100%',
      objectFit: 'contain'
    },
    closeButton: {
      background: 'transparent',
      border: 'none',
      outline: 'none',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 1,
      cursor: 'pointer'
    },
    rowContainer: {
      width: '100%',
      position: 'relative',
      marginBottom: 15
    },
    dialog: {
      maxWidth: 1000,
      width: '100%',
      overflow: 'auto'
    },
    dialogContent: {
      maxHeight: 500,
      overflow: 'auto'
    }
  }
}

const InlineEditor = props => {
  const { classes, onSave, open, onClose, onChange, data } = props

  const [mediaImageDialog, setMediaImageDialog] = useState(false)
  const [editedItemIndex, setEditedItemIndex] = useState(undefined)

  const addRow = () => {
    const newData = data
    newData.push({
      Name: '',
      Position: '',
      Description: '',
      ImagePath: ''
    })
    onChange('data', newData)
  }

  const selectImage = itemIndex => {
    setEditedItemIndex(itemIndex)
    setMediaImageDialog(true)
  }

  return (
    <>
      <Dialog
        open={mediaImageDialog}
        onClose={() => setMediaImageDialog(false)}
      >
        <MediaImage
          onSelect={val => {
            const newData = data
            newData[editedItemIndex].ImagePath = {
              url: val.mediaUrl,
              id: val.id
            }
            onChange('data', newData)
            setMediaImageDialog(false)
          }}
        />
      </Dialog>

      <Dialog
        open={open}
        onClose={onClose}
        classes={{
          paper: classes.dialog
        }}
      >
        <DialogTitle>
          <Typography>Add Items</Typography>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            className={classes.dialogContent}
            justify={'space-between'}
          >
            <Grid item xs={12}>
              {data &&
                !!data.length &&
                data.map((item, index) => (
                  <Grid
                    container
                    className={classes.rowContainer}
                    align={'flex-end'}
                    justify={'space-between'}
                    key={`item_${index}`}
                  >
                    <Grid item xs={3}>
                      <FormControlInput
                        label={'Name'}
                        formControlLabelClass={classes.formControlLabelClass}
                        value={data[index].Name}
                        handleChange={e => {
                          const newData = data
                          newData[index].Name = e.target.value
                          onChange('data', newData)
                        }}
                        marginBottom={false}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormControlInput
                        label={'Position'}
                        formControlLabelClass={classes.formControlLabelClass}
                        value={data[index].Position}
                        handleChange={e => {
                          const newData = data
                          newData[index].Position = e.target.value
                          onChange('data', newData)
                        }}
                        marginBottom={false}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <FormControlInput
                        label={'Description'}
                        formControlLabelClass={classes.formControlLabelClass}
                        value={data[index].Description}
                        handleChange={e => {
                          const newData = data
                          newData[index].Description = e.target.value
                          onChange('data', newData)
                        }}
                        marginBottom={false}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        cursor: 'pointer'
                      }}
                    >
                      {item.ImagePath && item.ImagePath.url && (
                        <div className={classes.imageWrapper}>
                          <img
                            className={classes.image}
                            src={item.ImagePath.url}
                            alt="profile"
                          />
                        </div>
                      )}
                      {item.ImagePath && !item.ImagePath.url && (
                        <div className={classes.imageWrapper}>
                          <img
                            className={classes.image}
                            src={item.ImagePath}
                            alt="profile"
                          />
                        </div>
                      )}
                      {!item.ImagePath && (
                        <WhiteButton
                          className={classes.whiteBtn}
                          onClick={() => selectImage(index)}
                        >
                          Select Image
                        </WhiteButton>
                      )}
                    </Grid>
                    <button
                      onClick={() => {
                        const newData = data
                        newData.splice(index, 1)
                        onChange('data', newData)
                      }}
                      className={classes.closeButton}
                    >
                      <i className={'icon-close'} />
                    </button>
                  </Grid>
                ))}
            </Grid>
            <Grid item xs={12}>
              <WhiteButton className={classes.whiteBtn} onClick={addRow}>
                Add row
              </WhiteButton>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <WhiteButton
            className={classes.whiteBtn}
            onClick={() => onSave(data)}
          >
            Save
          </WhiteButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default withStyles(styles)(InlineEditor)
