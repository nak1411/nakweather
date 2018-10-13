export default class Data {
  constructor(city) {
    this.city = city;
    this.timeZone = this.processTimeZone();
    this.weather = this.processWeather();
  }

  processTimeZone() {
    this.coordApi = `https://maps.googleapis.com/maps/api/geocode/json?address=${this.city}&key=AIzaSyA-ubVfuopZoF-X1keb4nVtY8NCDyAzNn4`;
    return this.coordData(this.coordApi).
    then(coord => {
      this.timezoneApi = `https://maps.googleapis.com/maps/api/timezone/json?location=${coord.lat},${coord.lng}&timestamp=1458000000&key=AIzaSyA-ubVfuopZoF-X1keb4nVtY8NCDyAzNn4`;
      return this.timeZoneData(this.timezoneApi).
      then(tz => {
        return {
          timezone: tz.tz
        }
      })
    }).
    catch(err => console.error(err));
  }

  processWeather() {
    this.weatherApi = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&APPID=d438c6c016bcdcf60c6d2534559d8b07`;
    return this.weatherData(this.weatherApi).
    then(w => {
      return {
        temp: w.temp,
        maxTemp: w.maxTemp,
        minTemp: w.minTemp,
        humidity: w.humidity
      }
    }).
    catch(err => console.error(err));
  }

  /**
   * FETCH DATA FROM OPENWEATHER API
   */
  async weatherData(api) {
    this.response = await fetch(api);
    this.json = await this.response.json();
    this.temp = Math.floor(this.json.main.temp - 273.15);
    this.maxTemp = Math.floor(this.json.main.temp_max - 273.15);
    this.minTemp = Math.floor(this.json.main.temp_min - 273.15);
    this.humidity = this.json.main.humidity;
    console.log(this.json);
    return {
      temp: this.temp,
      maxTemp: this.maxTemp,
      minTemp: this.minTemp,
      humidity: this.humidity,
      temp: this.temp
    }
  }

  /**
   * FETCH DATA FROM TIMEZONE API
   */
  async timeZoneData(api) {
    this.response = await fetch(api);
    this.json = await this.response.json();
    this.tz = this.json.timeZoneName;
    console.log(this.json);
    return {
      tz: this.tz
    }
  }

  /**
   * FETCH DATA FROM GEOCODING API
   */
  async coordData(api) {
    this.response = await fetch(api);
    this.json = await this.response.json();
    this.lng = this.json.results[0].geometry.location.lng;
    this.lat = this.json.results[0].geometry.location.lat;
    //console.log(this.json);
    return {
      lng: this.lng,
      lat: this.lat
    }
  }
}