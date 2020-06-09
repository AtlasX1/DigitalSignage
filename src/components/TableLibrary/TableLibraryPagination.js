import React from 'react'
import { translate } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import classNames from 'classnames'

import PropTypes from 'prop-types'
import { withStyles, Typography, Grid, List } from '@material-ui/core'

import {
  KeyboardArrowDown,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons'
import { WhiteButton } from 'components/Buttons'

import { BootstrapInputBase } from 'components/Form'
import 'styles/pagination/_pagination.scss'
import {
  DropdownHover,
  DropdownHoverListItem,
  DropdownHoverListItemText
} from 'components/Dropdowns'

const styles = theme => {
  const { palette, type, typography } = theme
  return {
    root: {
      height: '50px',
      paddingRight: '15px'
    },
    paginationInputWraps: {
      width: '63px',
      marginRight: '13px'
    },
    paginationWrap: {
      marginRight: '18px',
      paddingRight: '5px',
      borderRight: `1px solid ${palette[type].tableLibrary.footer.pagination.border}`
    },
    goToWrap: {
      marginRight: '20px',
      borderRight: `1px solid ${palette[type].tableLibrary.footer.pagination.border}`
    },
    paginationText: {
      marginRight: '10px',
      ...typography.lightText[type]
    },
    paginationInput: {
      height: '32px'
    },

    rowActionBtn: {
      minWidth: '61px',
      paddingLeft: '10px',
      paddingRight: '10px',
      boxShadow: `0 1px 0 0 ${palette[type].tableLibrary.footer.pagination.button.shadow}`,
      color: palette[type].tableLibrary.footer.pagination.button.color,
      backgroundColor:
        palette[type].tableLibrary.footer.pagination.button.background,
      borderColor: palette[type].tableLibrary.footer.pagination.button.border,

      '&:hover': {
        borderColor: '#1c5dca',
        backgroundColor: '#1c5dca',
        color: '#fff'
      }
    },
    rowActionBtnIcon: {
      width: 18,
      height: 18
    },
    textLight: {
      ...typography.lightText[type]
    }
  }
}

const TableLibraryPagination = ({
  t,
  classes,
  pageCount = 0,
  previousLabel = <KeyboardArrowLeft />,
  nextLabel = <KeyboardArrowRight />,
  marginPagesDisplayed = 3,
  pageRangeDisplayed = 3,
  onPageChange,
  page = 1,
  onPressJumper,
  perPage,
  perPageOptions,
  onChangeRowsPerPage,
  displayPaginationOptions = true
}) => {
  return (
    <Grid
      container
      alignItems="center"
      justify="flex-end"
      className={classes.root}
    >
      <Grid item className={classes.paginationWrap}>
        <ReactPaginate
          previousLabel={previousLabel}
          nextLabel={nextLabel}
          forcePage={page - 1}
          breakLabel={'...'}
          breakClassName={'TableLibraryPagination_break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={marginPagesDisplayed}
          pageRangeDisplayed={pageRangeDisplayed}
          onPageChange={onPageChange}
          containerClassName={classNames(
            'TableLibraryPagination',
            classes.textLight
          )}
          subContainerClassName={
            'TableLibraryPagination_pages TableLibraryPagination_pagination'
          }
          activeClassName={'TableLibraryPagination_active'}
        />
      </Grid>
      <Grid
        item
        className={classNames({ [classes.goToWrap]: displayPaginationOptions })}
      >
        <Grid container alignItems="center">
          <Grid item>
            <Typography className={classes.paginationText}>
              {t('Pagination Go to page')}
            </Typography>
          </Grid>
          <Grid item className={classes.paginationInputWraps}>
            <BootstrapInputBase
              type="text"
              defaultValue={''}
              onKeyPress={onPressJumper}
              fullWidth
              classes={{ input: classes.paginationInput }}
            />
          </Grid>
        </Grid>
      </Grid>
      {displayPaginationOptions && (
        <Grid item>
          <Grid container alignItems="center">
            <Grid item>
              <Typography className={classes.paginationText}>
                {t('Pagination Show')}
              </Typography>
            </Grid>
            <Grid item className={classes.paginationInputWraps}>
              <DropdownHover
                dropSide="bottomCenter"
                buttonHoverColored
                ButtonComponent={
                  <WhiteButton className={classes.rowActionBtn}>
                    {perPage}
                    <KeyboardArrowDown className={classes.rowActionBtnIcon} />
                  </WhiteButton>
                }
                MenuComponent={
                  <List component="nav" disablePadding>
                    {perPageOptions.map((item, index) => (
                      <DropdownHoverListItem
                        key={`perPageItem-${index}`}
                        onClick={() => onChangeRowsPerPage(item)}
                      >
                        <DropdownHoverListItemText primary={item} />
                      </DropdownHoverListItem>
                    ))}
                  </List>
                }
              />
            </Grid>
            <Grid item>
              <Typography className={classes.paginationText}>
                {t('Pagination Per page')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

TableLibraryPagination.propTypes = {
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onPressJumper: PropTypes.func,
  displayPaginationOptions: PropTypes.bool
}

export default translate('translations')(
  withStyles(styles)(TableLibraryPagination)
)
