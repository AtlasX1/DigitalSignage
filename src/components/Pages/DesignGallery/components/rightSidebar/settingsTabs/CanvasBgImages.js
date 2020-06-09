import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'

import { withStyles } from '@material-ui/core'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

import { useCanvasState } from '../../canvas/CanvasProvider'

import ConfirmModal from '../../modals/ConfirmModal'
import PreviewGrids from '../../leftSidebar/grids/PreviewGrids'
import Search from '../../commonBlocks/Search'

import { getBackgroundImages } from 'actions/designGalleryActions'

const styles = theme => ({
  imagesWrapper: {
    width: '100%',
    padding: '10px 20px',

    '& > .TableLibraryPagination': {
      margin: '0 -20px',
      justifyContent: 'space-between',

      '& > li': {
        margin: '0 !important'
      }
    }
  },
  grids: {
    margin: '10px 0'
  }
})

const CanvasBgImages = ({ classes, onChangeBackground }) => {
  const dispatch = useDispatch()

  const [photos, isFetching, total_results] = useSelector(state => [
    state.editor.leftSidebar.photos,
    state.editor.leftSidebar.isFetching,
    state.editor.leftSidebar.total_results
  ])

  const [image, setImage] = useState(undefined)
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [page, setPage] = useState(0)
  const [searchTerm, setSearchTerm] = useState('business')

  const [{ canvasHandlers }] = useCanvasState()

  const handleOptionChange = val => {
    if (!canvasHandlers.isEmptyFrame()) {
      setImage(val)
      setConfirmDialogOpen(true)
    } else {
      setImage(val)
      onChangeBackground(val)
    }
  }

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false)
    onChangeBackground(image)
  }

  useEffect(
    () => {
      dispatch(
        getBackgroundImages({
          query: searchTerm,
          photosPage: page + 1,
          perPage: 20,
          changeImages: true
        })
      )
    },
    // eslint-disable-next-line
    [searchTerm, page]
  )

  return (
    <>
      <div className={classes.imagesWrapper}>
        <Search
          placeholder={'Search'}
          value={searchTerm}
          onChange={term => setSearchTerm(term)}
        />
        <div className={classes.grids}>
          <PreviewGrids
            isVisible={true}
            isLoading={isFetching}
            grids={photos}
            onPreviewClick={handleOptionChange}
            colWidth={2}
          />
        </div>
        <ReactPaginate
          previousLabel={<KeyboardArrowLeft />}
          nextLabel={<KeyboardArrowRight />}
          forcePage={page}
          breakLabel={'...'}
          breakClassName={'TableLibraryPagination_break-me'}
          pageCount={Math.ceil(total_results / 20)}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          onPageChange={val => setPage(val.selected)}
          containerClassName={'TableLibraryPagination'}
          subContainerClassName={
            'TableLibraryPagination_pages TableLibraryPagination_pagination'
          }
          activeClassName={'TableLibraryPagination_active'}
        />
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
export default withStyles(styles)(CanvasBgImages)
