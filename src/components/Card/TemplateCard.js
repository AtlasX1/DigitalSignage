import React from 'react'
import { translate } from 'react-i18next'

import {
  withStyles,
  Grid,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import { Settings } from '@material-ui/icons'

import Card from './Card'
import { WhiteButton } from '../Buttons'
import { DropdownHover } from '../Dropdowns'
import { ActiveStatusChip, InactiveStatusChip } from '../Chip'

const styles = theme => {
  const { palette, type } = theme
  return {
    cardRoot: {
      padding: 0,
      border: `solid 1px ${palette[type].templateCard.border}`,
      boxShadow: `0 2px 4px 0 ${palette[type].templateCard.shadow}`,
      borderRadius: '7px'
    },
    cardHeader: {
      padding: '30px 20px 15px',
      marginBottom: 0,
      backgroundColor: palette[type].templateCard.header.background,
      borderRadius: '7px 7px 0 0'
    },
    cardHeaderText: {
      fontSize: '16px'
    },
    templatePreview: {
      margin: '30px 0',
      textAlign: 'center'
    },
    templatePreviewImg: {
      maxWidth: '205px',
      maxHeight: '120px'
    },
    footer: {
      padding: '15px 18px',
      backgroundColor: palette[type].templateCard.footer.background,
      borderRadius: '0 0 7px 7px'
    },
    footerCheckbox: {
      marginRight: '10px'
    },
    actionDropdown: {
      overflow: 'hidden'
    },
    rowActionBtn: {
      minWidth: '32px',
      paddingLeft: '5px',
      paddingRight: '5px',
      boxShadow: '0 1px 0 0 rgba(216, 222, 234, 0.5)',
      color: '#0a83c8',

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#f5f6fa'
      }
    },
    rowActionBtnIcon: {
      width: 18,
      height: 18
    },
    cardActionList: {
      width: '185px',
      display: 'flex',
      flexDirection: 'row'
    },
    actionBtnLink: {
      flex: '1 1 auto',
      flexDirection: 'column',
      width: 'auto',
      paddingTop: 0,
      paddingLeft: 0,
      paddingRight: 0,
      minWidth: '60px',

      '&:not(:last-child)': {
        borderRight: '1px solid #e6eaf4'
      }
    },
    actionBtnIconWrap: {
      margin: '15px 0'
    },
    actionBtnIcon: {
      fontSize: '24px',
      color: '#74809a'
    },
    actionBtnText: {
      fontSize: '12px',
      color: '#74809a'
    }
  }
}

const TemplateCard = ({ t, classes, ...props }) => {
  const {
    template,
    selectable = false,
    additionalAction = false,
    isSelected = null
  } = props

  const handleClick = (event, id) => {
    const { selected, setSelected } = props
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  return (
    <Card
      icon={false}
      title={template.name}
      rootClassName={classes.cardRoot}
      headerClasses={[classes.cardHeader]}
      headerTextClasses={classes.cardHeaderText}
    >
      <div className={classes.templatePreview}>
        <img
          className={classes.templatePreviewImg}
          src={template.screenPreviewURL}
          alt=""
        />
      </div>
      <footer className={classes.footer}>
        <Grid container justify="space-between">
          <Grid item>
            <Grid container>
              {selectable && (
                <Grid
                  item
                  className={classes.footerCheckbox}
                  onClick={event => handleClick(event, template.id)}
                >
                  <Checkbox checked={isSelected} />
                </Grid>
              )}
              <Grid item>
                {template.status ? (
                  <ActiveStatusChip label={t('Active')} />
                ) : (
                  <InactiveStatusChip label={t('Inactive')} />
                )}
              </Grid>
            </Grid>
          </Grid>
          {additionalAction && (
            <Grid item>
              <DropdownHover
                menuClassName={classes.actionDropdown}
                buttonHoverColored={true}
                dropSide="bottomCenter"
                ButtonComponent={
                  <WhiteButton className={classes.rowActionBtn}>
                    <Settings className={classes.rowActionBtnIcon} />
                  </WhiteButton>
                }
                MenuComponent={
                  <List
                    component="nav"
                    disablePadding={true}
                    className={classes.cardActionList}
                  >
                    <ListItem button className={classes.actionBtnLink}>
                      <ListItemIcon className={classes.actionBtnIconWrap}>
                        <i
                          className={`icon-pencil-write ${classes.actionBtnIcon}`}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('Edit')}
                        classes={{ primary: classes.actionBtnText }}
                      />
                    </ListItem>
                    <ListItem button className={classes.actionBtnLink}>
                      <ListItemIcon className={classes.actionBtnIconWrap}>
                        <i className={`icon-bin ${classes.actionBtnIcon}`} />
                      </ListItemIcon>
                      <ListItemText
                        primary={t('Delete')}
                        classes={{ primary: classes.actionBtnText }}
                      />
                    </ListItem>
                  </List>
                }
              />
            </Grid>
          )}
        </Grid>
      </footer>
    </Card>
  )
}

export default translate('translations')(withStyles(styles)(TemplateCard))
