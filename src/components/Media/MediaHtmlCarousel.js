import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import Slider from 'react-slick'
import classNames from 'classnames'
import { withStyles, Typography } from '@material-ui/core'

import 'styles/slider/_slick-slider.scss'

const styles = () => ({
  root: {
    maxWidth: '600px',
    margin: '0 35px'
  },
  sliderItem: {
    width: '169px',
    height: '99px',
    background: '#ffffff',
    textAlign: 'center',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      maxHeight: '100%'
    }
  },
  sliderContainer: {
    outline: 'none',
    border: '2px solid transparent',
    '&.is-active': {
      borderColor: '#3a8cff'
    }
  },
  slickDots: {
    display: 'flex !important',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
    width: '100%',
    padding: 0,
    margin: 0,
    listStyle: 'none',
    textAlign: 'center',
    '& li': {
      width: 15,
      height: 15,
      margin: '0 5px',
      cursor: 'pointer'
    },
    '& li button': {
      width: '100%',
      height: '100%',
      color: 'white',
      background: 'white',
      border: 0,
      padding: 0,
      borderRadius: '50%',
      outline: 'none',
      cursor: 'pointer',
      opacity: 0.5
    },
    '& li.slick-active button': {
      opacity: 1
    }
  },
  errorMessage: {
    padding: '5px 20px',
    fontSize: 12,
    color: 'red'
  }
})

class MediaHtmlCarousel extends Component {
  static propTypes = {
    slides: PropTypes.array,
    settings: PropTypes.object,
    onSlideClick: PropTypes.func,
    error: PropTypes.string,
    touched: PropTypes.bool,
    multiple: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.slider = React.createRef()
  }

  componentDidMount() {
    if (this.props.selectedSlideIndex) {
      this.slider.current.slickGoTo(this.props.selectedSlideIndex)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.selectedSlideIndex !== this.props.selectedSlideIndex) {
      this.slider.current.slickGoTo(this.props.selectedSlideIndex)
    }
  }

  render() {
    const {
      classes,
      slides,
      settings,
      onSlideClick,
      activeSlide,
      customClasses,
      error,
      touched,
      multiple
    } = this.props
    const sliderSettings = {
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      dotsClass: classes.slickDots,
      ...settings
    }

    const isActive = name => {
      if (multiple) {
        // if multiple -> activeSlide should be an Array of names -> [name, name, name]
        return activeSlide && !!activeSlide.find(poster => poster === name)
      }
      return activeSlide && activeSlide === name
    }

    return (
      <div className={classNames(classes.root, customClasses.root)}>
        <Slider {...sliderSettings} ref={this.slider}>
          {slides.map((slide, key) => {
            return (
              <div
                key={key}
                className={classNames(classes.sliderContainer, {
                  'is-active': isActive(slide.name)
                })}
                onClick={() => onSlideClick(slide)}
              >
                <div
                  className={classNames(
                    classes.sliderItem,
                    customClasses.sliderItem
                  )}
                >
                  {slide.content}
                </div>
              </div>
            )
          })}
        </Slider>
        {error && touched && (
          <Typography className={classes.errorMessage}>{error}</Typography>
        )}
      </div>
    )
  }
}

MediaHtmlCarousel.defaultProps = {
  slides: [],
  settings: {},
  customClasses: {},
  onSlideClick: () => {},
  error: '',
  touched: false,
  multiple: false
}

export default translate('translations')(withStyles(styles)(MediaHtmlCarousel))
