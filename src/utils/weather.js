import Axios from 'axios'
import moment from 'moment'
import * as config from '../../src/config'
import {
  BlizzardDayNight,
  BlowingSnowDay,
  BlowingSnowNight,
  ClearDay,
  ClearNight,
  CloudyDay,
  CloudyNight,
  FogMistDay,
  FogMistNight,
  HeavyRainDay,
  HeavyRainNight,
  IcePelletsDay,
  IcePelletsNight,
  LightRainDay,
  LightRainNight,
  LightSnowDay,
  LightSnowNight,
  ModerateHeavySleetDay,
  ModerateHeavySleetNight,
  ModerateHeavySnowDay,
  ModerateHeavySnowNight,
  ModerateRainDay,
  ModerateRainNight,
  OvercastDayNight,
  PartlyCloudyDay,
  PartlyCloudyNight,
  RainThunderDay,
  RainThunderNight,
  SnowShowersDay,
  SnowShowersNight,
  ThunderDay,
  ThunderNight,
  ThunderSnowDay,
  ThunderSnowNight
} from '../common/assets/weather/index'

const convertLocation = data => {
  let res = ''

  if (data.lat && data.long) {
    let lat = data.lat
    let long = data.long

    if (lat > 0) {
      res += lat.toString().slice(0, 5).replace('.', 'd')
    } else {
      res += 'n' + lat.toString().slice(1, 6).replace('.', 'd')
    }

    if (long > 0) {
      res += long.toString().slice(0, 5).replace('.', 'd')
    } else {
      res += 'n' + long.toString().slice(1, 6).replace('.', 'd')
    }
  } else {
    res = '40d71n74d01'
  }

  return res
}

const getIcon = code => {
  const isNight = moment().hour() >= 18
  if (code) {
    switch (code) {
      case 113:
      case 'clear-day':
      case 'clear-night':
        return isNight ? ClearNight : ClearDay

      case 116:
      case 'partly-cloudy-day':
      case 'partly-cloudy-night':
        return isNight ? PartlyCloudyNight : PartlyCloudyDay

      case 119:
      case 'cloudy':
        return isNight ? CloudyNight : CloudyDay

      case 122:
        return OvercastDayNight

      case 143:
      case 260:
      case 248:
      case 'fog':
        return isNight ? FogMistNight : FogMistDay
      case 296:
      case 353:
      case 311:
      case 293:
      case 176:
      case 266:
      case 263:
      case 281:
      case 284:
      case 185:
      case 182:
        return isNight ? LightRainNight : LightRainDay

      case 302:
      case 299:
      case 314:
      case 356:
        return isNight ? ModerateRainNight : ModerateRainDay

      case 200:
        return isNight ? ThunderNight : ThunderDay

      case 386:
      case 389:
        return isNight ? RainThunderNight : RainThunderDay

      case 308:
      case 305:
      case 359:
      case 'rain':
        return isNight ? HeavyRainNight : HeavyRainDay

      case 335:
      case 338:
      case 332:
      case 329:
      case 'snow':
        return isNight ? ModerateHeavySnowNight : ModerateHeavySnowDay

      case 227:
        return isNight ? BlowingSnowNight : BlowingSnowDay

      case 317:
      case 365:
      case 362:
      case 320:
      case 'sleet':
        return isNight ? ModerateHeavySleetNight : ModerateHeavySleetDay

      case 230:
      case 'wind':
        return BlizzardDayNight

      case 326:
      case 179:
      case 323:
      case 368:
        return isNight ? LightSnowNight : LightSnowDay

      case 371:
        return isNight ? SnowShowersNight : SnowShowersDay

      case 377:
      case 374:
      case 350:
        return isNight ? IcePelletsNight : IcePelletsDay

      case 395:
      case 392:
        return isNight ? ThunderSnowNight : ThunderSnowDay

      default:
        return getIcon(113)
    }
  }
}

const requestWeather = async (lat, lon) => {
  try {
    const data = await Axios.get(
      `https://api.worldweatheronline.com/premium/v1/weather.ashx?key=${config.WWO_KEY}&q=${lat},${lon}&format=json&num_of_days=1&mca=no`
    )
    const response = await data
    if (response && response.data) {
      const { current_condition = [] } = response.data.data
      if (current_condition.length > 0) {
        const {
          temp_C,
          temp_F,
          weatherCode,
          weatherDesc: [description]
        } = current_condition[0]

        const currentWeather = {
          date: `${new Date().toLocaleDateString('en-US', {
            weekday: 'long'
          })} ${moment().format('hh:mm A')}`,
          condition: description.value,
          weatherCode: parseInt(weatherCode),
          tempCelcius: temp_C,
          tempFahrenheit: temp_F
        }

        sessionStorage.setItem(
          'weather',
          JSON.stringify({
            ...currentWeather,
            timestamp: new Date().getTime()
          })
        )
        return currentWeather
      }
    }
  } catch (error) {
    const data = await Axios.get(
      `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${config.DARKSKY_KEY}/${lat},${lon}?exclude=minutely,hourly,daily,alerts,flags`
    )
    const response = await data
    if (response && response.data) {
      return {
        date: `${new Date().toLocaleDateString('en-US', {
          weekday: 'long'
        })} ${moment().format('hh:mm A')}`,
        condition: response.data.currently.summary,
        weatherCode: response.data.currently.icon,
        tempCelcius: Math.round(
          (response.data.currently.temperature - 32) * (5 / 9)
        ),
        tempFahrenheit: Math.round(response.data.currently.temperature)
      }
    } else {
      return null
    }
  }
}

const getWeatherData = (lat, lon) => {
  const weatherSession = sessionStorage.getItem('weather')
  if (weatherSession) {
    const timestamp = JSON.parse(weatherSession).timestamp
    return new Date().getTime() >= parseInt(timestamp) + 5 * 60 * 1000
      ? requestWeather(lat, lon)
      : Promise.resolve(JSON.parse(weatherSession))
  } else {
    return requestWeather(lat, lon)
  }
}

export default {
  convertLocation,
  getWeatherData,
  getIcon
}
