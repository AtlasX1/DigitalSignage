import React from 'react'
import { makeStyles } from '@material-ui/styles'

const logoPath = require('../../../../../common/assets/images/logo-small.svg')

const useStyles = makeStyles({
  wrapper: {
    display: 'inline-flex',
    alignItems: 'baseline'
  },
  logoImg: {
    marginRight: 3,
    width: 50,
    height: 15
  },
  logoText: {
    color: '#1481CE',
    fontFamily: 'inherit',
    fontSize: '15px',
    fontWeight: 300,
    lineHeight: '18px'
  }
})

export const SignageEditorLogo = () => {
  const classes = useStyles()
  return (
    <div className={classes.wrapper}>
      <img className={classes.logoImg} alt="signage editor" src={logoPath} />
      <span className={classes.logoText}>
        <b>Signage</b>Editor
      </span>
    </div>
  )
}
