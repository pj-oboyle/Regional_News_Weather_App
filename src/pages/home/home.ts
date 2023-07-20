import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { LocationProvider } from '../../providers/location/location';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    
    // Block of variables to display weather html elements.
    station: string;
    temperature: string;
    symbol: string;
    forecast: string;
    forecastIcon: string;
    windDir: string;
    
    
    // Block of variables to display country html elements.
    capital: string;
    country: string;
    code: string;
    flag: string;
    lat: string;
    lon: string;

    /*
    * Block of variables used for the hidden attribute in HTML code, 
    * used to display relevant elements depending on available data.
    */
    hideWeather = true;       // Weather Information  
    hideLocation = true;      // Country Information
    hideNews= true;           // News Information
    noWeather= true;          // No Weather message 
    noLocation = false;       // No Country message 
    noNews = true;            // No News message 

    spinner = true;           // Used to hide the loading spinner icon

    
    // Object used to store all the data from the weather http request.
    weatherInfo = {
      station: "",
      temperature: "",
      forecast: "",
      icon: "",
      windDir: ""
    };
    
    
    // Object used to store all the data from the location http request.
    weatherSettings = {
      capital: null,
      country: null,
      flag: null,
      latitude: null,
      longitude: null,
      code: null               // Parameter for news data http request
    };

    
    // Array used to store all the data from the news items http request.    
    newsArray: string[];

    // Blocks of variables to store and dispaly the date/time html elements
    currentDate: string;
    currentTime: string;
    timeMode: boolean;         // True for local time, false for GMT time
    hideTime = false;          // Hide time html element
    timeZone: string;          // Displays html "Local" or "GMT" in time header element



  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    private storage: Storage,
    private location: LocationProvider) {
  }

  /*
  * These functions load data from storage for country, weather
  * and temeprature units before page becomes active.
  */
  ionViewWillEnter() {
    this.getLocation();
    this.getWeather();
    this.displayUnits();
    this.loadingSpinner();
  }

  /*
  * This function calculates the current time depending on the time mode setting 
  * after the page has become active.
  */
  ionViewDidEnter() {
    this.checkTimeMode()
  }

  /*
  * Function hides the weather & news elements and displays a loading an animated
  * loading spinner while the inforamtion is reloaded after a 1 second time delay.
  */
  loadingSpinner() {
    // Display loading spinner 
    this.spinner = false;
    // Hide all the news/weather/time elements
    this.noWeather= true;
    this.noNews = true;
    this.hideWeather = true;
    this.hideNews= true;
    this.hideTime= true;

    /* 
    * Three functions perform checks for valid/updated data,
    * hides elements if no data avalable
    */
    setTimeout(() => {
      this.checkLocation();     // Function checks if valid country
      this.checkWeather();      // Function checks valid weather data
      this.assignNewsArray();   // Function updates news itemns
      this.spinner = true;      // Hide the spinner element
      this.hideTime= false;     // Display the time/date html elements
    }, 1000);                   // 1 second delay
  }

  /*
  * Function for navigation to the settings page used with
  * settings button in navigation bar.
  */
  openSettings() {
    this.navCtrl.push(SettingsPage);
  }

  /*
  * Function retrives location data stored in storage and assigns
  * it to variables used for property binding.
  */
  getLocation() {
    this.storage.get("Settings")
    .then((val) => {
      this.weatherSettings = val;
      this.country = this.weatherSettings.country;
      this.code = this.weatherSettings.code;
      this.flag = this.weatherSettings.flag;
      this.lat = this.weatherSettings.latitude;
      this.lon = this.weatherSettings.longitude;
      this.capital = this.weatherSettings.capital;
    })
    .catch((error) => {
      console.log("No location data saved in storage");
    })
  }
  
  /*
  * Function retrives weather data stored in storage and assigns
  * it to variables used for property binding.
  */
  getWeather() {
    this.storage.get("Weather")
    .then((val) => {
      this.weatherInfo = val;
      this.temperature = this.weatherInfo.temperature;
      this.forecast = this.weatherInfo.forecast;
      this.forecastIcon = this.weatherInfo.icon;
      this.windDir = this.weatherInfo.windDir;
      this.station = this.weatherInfo.station;
    })
    .catch((error) => {
      console.log("No weather data saved in storage");
    })
  }

  /*
  * Function checks the temperature symbol saved in storage and saves it
  * it to a variable for html display.
  */
  displayUnits() { 
    this.storage.get("Temperature")
    .then((val) => {
      if (val == null) {
        this.symbol =  "°C";          // Sets unit symbol to default
      } else {
        this.symbol = val.symbol;     // Sets symbol to saved setting
      }  
    })
  }

  /*
  * Function checks if there is data stored in the weather settings object
  * if no data is present then the country html elements are hidden and
  * a no country selected element is displayed.
  */
  checkLocation() {
    if (this.weatherSettings == null) {
      this.hideLocation = true;
      this.noLocation = false;
    } else {
      this.hideLocation = false;
      this.noLocation = true;
      }
    }

  /*
  * Function checks if there is data stored in the weather forecast object,
  * if no data is present then the weather html elements are hidden and
  * a no weather available element is displayed.
  */
  checkWeather() {  
    if (this.weatherInfo == null) {
      this.noWeather = false;
      this.hideWeather = true;
    } else {
      this.hideWeather = false;
      this.noWeather = true;
    }   
  }

  /*
  * Function checks if data stored in the weather settings object if there
  * is a valid country code present then a new request for news data news 
  * is sent to news server and news html elements are displayed. If no valid
  * country code is available then news items elements are not displayed.
  */
  assignNewsArray() {
    // Important! Reset the news array so array is empty if there is no news items after an update.
    this.newsArray = null;
    // Check if valid location stored
    if (this.weatherSettings != null) {
      this.location.requestNews(this.weatherSettings.code).subscribe(res => {
        // If totalResults < 1 then the server request has returned no news items
        if (res.totalResults < 1) {
          console.log("No News Results: " + res.totalResults)
          this.noNews = false;
        } else {
          this.newsArray = res.articles;
          console.log("News Items: " )
          console.log(this.newsArray);
        }
      });
      this.hideNews = false;
      this.noNews = true;
    } else {
      this.noNews = false;
    }
  }

  /*
  * Function checks the current time mode setting saved in storage, if local time
  * is on then the current local time is displayed, if it is off thenthe assignTime()
  * function displays the time of the currently selected country saved in storage.
  */
  checkTimeMode() {
    this.storage.get("LocalTime")
    .then((val) => {
      if(!val || val == null) {
        var dateTime = new Date();
        this.currentDate = dateTime.toLocaleDateString();
        this.currentTime = dateTime.toLocaleTimeString();
        this.timeZone = "GMT ";
      } else {
        this.assignTime();
        this.timeZone = "Local ";
      }  
    })
  }

  /*
  * Function checks if data stored in the weather settings object if there is a valid country
  * coordinates present then a http request for the current date time is sent to a time server. 
  * Console log messages display if an error in retrieving time/date.
  */
  assignTime() { 
    // Check if valid location stored
    if (this.weatherSettings != null) {
      this.location.requestTime(this.weatherSettings.latitude, this.weatherSettings.longitude).subscribe(res => {    
        if (res.status == "OK") {
          var dateTime = res.formatted.split(' ');    // Separate the time & date
          this.currentDate = dateTime[0];
          this.currentTime = dateTime[1];
          console.log("Time: " + res.formatted + "Status: " + res.status); 
        } else {
          console.log("Error no Time: " + res.formatted + " Status: " + res.status);
        }
      })
    } else {
      console.log("No location set to assign time");
    }
  }  

}
