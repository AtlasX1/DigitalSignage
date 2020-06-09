import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'
import Footer from './Footer'
import BackgroundImage from 'common/assets/images/sign-in.jpg'

function styles({ palette, type }) {
  return {
    root: {
      position: 'relative',
      overflow: 'hidden',
      width: '100vw',
      height: '100vh',
      background: `url("${BackgroundImage}") no-repeat`,
      backgroundSize: 'cover',

      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        backgroundImage: 'linear-gradient(#00e7c1, #00d0e6)'
      },

      '&::before': {
        top: 0,
        left: '-100%',
        right: '70%',
        bottom: 0,
        transform: 'skewX(20deg)'
      },

      '&::after': {
        top: '-10%',
        right: 0,
        width: '400px',
        height: '50%',
        opacity: '.8',
        transform: 'skewX(70deg)'
      }
    },
    formWrap: {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      left: '120px',
      zIndex: 2,
      width: '640px',
      padding: '95px 35px 25px',
      background: palette[type].pages.singIn.background,
      transform: 'translateY(-50%)'
    }
  }
}

function AccountModal({ classes, rootClassName, formWrapClassName, children }) {
  return (
    <div className={classNames(classes.root, rootClassName)}>
      <div className={classNames(classes.formWrap, formWrapClassName)}>
        {children}
        <Footer />
      </div>
    </div>
  )
}

AccountModal.propTypes = {
  classes: PropTypes.object,
  rootClassName: PropTypes.string,
  children: PropTypes.node
}

export default withStyles(styles)(AccountModal)
