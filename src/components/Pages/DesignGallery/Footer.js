import React from 'react'

import { makeStyles } from '@material-ui/styles'

import { FOOTER_HEIGHT } from './constans'
import FooterControls from './components/FooterControls'

import './styles/_footer.scss'

const useStyles = makeStyles({
  footer: {
    height: FOOTER_HEIGHT
  }
})

const Footer = () => {
  const classes = useStyles()

  return (
    <div className={`${classes.footer} footer`}>
      <FooterControls />
    </div>
  )
}

export default Footer
