import { Button, Grid, Typography, withStyles } from '@material-ui/core'
import update from 'immutability-helper'
import { withSnackbar } from 'notistack'
import React, { Fragment, useEffect, useState } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Link, Route } from 'react-router-dom'
import { bindActionCreators } from 'redux'

import { BlueButton, CircleIconButton, WhiteButton } from '../../Buttons'
import { CheckboxSelectAll } from '../../Checkboxes'
import { FormControlInput } from '../../Form'
import PageContainer from '../../PageContainer'
import AddFont from './AddFont'
import FontsFilter from './FontFilter/FontsFilter'
import FontRow from './FontRow'

import {
  clearDeleteFontInfoAction,
  clearGetFontsInfo,
  deleteFontAction,
  deleteSavedFont,
  deleteSelectedFonts,
  extendFontsPerPage,
  getFonts,
  getSavedFonts,
  selectAllFonts
} from 'actions/fontsActions'

const styles = ({ palette, type }) => ({
  actionIcons: {
    marginRight: '17px'
  },
  iconColor: {
    marginRight: '9px',
    fontSize: '14px',
    color: palette[type].pageContainer.header.button.iconColor
  },
  content: {
    width: '100%',
    borderRight: `1px solid ${palette[type].pages.fonts.border}`,
    backgroundColor: palette[type].pages.fonts.background
  },

  contentHeader: {
    padding: '45px 75px 20px',
    borderBottom: `1px solid ${palette[type].pages.fonts.border}`,
    backgroundColor: palette[type].pages.fonts.header.background
  },
  placeholderInput: {
    border: 'none',
    fontSize: '31px',
    color: '#888996',
    backgroundColor: palette[type].pages.fonts.header.input.background,

    '&:focus': {
      boxShadow: 'none'
    }
  },
  footerWrap: {
    paddingLeft: '25px',
    backgroundColor: palette[type].pages.fonts.footer.background,
    borderTop: `1px solid ${palette[type].pages.fonts.footer.border}`
  },
  footerCheckboxSelectAll: {
    marginRight: '10px'
  },
  footerCircleIcon: {
    fontSize: '18px',
    color: '#adb7c9'
  },
  loadMoreButtonContainer: {
    padding: '10px'
  },
  selectTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: palette[type].pageContainer.header.titleColor
  },
  selectSubTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: palette[type].pageContainer.header.titleColor
  }
})

const FontLibrary = ({
  t,
  classes,
  extendFontsPerPage,
  selectAllFonts,
  getFonts,
  clearGetFontsInfo,
  libraryReducer,
  fontsPerPageReducer,
  deleteFontAction,
  clearDeleteFontInfoAction,
  deleteReducer,
  enqueueSnackbar,
  closeSnackbar
}) => {
  const [data, setData] = useState([])
  const [placeholder, setPlaceholder] = useState('')
  const [defaultPlaceholder] = useState(
    t('The quick brown fox jumps over the lazy dog')
  )
  const [fontsPerPage, setFontsPerPage] = useState(20)
  const [extensionSize] = useState(4)
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState([])

  const timeout = null

  useEffect(() => {
    if (!libraryReducer.response) {
      getFonts()
    }

    return () => {
      clearTimeout(timeout)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (libraryReducer.response) {
      setData(libraryReducer.response.data)

      setLoaded(true)
      clearGetFontsInfo()
    } else if (libraryReducer.error) {
      setLoaded(true)
      clearGetFontsInfo()
    }
    // eslint-disable-next-line
  }, [libraryReducer])

  const handleCustomTextInputChange = ({ target: { value } }) => {
    setPlaceholder(value)
  }

  const loadMoreHandler = () => {
    setLoaded(false)

    extendFontsPerPage(fontsPerPage, fontsPerPage + extensionSize)

    setFontsPerPage(fontsPerPage + extensionSize)
    setLoaded(true)
  }

  const handleDelete = id => {
    deleteFontAction(id)
  }

  useEffect(() => {
    if (deleteReducer.response) {
      getFonts()

      showSnackbar(t('Successfully deleted'))
      clearDeleteFontInfoAction()
    } else if (deleteReducer.error) {
      showSnackbar(t('Error'))
      clearDeleteFontInfoAction()
    }
    // eslint-disable-next-line
  }, [deleteReducer])

  const showSnackbar = title => {
    enqueueSnackbar(title, {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeSnackbar(key)}
        >
          {t('OK')}
        </Button>
      )
    })
  }

  const handleSelectAll = event =>
    event.target.checked
      ? setSelected(data.map(row => row.id))
      : setSelected([])

  const handleSelect = (event, id) => {
    const index = selected.indexOf(id)

    if (index !== -1) {
      setSelected(
        update(selected, {
          $splice: [[index, 1]]
        })
      )
    } else {
      setSelected(
        update(selected, {
          $push: [id]
        })
      )
    }
  }

  return (
    <PageContainer
      pageTitle={t('Font page title')}
      PageTitleComponent={
        selected.length > 0 ? (
          <div
            key="selectTitle"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography component="h2" className={classes.selectTitle}>
              {`${t('Font page title')} |`}
            </Typography>
            {'\u00A0'}
            <Typography
              component="h3"
              variant="subtitle1"
              className={classes.selectSubTitle}
            >
              {`${selected.length} ${t('selected')}`}
            </Typography>
          </div>
        ) : null
      }
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton
            className={`hvr-radial-out ${classes.actionIcons}`}
            component={Link}
            to="/font-library/add-font"
          >
            <i className={`${classes.iconColor} icon-folder-video`} />
            {t('Add Font table action')}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderMenuComponent={<FontsFilter fontsPerPage={fontsPerPage} />}
    >
      <Grid container>
        <Grid item className={classes.content}>
          <header className={classes.contentHeader}>
            <FormControlInput
              id="custom-text"
              value={placeholder}
              fullWidth={true}
              placeholder={t('Enter your custom text here')}
              formControlInputClass={classes.placeholderInput}
              onChange={handleCustomTextInputChange}
            />
          </header>
          <Grid container direction="row">
            {data.map((font, index) => (
              <FontRow
                key={index}
                placeholder={placeholder || defaultPlaceholder}
                font={font}
                selected={selected.includes(font.id)}
                handleSelect={event => handleSelect(event, font.id)}
                handleDelete={handleDelete}
              />
            ))}
          </Grid>
          <Grid
            container
            justify="center"
            className={classes.loadMoreButtonContainer}
          >
            <BlueButton disabled={!loaded} onClick={loadMoreHandler}>
              {loaded ? t('Load More') : `${t('Loading')}...`}
            </BlueButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classes.footerWrap}
      >
        <Grid item>
          <CheckboxSelectAll
            className={classes.footerCheckboxSelectAll}
            checked={selected.length === data.length}
            onChange={handleSelectAll}
          />
          <CircleIconButton className={`hvr-grow ${classes.footerCircleIcon}`}>
            <i className="icon-bin" />
          </CircleIconButton>
          <CircleIconButton className={`hvr-grow ${classes.footerCircleIcon}`}>
            <i className="icon-tag-1" />
          </CircleIconButton>
        </Grid>
      </Grid>
      <Route path="/font-library/add-font" component={AddFont} />
    </PageContainer>
  )
}

const mapStateToProps = ({
  fonts: { perPage, webFontConfig, addedFonts, library, delete: deleteReducer }
}) => ({
  fontsPerPageReducer: perPage,
  webFontConfig,
  addedFonts,
  libraryReducer: library,
  deleteReducer: deleteReducer
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSavedFonts,
      extendFontsPerPage,
      deleteSavedFont,
      selectAllFonts,
      deleteSelectedFonts,
      getFonts,
      clearGetFontsInfo,
      deleteFontAction,
      clearDeleteFontInfoAction
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(
    withSnackbar(connect(mapStateToProps, mapDispatchToProps)(FontLibrary))
  )
)
