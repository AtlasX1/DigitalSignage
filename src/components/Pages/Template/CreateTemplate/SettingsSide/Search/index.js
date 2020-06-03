import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'
import { FormControlInput } from '../../../../../Form'

const styles = () => ({
  searchContainer: {
    width: '100%',
    padding: '7px 12px'
  },
  formControlRootClass: {
    height: '32px',
    lineHeight: '14px',
    fontSize: '14px',
    letterSpacing: '-0.03px',
    marginBottom: '0'
  },
  formControlInputRootClass: {
    height: '100%'
  },
  formControlInputClass: {
    height: '100%',
    padding: '0 22px',
    lineHeight: '100%',
    borderRadius: '100px',
    boxShadow: 'inset 0 1px 3px 0 rgba(136, 151, 172, 0.57)',
    border: 'solid 1px rgba(136, 151, 172, 0.05)'
  }
})

const Search = ({ classes, t }) => {
  return (
    <Grid item className={classes.searchContainer}>
      <FormControlInput
        placeholder={t('Search Action')}
        formControlRootClass={classes.formControlRootClass}
        formControlInputRootClass={classes.formControlInputRootClass}
        formControlInputClass={classes.formControlInputClass}
      />
    </Grid>
  )
}

Search.propTypes = {
  classes: PropTypes.object.isRequired
}

export default translate('translations')(withStyles(styles)(Search))
