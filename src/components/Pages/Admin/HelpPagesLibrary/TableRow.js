import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { bindActionCreators } from 'redux'
import { useFormik } from 'formik'
import { Grid, Link, withStyles } from '@material-ui/core'

import { putItem } from 'actions/helpActions'
import { TableLibraryCell, TableLibraryRow } from 'components/TableLibrary'
import { BlueButton } from 'components/Buttons'
import { DropdownHover } from 'components/Dropdowns'
import BootstrapInputBase from 'components/Form/InputBase'
import { Checkbox, CheckboxSwitcher } from 'components/Checkboxes'
import { unselectItems } from 'utils/tableUtils'

const styles = ({ typography, type }) => ({
  name: {
    ...typography.darkAccent[type]
  },
  urlTooltipWrapper: {
    width: '600px'
  },
  urlTooltip: {
    padding: '12px 16px'
  },
  urlTooltipInputWrap: {
    paddingRight: '10px'
  }
})

const TableRow = ({ row, t, classes, putItem, selected, onSelectRow }) => {
  const form = useFormik({
    initialValues: {
      link: row.link || '',
      status: row.status === 'Active'
    },
    onSubmit: values => {
      putItem(row.id, {
        link: values.link,
        status: values.status === true ? 'Active' : 'Inactive'
      })
    }
  })

  const handleClickSelect = useCallback(() => {
    selected
      ? onSelectRow(values => ({
          ...unselectItems(values, [row.id])
        }))
      : onSelectRow(values => ({
          ...values,
          [row.id]: true
        }))
  }, [row.id, onSelectRow, selected])

  const handleClickStatus = useCallback(
    (event, value) => {
      form.setFieldValue('status', !form.values.status)
      putItem(row.id, {
        link: form.values.link,
        status: value ? 'Active' : 'Inactive'
      })
    },
    [form, putItem, row.id]
  )

  return (
    <TableLibraryRow
      hover
      role="checkbox"
      tabIndex={-1}
      selected={row.selected}
    >
      <TableLibraryCell padding="checkbox" onClick={handleClickSelect}>
        <Checkbox checked={selected} />
      </TableLibraryCell>
      <TableLibraryCell className={classes.name}>{row.page}</TableLibraryCell>
      <TableLibraryCell>
        <DropdownHover
          dropSide="bottomRight"
          menuContainerClassName={classes.urlTooltipWrapper}
          ButtonComponent={
            <Link
              href={form.values.link}
              className={classes.link}
              underline="always"
              target="_blank"
              rel="noreferrer"
            >
              {t('URL')}
            </Link>
          }
          MenuComponent={
            <Grid
              container
              justify="center"
              alignItems="center"
              className={classes.urlTooltip}
            >
              <Grid item xs={10} className={classes.urlTooltipInputWrap}>
                <BootstrapInputBase
                  value={form.values.link}
                  name="link"
                  onChange={form.handleChange}
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={2}>
                <BlueButton
                  fullWidth={true}
                  onClick={form.handleSubmit}
                  className={classes.searchAction}
                >
                  {t('Update Action')}
                </BlueButton>
              </Grid>
            </Grid>
          }
        />
      </TableLibraryCell>
      <TableLibraryCell>
        <CheckboxSwitcher
          handleChange={handleClickStatus}
          value={form.values.status}
        />
      </TableLibraryCell>
      <TableLibraryCell></TableLibraryCell>
    </TableLibraryRow>
  )
}

export default translate('translations')(
  connect(null, dispatch =>
    bindActionCreators(
      {
        putItem
      },
      dispatch
    )
  )(withStyles(styles)(TableRow))
)
