import React, { useMemo } from 'react'
import { Grid, Link, withStyles } from '@material-ui/core'
import { useSelector } from 'react-redux'
import { translate } from 'react-i18next'
import { createSelector } from 'reselect'
import FooterLink from './FooterLink'
import { whiteLabelUtils } from 'utils/index'
import { whiteLabelSelector } from 'selectors/whiteLabelSelectors'

function styles({ typography, palette, type }) {
  return {
    footerGrid: {
      marginBottom: '35px',
      borderTop: `1px solid ${palette[type].pages.singIn.border}`,
      paddingTop: '15px'
    },
    footerText: {
      color: '#888996',
      textAlign: 'center',
      fontFamily: typography.fontFamily,
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5
    }
  }
}

const labels = [
  'Privacy Policy footer link',
  'Term and Conditions footer link',
  'About Mvix footer link'
]

const selector = createSelector(whiteLabelSelector, whiteLabel => whiteLabel)

function Footer({ t, classes }) {
  const whiteLabelReducer = useSelector(selector)

  const { privacyPolicy, termsCondition, aboutPage, helpPage } = useMemo(() => {
    return whiteLabelUtils.parseReducer(whiteLabelReducer)
  }, [whiteLabelReducer])

  const links = useMemo(() => {
    return [privacyPolicy, termsCondition, aboutPage]
  }, [privacyPolicy, termsCondition, aboutPage])

  const renderFooterLinks = useMemo(() => {
    return links.map(({ link }, index) => {
      return <FooterLink key={index} href={link} label={t(labels[index])} />
    })
  }, [links, t])

  return (
    <footer>
      <Grid container justify="center" className={classes.footerGrid}>
        {renderFooterLinks}
      </Grid>
      <Grid className={classes.footerText}>
        If you have any e-Learning queries, please feel free to contact the
        e-Learning team on
        <Link href="tel:+18663104923">+1 866.310.4923</Link>
        {' or alternatively email us on '}
        <FooterLink href={helpPage} label="support.mvixusa.com" inline />
      </Grid>
    </footer>
  )
}

export default translate('translations')(withStyles(styles)(Footer))
