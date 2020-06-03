import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { withStyles, Grid } from '@material-ui/core'

import { WhiteButton, BlueButton } from '../../../Buttons'
import { FormControlInput } from '../../../Form'

const styles = theme => ({
  root: {
    padding: '25px 17px'
  },
  searchAction: {
    width: '90%'
  },
  searchActionText: {
    fontSize: '14px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '300',
    transform: 'translate(0, 1.5px)'
  }
})

class TagsSearchForm extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    query: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const { classes, t, query, onChange, onSearch, onReset, close } = this.props

    return (
      <form className={classes.root}>
        <FormControlInput
          id="tag-name"
          fullWidth={true}
          label={t('Tag search name')}
          formControlLabelClass={classes.label}
          value={query}
          handleChange={onChange}
        />

        <Grid container>
          <Grid item xs={6}>
            <BlueButton
              className={classes.searchAction}
              onClick={() => {
                onSearch()
                close()
              }}
            >
              {t('Search Action')}
            </BlueButton>
          </Grid>
          <Grid item xs={6}>
            <WhiteButton className={classes.searchAction} onClick={onReset}>
              {t('Search Reset Action')}
            </WhiteButton>
          </Grid>
        </Grid>
      </form>
    )
  }
}

export default translate('translations')(withStyles(styles)(TagsSearchForm))
