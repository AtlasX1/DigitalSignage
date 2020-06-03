import React, { Fragment, useState } from 'react'
import { translate } from 'react-i18next'

import { withStyles, Grid } from '@material-ui/core'

import DataTables from './DataTables'
import Filters from './Filters'
import Info from './Info'
import ExportAsButton from './ExortAsButton'

import PageContainer from '../../PageContainer'
import { WhiteButton } from '../../Buttons'

const styles = {
  actionButton: {
    marginRight: 8,

    '&:last-child': {
      marginRight: 12
    },

    '&:hover': {
      color: '#fff'
    }
  },
  subHeaderRightActionComponent: {
    alignItems: 'center'
  },
  buttonIcon: {
    marginRight: 5,

    '&:hover': {
      color: '#fff'
    }
  },
  container: {
    width: '100%',
    // height: '90vh',
    height: 915,
    minHeight: 915
  }
}

const CreateReport = ({ t, classes }) => {
  const [filters, setFilters] = useState(true)
  return (
    <PageContainer
      pageTitle={t('Create Report')}
      ActionButtonsComponent={
        <Fragment>
          <WhiteButton className={`hvr-radial-out ${classes.actionButton}`}>
            {t('Save Report')}
          </WhiteButton>

          <WhiteButton className={`hvr-radial-out ${classes.actionButton}`}>
            {t('Save as Template')}
          </WhiteButton>
        </Fragment>
      }
      SubHeaderRightActionComponent={
        <Fragment>
          <WhiteButton className={`hvr-radial-out ${classes.actionButton}`}>
            {t('Run')}
          </WhiteButton>

          <ExportAsButton />
        </Fragment>
      }
      subHeaderRightActionComponentClassName={
        classes.subHeaderRightActionComponent
      }
      circleIconClickHandler={() => setFilters(!filters)}
      circleIconTitle={`${filters ? 'Hide' : 'Show'} filters`}
    >
      <Grid container className={classes.container}>
        <DataTables />

        {filters && <Filters />}

        <Info big={!filters} />
      </Grid>
    </PageContainer>
  )
}

export default translate('translations')(withStyles(styles)(CreateReport))
