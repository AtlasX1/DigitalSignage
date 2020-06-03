import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { withSnackbar } from 'notistack'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { withStyles, Grid, Typography } from '@material-ui/core'
import { unstable_Box as Box } from '@material-ui/core/Box'

import { getItems, deleteItem, deleteSelectedItems } from 'actions/tagsActions'
import { TablePaper } from 'components/Paper'
import { TagCard } from 'components/Card'
import { CheckboxSelectAll } from 'components/Checkboxes'
import { TableLibraryFooter } from 'components/TableLibrary'
import EmptyPlaceholder from 'components/EmptyPlaceholder'

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      width: '100%',
      boxShadow: 'none'
    },
    tableWrapper: {
      minHeight: '80vh'
    },
    table: {
      minWidth: 1020,
      minHeight: '80vh'
    },
    tableHead: {
      paddingLeft: '20px',
      borderBottomWidth: 1,
      borderBottomStyle: 'solid',
      borderBottomColor: palette[type].tableLibrary.body.cell.border
    },
    headLabel: {
      marginLeft: '30px',
      fontSize: '15px',
      color: '#74809a'
    },
    filterIconRoot: {
      marginRight: '7px',
      padding: '8px 12px',
      color: '#afb7c7'
    },
    tableHeadCellCheckbox: {
      paddingBottom: '6px'
    },
    tagsContainer: {
      padding: '20px 0'
    }
  }
}

class TagsTable extends PureComponent {
  handleChangePage = ({ selected }) => {
    const {
      getItems,
      meta: { perPage }
    } = this.props

    getItems({
      page: selected + 1,
      limit: perPage
    })
  }

  handleClickDeleteSelectedItems = () => {
    const { deleteSelectedItems, selectedList } = this.props
    deleteSelectedItems(selectedList.selectedIds)
    selectedList.clear()
  }

  handleChangeRowsPerPage = limit => {
    const { getItems } = this.props
    getItems({
      page: 1,
      limit: limit
    })
  }

  handlePressJumper = ({ target: { value }, key }) => {
    const {
      getItems,
      meta: { perPage, lastPage }
    } = this.props
    const page = Number.parseInt(value)

    if (key === 'Enter' && page <= lastPage) {
      getItems({
        page,
        limit: perPage
      })
    }
  }

  render() {
    const {
      t,
      tags,
      classes,
      selectedList,
      meta: { perPage, lastPage, currentPage, isLoading, count }
    } = this.props
    const {
      handleChangePage,
      handlePressJumper,
      handleChangeRowsPerPage,
      handleClickDeleteSelectedItems
    } = this

    return count ? (
      <TablePaper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            className={classes.tableHead}
          >
            <Grid item>
              <Box py={1.5}>
                <Grid container alignItems="center">
                  <Grid item>
                    <CheckboxSelectAll
                      checked={selectedList.isPageSelect}
                      onChange={selectedList.pageSelect}
                    />
                  </Grid>
                  <Grid item>
                    <Typography className={classes.headLabel}>
                      {t('Tags')}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid container className={classes.tagsContainer}>
            {tags.map((tag, index) => (
              <Grid item xs={4} key={`tag-${index}`}>
                <TagCard
                  tag={tag}
                  selected={selectedList.isSelect(tag.id)}
                  onUnselect={selectedList.unselect}
                  onToggleSelect={selectedList.toggle}
                />
              </Grid>
            ))}
          </Grid>
        </div>

        <TableLibraryFooter
          page={currentPage}
          checked={selectedList.isPageSelect}
          pageCount={lastPage}
          onPageChange={handleChangePage}
          onPressJumper={handlePressJumper}
          perPage={perPage}
          handleSelect={selectedList.pageSelect}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          handleClickDeleteSelectedItems={handleClickDeleteSelectedItems}
        />
      </TablePaper>
    ) : (
      <EmptyPlaceholder text={isLoading ? 'Loading...' : 'No saved tags'} />
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getItems,
      deleteItem,
      deleteSelectedItems
    },
    dispatch
  )

export default translate('translations')(
  withStyles(styles)(withSnackbar(connect(null, mapDispatchToProps)(TagsTable)))
)
