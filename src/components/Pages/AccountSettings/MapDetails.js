import React from 'react'
import PropTypes from 'prop-types'
import { Grid, withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import { Card } from '../../Card'
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs
} from 'react-google-maps'
import { ClientSettingsMapLoader } from '../../Loaders'

const styles = () => ({
  card: {
    background: 'transparent'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  mapWrapper: {
    position: 'relative',
    minHeight: '280px',
    margin: '-20px -32px -22px'
  },
  mapLoaderContainer: {
    minHeight: 280
  }
})

const Map = withScriptjs(
  withGoogleMap((coords = {}, isMarkerShown = false) => (
    <GoogleMap defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }}>
      {isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
    </GoogleMap>
  ))
)

const MapDetails = ({ t, classes, loading }) => {
  return (
    <Card
      icon={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      title={t('Locations').toUpperCase()}
      rootClassName={classes.card}
    >
      {loading ? (
        <Grid className={classes.mapLoaderContainer}>
          <ClientSettingsMapLoader />
        </Grid>
      ) : (
        <div className={classes.mapWrapper}>
          <Map
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div className={classes.map} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      )}
    </Card>
  )
}

MapDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate('translations')(withStyles(styles)(MapDetails))
