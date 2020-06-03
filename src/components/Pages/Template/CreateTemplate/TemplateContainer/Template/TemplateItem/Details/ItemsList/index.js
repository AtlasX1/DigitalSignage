import React from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid, Typography } from '@material-ui/core'
import { KeyboardArrowDown, Settings } from '@material-ui/icons'

import Popup from '../../../../../../../../Popup'
import LibraryTypeIcon from '../../../../../../../../LibraryTypeIcon'
import { WhiteButton } from '../../../../../../../../Buttons'

import '../../../../../../../../../styles/template/_template.scss'

const images = {
  tempImage: require('../../../../../../../../../common/assets/images/template_item_details_icon_hover.png')
}

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      width: 'calc(100% + 64px)',
      marginLeft: -32
    },
    item: {
      width: '100%',
      height: '70px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${palette[type].sideModal.content.border}`,
      paddingLeft: 32,
      paddingRight: 32,

      '&:last-child': {
        borderBottom: '0'
      },
      '&:hover': {
        background: palette[type].sideModal.action.background
      }
    },
    itemLabel: {
      fontWeight: 'bold',
      minWidth: '120px',
      maxWidth: '120px',
      color: palette[type].pages.createTemplate.modal.item.color
    },
    itemInfo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end'
    },
    itemInfoTitle: {
      fontSize: '14px',
      color: palette[type].sideModal.header.titleColor,
      textAlign: 'right'
    },
    itemInfoSubTitle: {
      fontSize: '12px',
      color: '#9394a0',
      textAlign: 'right'
    },
    button: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',
      color: palette[type].sideModal.action.button.color,

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    buttonIcon: {
      width: 18,
      height: 18
    },
    buttonDropdownContainer: {
      width: '100px',
      height: '100px'
    },
    iconDropdownContainer: {
      width: '264px',
      padding: '10px'
    },
    iconDropdownLabelContainer: {
      display: 'flex',
      marginBottom: '10px',
      '&:last-child': {
        marginBottom: '0'
      }
    },
    iconDropdownLabel: {
      minWidth: '100px',
      width: '100px',
      fontSize: '12px',
      color: '#535d73'
    },
    iconDropdownValue: {
      fontSize: '12px',
      color: '#535d73',
      fontWeight: 'bold',
      marginLeft: '10px'
    },
    iconDropdownImage: {
      width: '100%',
      maxWidth: '100%',
      marginBottom: '15px'
    }
  }
}

const ItemsList = ({ t, classes }) => (
  <Grid className={classes.container}>
    <Grid className={classes.item}>
      <Popup
        trigger={
          <div>
            <LibraryTypeIcon type={'GALLERY'} />
          </div>
        }
        position="bottom center"
        on="hover"
        contentStyle={{
          width: 'fit-content',
          border: 'none',
          borderRadius: 6,
          animation: 'fade-in 500ms'
        }}
        arrowStyle={{
          border: 'none',
          boxShadow: 'rgba(0, 0, 0, 0.05) 1px 1px 1px'
        }}
      >
        <Grid className={classes.iconDropdownContainer}>
          <img
            src={images.tempImage}
            alt="Template Item Icon"
            className={classes.iconDropdownImage}
          />
          <Grid className={classes.iconDropdownLabelContainer}>
            <Typography
              className={[
                classes.iconDropdownLabel,
                'TemplateItem--item__icon--labelSASS'
              ].join(' ')}
            >
              {t('Name')}
            </Typography>
            <Typography className={classes.iconDropdownValue}>
              Amber Theme 1
            </Typography>
          </Grid>
          <Grid className={classes.iconDropdownLabelContainer}>
            <Typography
              className={[
                classes.iconDropdownLabel,
                'TemplateItem--item__icon--labelSASS'
              ].join(' ')}
            >
              {t('Media Format')}
            </Typography>
            <Typography className={classes.iconDropdownValue}>
              Alert System
            </Typography>
          </Grid>
        </Grid>
      </Popup>
      <Typography className={classes.itemLabel}>Mvix Sample Demo</Typography>
      <Grid className={classes.itemInfo}>
        <Typography className={classes.itemInfoTitle}>00:00:55</Typography>
        <Typography className={classes.itemInfoSubTitle}>
          {`${t('Resolution')} 1920 x 1080`}{' '}
        </Typography>
      </Grid>
      <Popup
        trigger={
          <WhiteButton className={classes.button}>
            <Settings className={classes.buttonIcon} />
            <KeyboardArrowDown className={classes.buttonIcon} />
          </WhiteButton>
        }
        position="bottom center"
        on="hover"
        contentStyle={{
          width: 'fit-content',
          border: 'none',
          borderRadius: 6,
          animation: 'fade-in 500ms'
        }}
        arrowStyle={{
          border: 'none',
          boxShadow: 'rgba(0, 0, 0, 0.05) 1px 1px 1px'
        }}
      >
        <Grid className={classes.buttonDropdownContainer} />
      </Popup>
    </Grid>
  </Grid>
)

export default translate('translations')(withStyles(styles)(ItemsList))
