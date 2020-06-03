import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMediaItemsAction } from '../../../../actions/mediaActions'
import {
  CircularProgress,
  DialogContent,
  DialogTitle,
  withStyles
} from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import { get as _get } from 'lodash'
import Typography from '@material-ui/core/Typography'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import ReactPaginate from 'react-paginate'

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
    imageSelector: {
      padding: 5,
      maxHeight: 500,
      overflow: 'auto'
    },
    imageWrapper: {
      padding: '0 4px',
      margin: '0 -4px 10px',
      border: `1px solid ${palette[type].pages.media.gallery.poster.border}`,
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      width: 200,
      height: 200
    },
    imageTitle: {
      textAlign: 'center'
    },
    image: {
      flexGrow: 1,
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
    dialogContent: {
      position: 'relative'
    }
  }
}

const MediaImage = props => {
  const { classes, onSelect } = props

  const dispatchAction = useDispatch()

  const mediaReducer = useSelector(store => [store.media.library.response])

  const [page, setPage] = useState(1)
  const [isLoading, setLoading] = useState(true)

  useEffect(
    () => {
      setLoading(true)
      dispatchAction(
        getMediaItemsAction({
          page: page,
          limit: 6,
          featureId: 2
        })
      )
    },
    // eslint-disable-next-line
    [page]
  )

  useEffect(() => {
    if (_get(mediaReducer, ['0', 'data'])) {
      setLoading(false)
    }
  }, [mediaReducer])

  useEffect(
    () => () => {
      dispatchAction(
        getMediaItemsAction({
          page: 1,
          limit: 10
        })
      )
    },
    // eslint-disable-next-line
    []
  )

  return (
    <>
      <DialogTitle>Select Media Image</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {isLoading && (
          <div className={classes.loaderWrapper}>
            <CircularProgress size={30} thickness={5} />
          </div>
        )}
        {_get(mediaReducer[0], 'data') && mediaReducer[0].data.length && (
          <>
            <Grid
              container
              justify={'space-between'}
              className={classes.imageSelector}
            >
              {mediaReducer[0].data.map(item => (
                <Grid
                  item
                  xs={4}
                  className={classes.imageWrapper}
                  onClick={() => onSelect(item)}
                  key={`image_${item.id}`}
                >
                  <Typography className={classes.imageTitle}>
                    {item.title}
                  </Typography>
                  <img
                    src={item.mediaUrl}
                    alt="media"
                    className={classes.image}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <ReactPaginate
                  previousLabel={<KeyboardArrowLeft />}
                  nextLabel={<KeyboardArrowRight />}
                  forcePage={page - 1}
                  breakLabel={'...'}
                  breakClassName={'TableLibraryPagination_break-me'}
                  pageCount={mediaReducer[0].meta.lastPage}
                  marginPagesDisplayed={3}
                  pageRangeDisplayed={3}
                  onPageChange={({ selected }) => setPage(selected + 1)}
                  containerClassName={'TableLibraryPagination'}
                  subContainerClassName={
                    'TableLibraryPagination_pages TableLibraryPagination_pagination'
                  }
                  activeClassName={'TableLibraryPagination_active'}
                />
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>
    </>
  )
}

export default withStyles(styles)(MediaImage)
