import React from 'react'
import PropTypes from 'prop-types'
import { Grid, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { ColoredTagChip } from '../../Chip'
import { Card } from '../../Card'
import { ClientSettingsTagsLoader } from '../../Loaders'

const styles = () => ({
  card: {
    background: 'transparent'
  },
  tagsLoaderContainer: {
    minHeight: 30
  }
})

const TagsDetails = ({ t, classes, tags, loading }) => {
  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      title={t('Tags').toUpperCase()}
      rootClassName={classes.card}
    >
      {loading ? (
        <Grid className={classes.tagsLoaderContainer}>
          <ClientSettingsTagsLoader />
        </Grid>
      ) : (
        <Grid container>
          {tags &&
            tags.map((tag, index) => (
              <Grid key={`tag-${index}`} item>
                <ColoredTagChip color={tag.color} label={tag.label} />
              </Grid>
            ))}
        </Grid>
      )}
    </Card>
  )
}

TagsDetails.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate('translations')(withStyles(styles)(TagsDetails))
