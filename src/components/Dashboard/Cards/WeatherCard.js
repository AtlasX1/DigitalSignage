import { Grid, Typography, withStyles } from '@material-ui/core'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { weather } from '../../../utils'
import { Card } from '../../Card'

const styles = theme => {
  const { palette, type } = theme
  return {
    cardWrapper: {
      width: 330,
      marginBottom: '20px',
      fontFamily: theme.typography.fontFamily
    },
    cardBorder: {
      borderWidth: 2,
      borderStyle: 'solid'
    },
    weatherContainer: {
      display: 'grid',
      gap: '8px'
    },
    location: {
      color: palette[type].weatherCard.color,
      fontSize: '16px',
      fontWeight: 'bold'
    },
    date: {
      color: palette[type].weatherCard.color,
      fontSize: '12px'
    },
    condition: {
      color: palette[type].weatherCard.color,
      fontSize: '12px'
    },
    bottomContainer: {
      maxHeight: '72px'
    },
    icon: {
      height: '72px',
      width: '72px',
      paddingRight: '8px',
      alignSelf: 'baseline'
    },
    toggleContainer: {
      display: 'flex',
      alignSelf: 'flex-start',
      cursor: 'pointer'
    },
    temperatureValue: {
      color: palette[type].weatherCard.tempColor,
      fontSize: '64px',
      lineHeight: '82px',
      paddingRight: '8px'
    },
    scaleToggle: {
      color: palette[type].weatherCard.tempColor,
      alignSelf: 'flex-start',
      fontSize: '18px',
      padding: ' 0 2px'
    },
    active: {
      color: '#0378ba'
    }
  }
}

const WeatherCard = ({
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({})
  const [isCelcius, toggleScale] = useState(false)

  useEffect(() => {
    if (info.response && info.response.weather) {
      weather
        .getWeatherData(info.response.weather.lat, info.response.weather.long)
        .then(weatherData => {
          setData({ ...weatherData, ...info.response.weather })
        })
    }
  }, [info])

  const Icon = ({ code }) => {
    const Component = weather.getIcon(code)
    return <Component className={classes.icon} />
  }

  return (
    <Grid item className={classes.cardWrapper}>
      <Card
        rootClassName={[hoverClassName, dragging ? draggingClassName : ''].join(
          ' '
        )}
      >
        <Grid container className={classes.weatherContainer}>
          <Grid item>
            <Typography className={classes.location}>{data.city}</Typography>
            <Typography className={classes.date}>{data.date}</Typography>
            <Typography className={classes.condition}>
              {data.condition}
            </Typography>
          </Grid>
          <Grid
            item
            container
            className={classes.bottomContainer}
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            {data.weatherCode && <Icon code={data.weatherCode} />}

            <Typography className={classes.temperatureValue}>
              {isCelcius ? data.tempCelcius : data.tempFahrenheit}
            </Typography>
            <Grid
              item
              onClick={() => toggleScale(!isCelcius)}
              className={classes.toggleContainer}
            >
              <Typography
                component="sup"
                className={`${isCelcius === true && classes.active} ${
                  classes.scaleToggle
                }`}
              >
                &deg;C
              </Typography>
              <Typography component="sup" className={classes.scaleToggle}>
                {' | '}
              </Typography>
              <Typography
                component="sup"
                className={`${isCelcius === false && classes.active} ${
                  classes.scaleToggle
                }`}
              >
                &deg;F
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  )
}

WeatherCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default withStyles(styles)(connect(mapStateToProps, null)(WeatherCard))
