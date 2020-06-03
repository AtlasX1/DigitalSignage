import React, { Component } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'

import { FormControlSelect } from '../../Form'

import MediaHtmlCarousel from '../MediaHtmlCarousel'
import { WhiteButton } from '../../Buttons'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      margin: '20px 25px',
      fontFamily: typography.fontFamily
    },
    previewMediaBtn: {
      padding: '10px 25px 8px',
      border: `1px solid ${palette[type].sideModal.action.button.border}`,
      backgroundImage: palette[type].sideModal.action.button.background,
      borderRadius: '4px',
      boxShadow: 'none'
    },
    previewMediaText: {
      fontWeight: 'bold',
      color: palette[type].sideModal.action.button.color
    },
    themeCardWrap: {
      border: `solid 1px ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.background,
      borderRadius: '4px',
      overflow: 'hidden'
    },
    themeHeader: {
      padding: '0 15px',
      borderBottom: `1px solid ${palette[type].pages.media.card.border}`,
      backgroundColor: palette[type].pages.media.card.header.background
    },
    themeHeaderText: {
      fontWeight: 'bold',
      lineHeight: '42px',
      color: palette[type].pages.media.card.header.color,
      fontSize: '12px'
    },
    previewMediaRow: {
      marginTop: '99px'
    },
    categoryContainer: {
      marginTop: '16px'
    }
  }
}

class Sports extends Component {
  render() {
    const { t, classes } = this.props

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <FormControlSelect
              label="Category"
              placeholder="Select a Category"
              marginBottom={false}
            />
          </Grid>
        </Grid>
        <Grid container justify="center" className={classes.categoryContainer}>
          <Grid item xs={12} className={classes.themeCardWrap}>
            <header className={classes.themeHeader}>
              <Typography className={classes.themeHeaderText}>
                Select Type
              </Typography>
            </header>
            <Grid container>
              <Grid item xs>
                <MediaHtmlCarousel />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-between"
          alignItems="center"
          className={classes.previewMediaRow}
        >
          <Grid item>
            <WhiteButton className={classes.previewMediaBtn}>
              <Typography className={classes.previewMediaText}>
                {t('Preview Media')}
              </Typography>
            </WhiteButton>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default translate('translations')(withStyles(styles)(Sports))
