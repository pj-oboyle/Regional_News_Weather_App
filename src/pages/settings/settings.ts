import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Navbar, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LocationProvider } from '../../providers/location/location';

/**
 * Generated class for the SettingsPage page.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild(Navbar) navBar: Navbar;

  // Variables to display html elements on Settings page.
  tempUnit: string;         // Sets temperature unit html radio button
  currentCity: string;      // Displays currently selected location

  
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
    latitude: null,         // Parameter for weather data http request
    longitude: null,        // Parameter for weather data http request
    code: null
  };

  // Object used to store the temperature settings.
  temperature = {
    unit: "celsius",
    symbol: "°C",
    inputCode: "M"          // Parameter for weather data http request

  };

  timeMode = false;         // ngModel value for time mode toggle button
  


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    public storage: Storage,
    private location: LocationProvider) {
  }

  /*
  * Functions perform checks for previously stored data in storage.
  */
    ionViewWillEnter() {
      this.initialTempUnit();
      this.initialLocale();
      this.initialTime();
    }

  /*
  * Function checks that a location has been stored before leaving the Settings page
  * and displays a custom prompt if no location has been saved.
  */
  ionViewDidLoad() {
    this.validCityCheck();
  }

  /*
  * Method adds an additional event to the back button. If there is no value saved 
  * for location then an alert is generated using showConfirm() function.
  */
  validCityCheck() {
    this.navBar.backButtonClick = () => {    
      if (this.weatherSettings.capital == null) {
        this.showConfirm();
      } else {
        this.navCtrl.pop();
      }
    }
  }

  /*
  * Creates an alert box with a custom message that prompts the user if they wish to stay
  * on the current page or return to the Home page. Displayed when no location saved by user.
  */
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'No location saved',
      message: 'Return to Home Page without saving a city?',
      buttons: [
        {
          text: 'Go back',
          handler: () => {
            console.log('Disagree clicked');
            this.navCtrl.pop();
          }
        },
        {
          text: 'Stay on Page',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
  
  /*
  * Function for temperature setting's radio-buttons. It stores the appropriate 
  * temeprature settings to storage and updates the weather data based on user input.  
  */
  setTUnit(value:string) {
    this.temperature.unit = value;
    if (value == "kelvin") {
      this.temperature.symbol = "K"
      this.temperature.inputCode = "S";
    } else if (value == "fahrenheit") {
      this.temperature.symbol = "°F";
      this.temperature.inputCode = "I";
    } else {
      this.temperature.symbol = "°C";
      this.temperature.inputCode = "M";
    }
    this.storage.set("Temperature", this.temperature);
    this.storeWeather();         // Updates the weaather data using the new settings
  }

  /*
  * Save button function stores user's input location data to storage after requesting 
  * location data from internet location API.
  */
  storeLocation(cityName:string) {
    // Check if a blank entry is entered and return an alert box
    if (cityName == null || cityName == '') {
      this.nullALert(); 
    } else {
      this.location.requestLocation(cityName).subscribe(res => {
        this.weatherSettings.capital = res[0].capital[0];
        this.weatherSettings.country = res[0].name.common;
        this.weatherSettings.flag = res[0].flags.png;
        this.weatherSettings.latitude = res[0].latlng[0];
        this.weatherSettings.longitude = res[0].latlng[1];
        this.weatherSettings.code = res[0].cca2;
        this.storage.set("Settings", this.weatherSettings);
        this.initialTempUnit();
        this.storeWeather();
        this.currentCity = this.weatherSettings.capital;
      },
      (error) => {
        console.log("Error: " + error.status + " Message: " + error.message);
        this.errorAlert(error);
      }
      );
    }
  }

  /*
  * Function displays an alert box with a error message depending on the error status code.
  * Function is used in setLocale() function when the http resposne for a location returns an error.
  */
  errorAlert(error) {
    let message = "";

    if (error.status == "404") {
      message = "Input Error. Location does not exist";
    } else if (error.status == "503" || error.status == "504") {
      message = "Server Error";
    } else {
      message = "Connection Error. Unable to complete.";
    };

    let alert = this.alertCtrl.create({
      title: message,
      subTitle: 'Please Try Again',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  /*
  * Function displays an alert box with a error message when a blank entry is saved in the Loaction setting.
  * Used in the storeLocation() function when saving a location.
  */
  nullALert() {
    let alert = this.alertCtrl.create({
      title: 'Blank input!',
      subTitle: 'Please enter a city name',
      buttons: ['Dismiss']
    });
    alert.present();
  
  }

  /*
  * If there is a valid location saved in stoarge this function requests weather data from 
  * an internet weather API resource and saves it to the weatherInfo object.
  */
  storeWeather() { 
    if (this.weatherSettings.capital != null) {
      this.location.requestWeather(this.temperature.inputCode, this.weatherSettings.latitude, this.weatherSettings.longitude).subscribe(res => {
        this.weatherInfo.temperature = res.data[0].temp;
        this.weatherInfo.forecast = res.data[0].weather.description;
        this.weatherInfo.icon = "https://www.weatherbit.io/static/img/icons/" + res.data[0].weather.icon + ".png";
        this.weatherInfo.windDir = res.data[0].wind_cdir_full;
        this.weatherInfo.station = res.data[0].city_name;
        this.storage.set("Weather", this.weatherInfo);
      });
    }
  }

  /*
   * Function checks for temeprature settings stored in storage and if present assigns them
  * to current settings. If there is no saved data the default value is set of "celsius".
  */
  initialTempUnit() {
    this.storage.get('Temperature').then((val) => {
      if (val == null) {
        this.tempUnit = "celsius";
        console.log("Temp set to default");
      } else {
        this.tempUnit = val.unit;                   // Update the html radio button value.
        this.temperature.inputCode = val.inputCode; // Important! Update the parameter for requesting weather data.
        console.log("Temp set to " + val.unit);
      }
    })
    .catch((error) => {
      alert("Error Accessing Storage");
    })
  }
  
  /*
  * Function checks storage for stored location data and assigns it to the weatherSettings
  * object and updates the current location html element on the Settings page. If no save
  * data is preset then the current loctaion is set to "none".
  */
  initialLocale() {
    this.storage.ready().then(() => {
      this.storage.get("Settings").then((val) => {
        if (val == null) {
          this.currentCity = "None";
          console.log("No location data saved in storage");
        } else {
          this.weatherSettings = val;
          this.currentCity = this.weatherSettings.capital;
        }
      })
      .catch((error) => {
        alert("Error Accessing Storage")
      })    
    }) 
  }

  /*
  * Function deletes all user settings in storage, resetting the application.
  */
  emptyStorage() {
    const confirm = this.alertCtrl.create({
      title: 'Delete Saved Settings',
      message: 'Would you like to delete all saved settings?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Proceed',
          handler: () => {
            console.log('Settings deleted');
            this.storage.clear();
            this.currentCity = "None";
          }
        }
      ]
    });
    confirm.present(); 
  }

  /*
  * Function stores the time mode setting to storage.
  */
  setTimeMode() {
      this.storage.set("LocalTime", this.timeMode);  
  }

  /*
  * Function checks storage for stored location data and assigns it to the weatherSettings
  * object and updates the current location html element on the Settings page. If no save
  * data is preset then the current loctaion is set to "none".
  */
   initialTime() {
    this.storage.ready().then(() => {
      this.storage.get("LocalTime").then((val) => {
        if (val != null) {
          this.timeMode = val;
        }
      })
      .catch((error) => {
        alert("Error Accessing Storage")
      })    
    }) 
  }

}
