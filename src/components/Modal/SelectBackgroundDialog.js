import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { bindActionCreators, compose } from 'redux'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import classNames from 'classnames'
import ReactPaginate from 'react-paginate'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'
import { isEmpty as _isEmpty } from 'lodash'

import {
  getBackgroundImagesFromMedia,
  getBackgroundPattern
} from 'actions/configActions'
import DefaultModal from 'components/Modal/DefaultModal'
import {
  FormControlReactSelect,
  FormControlSketchColorPicker
} from 'components/Form'
import BackgroundImageCard from 'components/Card/BackgroundImageCard'

const styles = () => ({
  content: {
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: '40px'
  },
  stretch: {
    gridColumnStart: 1,
    gridColumnEnd: 3
  },
  items: {
    marginTop: 20,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridColumnGap: '20px',
    gridRowGap: '20px'
  },
  pagination: {
    gridColumnStart: 2,
    justifySelf: 'end',
    margin: '20px 0'
  },
  imageCard: {
    height: '255px'
  }
})

const SelectBackgroundDialog = ({
  t,
  classes,
  images,
  meta,
  patterns,
  onClickSave,
  getBackgroundPattern,
  getBackgroundImagesFromMedia,
  values,
  ...props
}) => {
  const [bgColor, setBgColor] = useState('rgba(0, 0, 0, 1)')
  const [image, setImage] = useState(200)
  const [type, setType] = useState('none')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState('original')
  const [pattern, setPattern] = useState('vertical_stripes')
  const [patternsPerPage, setPatternsPerPage] = useState([])

  const handleChangeColor = useCallback(color => setBgColor(color), [])

  const handleChangeType = useCallback(
    ({ target: { value } }) => setType(value),
    []
  )

  const handleSelectImage = useCallback(value => setImage(value), [])

  const handleSelectPattern = useCallback(value => {
    setPattern(value)
  }, [])

  const handleChangeSize = useCallback(
    ({ target: { value } }) => setSize(value),
    []
  )

  const handleChangePage = useCallback(
    ({ selected }) => {
      if (type === 'image') {
        getBackgroundImagesFromMedia({
          page: selected + 1
        })
      }
      if (type === 'pattern') {
        setPatternsPerPage(patterns.slice(selected * 6, (selected + 1) * 6))
      }
      setPage(selected)
    },
    [getBackgroundImagesFromMedia, patterns, type]
  )

  const handleClickSave = useCallback(() => {
    onClickSave({
      type,
      image_id: image,
      size: size,
      color: bgColor,
      pattern
    })
  }, [bgColor, image, onClickSave, pattern, size, type])

  const renderItems = useMemo(() => {
    switch (type) {
      case 'image': {
        return images.map(({ mediaUrl, title, id }) => (
          <BackgroundImageCard
            key={`background-image-${id}`}
            className={classes.imageCard}
            title={title}
            src={mediaUrl}
            id={id}
            onSelectImage={handleSelectImage}
            isSelect={image === id}
          />
        ))
      }
      case 'pattern':
        return patternsPerPage.map(({ thumb, name, tooltip, id }) => (
          <BackgroundImageCard
            key={`background-image-${id}`}
            className={classes.imageCard}
            title={tooltip}
            src={thumb}
            id={name}
            onSelectImage={handleSelectPattern}
            isSelect={pattern === name}
          />
        ))
      default:
        return null
    }
  }, [
    classes.imageCard,
    handleSelectImage,
    handleSelectPattern,
    image,
    images,
    pattern,
    patternsPerPage,
    type
  ])

  useEffect(
    () => {
      getBackgroundPattern()
      getBackgroundImagesFromMedia()
    },
    // eslint-disable-next-line
    []
  )

  useEffect(
    () => {
      if (!_isEmpty(patterns)) {
        setPatternsPerPage(patterns.slice(0, 6))
      }
    },
    // eslint-disable-next-line
    [patterns]
  )

  useEffect(
    () => {
      if (values) {
        setBgColor(values.color)
        setImage(values.image_id)
        setPattern(values.pattern)
        setSize(values.size)
        setType(values.type)
      }
    },
    // eslint-disable-next-line
    [values]
  )

  return (
    <DefaultModal
      modalTitle="Background settings"
      maxWidth="lg"
      onClickSave={handleClickSave}
      contentClass={classes.content}
      {...props}
    >
      <FormControlReactSelect
        options={[
          { value: 'none', label: 'None' },
          { value: 'image', label: 'Image' },
          { value: 'pattern', label: 'Pattern' }
        ]}
        label={t('Select Background')}
        formControlContainerClass={classNames({
          [classes.stretch]: type === 'none'
        })}
        value={type}
        onChange={handleChangeType}
      />
      {type === 'pattern' && (
        <FormControlSketchColorPicker
          color={bgColor}
          label={t('Background Color')}
          onColorChange={handleChangeColor}
          marginBottom={false}
        />
      )}
      {type === 'image' && (
        <FormControlReactSelect
          options={[
            { value: 'original', label: 'Original' },
            { value: 'stretch', label: 'Stretch' }
          ]}
          label={t('Image size')}
          value={size}
          onChange={handleChangeSize}
        />
      )}
      <div className={classNames(classes.stretch, classes.items)}>
        {renderItems}
      </div>
      <div className={classes.pagination}>
        <ReactPaginate
          previousLabel={<KeyboardArrowLeft />}
          nextLabel={<KeyboardArrowRight />}
          forcePage={page}
          breakLabel={'...'}
          breakClassName={'TableLibraryPagination_break-me'}
          pageCount={meta.lastPage}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          onPageChange={handleChangePage}
          containerClassName={'TableLibraryPagination'}
          subContainerClassName={
            'TableLibraryPagination_pages TableLibraryPagination_pagination'
          }
          activeClassName={'TableLibraryPagination_active'}
        />
      </div>
    </DefaultModal>
  )
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getBackgroundPattern,
      getBackgroundImagesFromMedia
    },
    dispatch
  )

const mapStateToProps = ({
  config: {
    backgroundImages: { response: images, meta },
    backgroundPatterns: { response: patterns }
  }
}) => ({
  images,
  patterns,
  meta
})

export default compose(
  translate('translations'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(SelectBackgroundDialog)
