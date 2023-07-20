webpackJsonp([1],{

/***/ 102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_location_location__ = __webpack_require__(79);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the SettingsPage page.
 */
var SettingsPage = /** @class */ (function () {
    function SettingsPage(navCtrl, navParams, alertCtrl, storage, location) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.location = location;
        // Object used to store all the data from the weather http request.
        this.weatherInfo = {
            station: "",
            temperature: "",
            forecast: "",
            icon: "",
            windDir: ""
        };
        // Object used to store all the data from the location http request.
        this.weatherSettings = {
            capital: null,
            country: null,
            flag: null,
            latitude: null,
            longitude: null,
            code: null
        };
        // Object used to store the temperature settings.
        this.temperature = {
            unit: "celsius",
            symbol: "°C",
            inputCode: "M" // Parameter for weather data http request
        };
        this.timeMode = false; // ngModel value for time mode toggle button
    }
    /*
    * Functions perform checks for previously stored data in storage.
    */
    SettingsPage.prototype.ionViewWillEnter = function () {
        this.initialTempUnit();
        this.initialLocale();
        this.initialTime();
    };
    /*
    * Function checks that a location has been stored before leaving the Settings page
    * and displays a custom prompt if no location has been saved.
    */
    SettingsPage.prototype.ionViewDidLoad = function () {
        this.validCityCheck();
    };
    /*
    * Method adds an additional event to the back button. If there is no value saved
    * for location then an alert is generated using showConfirm() function.
    */
    SettingsPage.prototype.validCityCheck = function () {
        var _this = this;
        this.navBar.backButtonClick = function () {
            if (_this.weatherSettings.capital == null) {
                _this.showConfirm();
            }
            else {
                _this.navCtrl.pop();
            }
        };
    };
    /*
    * Creates an alert box with a custom message that prompts the user if they wish to stay
    * on the current page or return to the Home page. Displayed when no location saved by user.
    */
    SettingsPage.prototype.showConfirm = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'No location saved',
            message: 'Return to Home Page without saving a city?',
            buttons: [
                {
                    text: 'Go back',
                    handler: function () {
                        console.log('Disagree clicked');
                        _this.navCtrl.pop();
                    }
                },
                {
                    text: 'Stay on Page',
                    handler: function () {
                        console.log('Agree clicked');
                    }
                }
            ]
        });
        confirm.present();
    };
    /*
    * Function for temperature setting's radio-buttons. It stores the appropriate
    * temeprature settings to storage and updates the weather data based on user input.
    */
    SettingsPage.prototype.setTUnit = function (value) {
        this.temperature.unit = value;
        if (value == "kelvin") {
            this.temperature.symbol = "K";
            this.temperature.inputCode = "S";
        }
        else if (value == "fahrenheit") {
            this.temperature.symbol = "°F";
            this.temperature.inputCode = "I";
        }
        else {
            this.temperature.symbol = "°C";
            this.temperature.inputCode = "M";
        }
        this.storage.set("Temperature", this.temperature);
        this.storeWeather(); // Updates the weaather data using the new settings
    };
    /*
    * Save button function stores user's input location data to storage after requesting
    * location data from internet location API.
    */
    SettingsPage.prototype.storeLocation = function (cityName) {
        var _this = this;
        // Check if a blank entry is entered and return an alert box
        if (cityName == null || cityName == '') {
            this.nullALert();
        }
        else {
            this.location.requestLocation(cityName).subscribe(function (res) {
                _this.weatherSettings.capital = res[0].capital[0];
                _this.weatherSettings.country = res[0].name.common;
                _this.weatherSettings.flag = res[0].flags.png;
                _this.weatherSettings.latitude = res[0].latlng[0];
                _this.weatherSettings.longitude = res[0].latlng[1];
                _this.weatherSettings.code = res[0].cca2;
                _this.storage.set("Settings", _this.weatherSettings);
                _this.initialTempUnit();
                _this.storeWeather();
                _this.currentCity = _this.weatherSettings.capital;
            }, function (error) {
                console.log("Error: " + error.status + " Message: " + error.message);
                _this.errorAlert(error);
            });
        }
    };
    /*
    * Function displays an alert box with a error message depending on the error status code.
    * Function is used in setLocale() function when the http resposne for a location returns an error.
    */
    SettingsPage.prototype.errorAlert = function (error) {
        var message = "";
        if (error.status == "404") {
            message = "Input Error. Location does not exist";
        }
        else if (error.status == "503" || error.status == "504") {
            message = "Server Error";
        }
        else {
            message = "Connection Error. Unable to complete.";
        }
        ;
        var alert = this.alertCtrl.create({
            title: message,
            subTitle: 'Please Try Again',
            buttons: ['Dismiss']
        });
        alert.present();
    };
    /*
    * Function displays an alert box with a error message when a blank entry is saved in the Loaction setting.
    * Used in the storeLocation() function when saving a location.
    */
    SettingsPage.prototype.nullALert = function () {
        var alert = this.alertCtrl.create({
            title: 'Blank input!',
            subTitle: 'Please enter a city name',
            buttons: ['Dismiss']
        });
        alert.present();
    };
    /*
    * If there is a valid location saved in stoarge this function requests weather data from
    * an internet weather API resource and saves it to the weatherInfo object.
    */
    SettingsPage.prototype.storeWeather = function () {
        var _this = this;
        if (this.weatherSettings.capital != null) {
            this.location.requestWeather(this.temperature.inputCode, this.weatherSettings.latitude, this.weatherSettings.longitude).subscribe(function (res) {
                _this.weatherInfo.temperature = res.data[0].temp;
                _this.weatherInfo.forecast = res.data[0].weather.description;
                _this.weatherInfo.icon = "https://www.weatherbit.io/static/img/icons/" + res.data[0].weather.icon + ".png";
                _this.weatherInfo.windDir = res.data[0].wind_cdir_full;
                _this.weatherInfo.station = res.data[0].city_name;
                _this.storage.set("Weather", _this.weatherInfo);
            });
        }
    };
    /*
     * Function checks for temeprature settings stored in storage and if present assigns them
    * to current settings. If there is no saved data the default value is set of "celsius".
    */
    SettingsPage.prototype.initialTempUnit = function () {
        var _this = this;
        this.storage.get('Temperature').then(function (val) {
            if (val == null) {
                _this.tempUnit = "celsius";
                console.log("Temp set to default");
            }
            else {
                _this.tempUnit = val.unit; // Update the html radio button value.
                _this.temperature.inputCode = val.inputCode; // Important! Update the parameter for requesting weather data.
                console.log("Temp set to " + val.unit);
            }
        })
            .catch(function (error) {
            alert("Error Accessing Storage");
        });
    };
    /*
    * Function checks storage for stored location data and assigns it to the weatherSettings
    * object and updates the current location html element on the Settings page. If no save
    * data is preset then the current loctaion is set to "none".
    */
    SettingsPage.prototype.initialLocale = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.storage.get("Settings").then(function (val) {
                if (val == null) {
                    _this.currentCity = "None";
                    console.log("No location data saved in storage");
                }
                else {
                    _this.weatherSettings = val;
                    _this.currentCity = _this.weatherSettings.capital;
                }
            })
                .catch(function (error) {
                alert("Error Accessing Storage");
            });
        });
    };
    /*
    * Function deletes all user settings in storage, resetting the application.
    */
    SettingsPage.prototype.emptyStorage = function () {
        var _this = this;
        var confirm = this.alertCtrl.create({
            title: 'Delete Saved Settings',
            message: 'Would you like to delete all saved settings?',
            buttons: [
                {
                    text: 'Cancel',
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Proceed',
                    handler: function () {
                        console.log('Settings deleted');
                        _this.storage.clear();
                        _this.currentCity = "None";
                    }
                }
            ]
        });
        confirm.present();
    };
    /*
    * Function stores the time mode setting to storage.
    */
    SettingsPage.prototype.setTimeMode = function () {
        this.storage.set("LocalTime", this.timeMode);
    };
    /*
    * Function checks storage for stored location data and assigns it to the weatherSettings
    * object and updates the current location html element on the Settings page. If no save
    * data is preset then the current loctaion is set to "none".
    */
    SettingsPage.prototype.initialTime = function () {
        var _this = this;
        this.storage.ready().then(function () {
            _this.storage.get("LocalTime").then(function (val) {
                if (val != null) {
                    _this.timeMode = val;
                }
            })
                .catch(function (error) {
                alert("Error Accessing Storage");
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Navbar */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Navbar */])
    ], SettingsPage.prototype, "navBar", void 0);
    SettingsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-settings',template:/*ion-inline-start:"F:\Storage\Documents\HDip Software Development\Mobile Application Development\Final Submission\G00398242\src\pages\settings\settings.html"*/'<!--\n  Generated template for the SettingsPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar>\n    <ion-title>Settings</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h1>Location Settings</h1>\n  <h4>Current City: {{ currentCity }}</h4>\n  <!-- Location Input Section -->\n  <ion-list>\n    <ion-list-header>\n      Enter Location and Click Save\n    </ion-list-header>\n      <input [(ngModel)]= "newLocation">\n      <button ion-button (click)="storeLocation(newLocation)">Save</button>\n  </ion-list>\n  \n  <h1>Temperature Settings</h1>\n  <!-- Temperature Radio Buttons -->\n  <ion-list radio-group [(ngModel)]= "tempUnit">\n    <ion-list-header>\n      Select Units\n    </ion-list-header>\n    <ion-item>\n      <ion-label>Celsius</ion-label>\n      <ion-radio (ionSelect)="setTUnit(\'celsius\')" value="celsius" [checked]=\'celsius\'></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>Fahrenheit</ion-label>\n      <ion-radio (ionSelect)="setTUnit(\'fahrenheit\')" value="fahrenheit"></ion-radio>\n    </ion-item>\n    <ion-item>\n      <ion-label>Kelvin</ion-label>\n      <ion-radio (ionSelect)="setTUnit(\'kelvin\')" value="kelvin"></ion-radio>\n    </ion-item>\n  </ion-list>\n  \n  <h1>Time Settings</h1>\n  <ion-list>\n    <ion-list-header>\n      Display Local Time \n    </ion-list-header>\n    <ion-item>\n      <!-- Time Mode Toggle Button-->\n      <ion-label>Toggle On/Off</ion-label>\n      <ion-toggle (ionChange)="setTimeMode()" [(ngModel)]="timeMode"></ion-toggle>\n    </ion-item>\n  </ion-list>\n  \n  <h1>Delete Settings</h1>\n    <!-- Delete Settings Button -->\n    <button ion-button (click)="emptyStorage()" color="danger">Delete</button>\n</ion-content>\n'/*ion-inline-end:"F:\Storage\Documents\HDip Software Development\Mobile Application Development\Final Submission\G00398242\src\pages\settings\settings.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__providers_location_location__["a" /* LocationProvider */]])
    ], SettingsPage);
    return SettingsPage;
}());

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 113:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 113;

/***/ }),

/***/ 155:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/settings/settings.module": [
		279,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 155;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings_settings__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_location_location__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(78);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HomePage = /** @class */ (function () {
    function HomePage(navCtrl, alertCtrl, storage, location) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.storage = storage;
        this.location = location;
        /*
        * Block of variables used for the hidden attribute in HTML code,
        * used to display relevant elements depending on available data.
        */
        this.hideWeather = true; // Weather Information  
        this.hideLocation = true; // Country Information
        this.hideNews = true; // News Information
        this.noWeather = true; // No Weather message 
        this.noLocation = false; // No Country message 
        this.noNews = true; // No News message 
        this.spinner = true; // Used to hide the loading spinner icon
        // Object used to store all the data from the weather http request.
        this.weatherInfo = {
            station: "",
            temperature: "",
            forecast: "",
            icon: "",
            windDir: ""
        };
        // Object used to store all the data from the location http request.
        this.weatherSettings = {
            capital: null,
            country: null,
            flag: null,
            latitude: null,
            longitude: null,
            code: null // Parameter for news data http request
        };
        this.hideTime = false; // Hide time html element
    }
    /*
    * These functions load data from storage for country, weather
    * and temeprature units before page becomes active.
    */
    HomePage.prototype.ionViewWillEnter = function () {
        this.getLocation();
        this.getWeather();
        this.displayUnits();
        this.loadingSpinner();
    };
    /*
    * This function calculates the current time depending on the time mode setting
    * after the page has become active.
    */
    HomePage.prototype.ionViewDidEnter = function () {
        this.checkTimeMode();
    };
    /*
    * Function hides the weather & news elements and displays a loading an animated
    * loading spinner while the inforamtion is reloaded after a 1 second time delay.
    */
    HomePage.prototype.loadingSpinner = function () {
        var _this = this;
        // Display loading spinner 
        this.spinner = false;
        // Hide all the news/weather/time elements
        this.noWeather = true;
        this.noNews = true;
        this.hideWeather = true;
        this.hideNews = true;
        this.hideTime = true;
        /*
        * Three functions perform checks for valid/updated data,
        * hides elements if no data avalable
        */
        setTimeout(function () {
            _this.checkLocation(); // Function checks if valid country
            _this.checkWeather(); // Function checks valid weather data
            _this.assignNewsArray(); // Function updates news itemns
            _this.spinner = true; // Hide the spinner element
            _this.hideTime = false; // Display the time/date html elements
        }, 1000); // 1 second delay
    };
    /*
    * Function for navigation to the settings page used with
    * settings button in navigation bar.
    */
    HomePage.prototype.openSettings = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__settings_settings__["a" /* SettingsPage */]);
    };
    /*
    * Function retrives location data stored in storage and assigns
    * it to variables used for property binding.
    */
    HomePage.prototype.getLocation = function () {
        var _this = this;
        this.storage.get("Settings")
            .then(function (val) {
            _this.weatherSettings = val;
            _this.country = _this.weatherSettings.country;
            _this.code = _this.weatherSettings.code;
            _this.flag = _this.weatherSettings.flag;
            _this.lat = _this.weatherSettings.latitude;
            _this.lon = _this.weatherSettings.longitude;
            _this.capital = _this.weatherSettings.capital;
        })
            .catch(function (error) {
            console.log("No location data saved in storage");
        });
    };
    /*
    * Function retrives weather data stored in storage and assigns
    * it to variables used for property binding.
    */
    HomePage.prototype.getWeather = function () {
        var _this = this;
        this.storage.get("Weather")
            .then(function (val) {
            _this.weatherInfo = val;
            _this.temperature = _this.weatherInfo.temperature;
            _this.forecast = _this.weatherInfo.forecast;
            _this.forecastIcon = _this.weatherInfo.icon;
            _this.windDir = _this.weatherInfo.windDir;
            _this.station = _this.weatherInfo.station;
        })
            .catch(function (error) {
            console.log("No weather data saved in storage");
        });
    };
    /*
    * Function checks the temperature symbol saved in storage and saves it
    * it to a variable for html display.
    */
    HomePage.prototype.displayUnits = function () {
        var _this = this;
        this.storage.get("Temperature")
            .then(function (val) {
            if (val == null) {
                _this.symbol = "°C"; // Sets unit symbol to default
            }
            else {
                _this.symbol = val.symbol; // Sets symbol to saved setting
            }
        });
    };
    /*
    * Function checks if there is data stored in the weather settings object
    * if no data is present then the country html elements are hidden and
    * a no country selected element is displayed.
    */
    HomePage.prototype.checkLocation = function () {
        if (this.weatherSettings == null) {
            this.hideLocation = true;
            this.noLocation = false;
        }
        else {
            this.hideLocation = false;
            this.noLocation = true;
        }
    };
    /*
    * Function checks if there is data stored in the weather forecast object,
    * if no data is present then the weather html elements are hidden and
    * a no weather available element is displayed.
    */
    HomePage.prototype.checkWeather = function () {
        if (this.weatherInfo == null) {
            this.noWeather = false;
            this.hideWeather = true;
        }
        else {
            this.hideWeather = false;
            this.noWeather = true;
        }
    };
    /*
    * Function checks if data stored in the weather settings object if there
    * is a valid country code present then a new request for news data news
    * is sent to news server and news html elements are displayed. If no valid
    * country code is available then news items elements are not displayed.
    */
    HomePage.prototype.assignNewsArray = function () {
        var _this = this;
        // Important! Reset the news array so array is empty if there is no news items after an update.
        this.newsArray = null;
        // Check if valid location stored
        if (this.weatherSettings != null) {
            this.location.requestNews(this.weatherSettings.code).subscribe(function (res) {
                // If totalResults < 1 then the server request has returned no news items
                if (res.totalResults < 1) {
                    console.log("No News Results: " + res.totalResults);
                    _this.noNews = false;
                }
                else {
                    _this.newsArray = res.articles;
                    console.log("News Items: ");
                    console.log(_this.newsArray);
                }
            });
            this.hideNews = false;
            this.noNews = true;
        }
        else {
            this.noNews = false;
        }
    };
    /*
    * Function checks the current time mode setting saved in storage, if local time
    * is on then the current local time is displayed, if it is off thenthe assignTime()
    * function displays the time of the currently selected country saved in storage.
    */
    HomePage.prototype.checkTimeMode = function () {
        var _this = this;
        this.storage.get("LocalTime")
            .then(function (val) {
            if (!val || val == null) {
                var dateTime = new Date();
                _this.currentDate = dateTime.toLocaleDateString();
                _this.currentTime = dateTime.toLocaleTimeString();
                _this.timeZone = "GMT ";
            }
            else {
                _this.assignTime();
                _this.timeZone = "Local ";
            }
        });
    };
    /*
    * Function checks if data stored in the weather settings object if there is a valid country
    * coordinates present then a http request for the current date time is sent to a time server.
    * Console log messages display if an error in retrieving time/date.
    */
    HomePage.prototype.assignTime = function () {
        var _this = this;
        // Check if valid location stored
        if (this.weatherSettings != null) {
            this.location.requestTime(this.weatherSettings.latitude, this.weatherSettings.longitude).subscribe(function (res) {
                if (res.status == "OK") {
                    var dateTime = res.formatted.split(' '); // Separate the time & date
                    _this.currentDate = dateTime[0];
                    _this.currentTime = dateTime[1];
                    console.log("Time: " + res.formatted + "Status: " + res.status);
                }
                else {
                    console.log("Error no Time: " + res.formatted + " Status: " + res.status);
                }
            });
        }
        else {
            console.log("No location set to assign time");
        }
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"F:\Storage\Documents\HDip Software Development\Mobile Application Development\Final Submission\G00398242\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      G00398242\n    </ion-title>\n    <!-- Settings Button-->\n    <ion-buttons end>\n      <button ion-button (click)="openSettings()"> \n        <ion-icon name="settings"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding >\n  <!-- Location Section -->\n  <h3 [hidden]="noLocation">No city selected</h3>\n  <div [hidden]="hideLocation">\n    <h2>Country: {{ country }}</h2>\n    <h3>Capital: {{ capital }}</h3>\n    <img src="{{ flag }}" alt="Flag Icon">\n    <p><strong>Latitude: </strong> {{ lat }}<strong> Longitude: </strong> {{ lon }}</p>\n    <!-- Current Time Section -->\n    <h5 [hidden]="hideTime">{{ timeZone }} Time: {{ currentTime }}</h5>\n  </div>\n  <!-- Weather Section -->\n  <h1 >Weather</h1>\n  <ion-spinner [hidden]= "spinner" name="circles"></ion-spinner>\n  <h3 [hidden]="noWeather">No Weather Available</h3>\n  <div [hidden]="hideWeather">\n    <h2>Station: {{ station }}</h2>\n    <h3>Temperature here: {{ temperature }} {{ symbol }}</h3>\n    <h3>Forecast: {{ forecast }}</h3>\n    <img src="{{ forecastIcon }}" alt="Weather Icon">\n    <h3>Wind Direction: {{ windDir }}</h3>\n  </div>\n  <!-- News Section -->\n  <br>\n  <h1 [hidden]="hideNews" style="display: inline">{{ code }}</h1><h1 style="display: inline"> News</h1>\n  <br>\n  <h3 [hidden]="noNews">No News Available</h3>\n  <br>\n  <ion-spinner [hidden]= "spinner" name="circles"></ion-spinner>\n  <div [hidden]="hideNews">\n    <!-- Updated Time & Date Section -->\n    <h6>Updated {{ currentDate }} at {{ currentTime }}</h6>\n    <ion-card *ngFor="let news of newsArray" >\n      <!-- Inline CSS to remove hyperlink formatting from the title and description elements-->\n      <a href="{{ news.url }}" target="_blank" style="text-decoration: none; color: black;">\n        <img src="{{ news.urlToImage }}" alt="News Image" onerror="this.src=\'/assets/imgs/no-image-placeholder.jpg\';"><br>   \n       <ion-card-header>\n          <ion-card-title>{{ news.title }}</ion-card-title>\n        </ion-card-header>\n        <ion-card-content>{{ news.description }}</ion-card-content>\n      </a>\n    </ion-card>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"F:\Storage\Documents\HDip Software Development\Mobile Application Development\Final Submission\G00398242\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__providers_location_location__["a" /* LocationProvider */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(203);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(223);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_storage__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_location_location__ = __webpack_require__(79);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__["a" /* SettingsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/settings/settings.module#SettingsPageModule', name: 'SettingsPage', segment: 'settings', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_5__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_settings_settings__["a" /* SettingsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_4__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_10__providers_location_location__["a" /* LocationProvider */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(201);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"F:\Storage\Documents\HDip Software Development\Mobile Application Development\Final Submission\G00398242\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"F:\Storage\Documents\HDip Software Development\Mobile Application Development\Final Submission\G00398242\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 79:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/*
  Generated class for the LocationProvider provider.
  
*/
var LocationProvider = /** @class */ (function () {
    function LocationProvider(http) {
        this.http = http;
        console.log('Hello LocationProvider Provider');
    }
    // Function requests country data from internet source
    LocationProvider.prototype.requestLocation = function (location) {
        return this.http.get("https://restcountries.com/v3.1/capital/" + location);
    };
    // Function requests weather data from internet source
    LocationProvider.prototype.requestWeather = function (unitTemp, lat, lon) {
        return this.http.get("https://api.weatherbit.io/v2.0/current?lat=" + lat + "&lon=" + lon + "&units=" + unitTemp + "&key=1b32ced6fbd04527a5273c5012dcfb7e");
    };
    // Function requests news data from internet source
    LocationProvider.prototype.requestNews = function (location) {
        return this.http.get("https://newsapi.org/v2/top-headlines?country=" + location + "&pageSize=5&apiKey=0587e5206bb8464c80c79e6e96f313fc");
    };
    // Function requests time/date data from internet source
    LocationProvider.prototype.requestTime = function (lat, lon) {
        return this.http.get("http://api.timezonedb.com/v2.1/get-time-zone?key=XE7JNI6TB7HZ&format=json&by=position&lat=" + lat + "&lng=" + lon);
    };
    LocationProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], LocationProvider);
    return LocationProvider;
}());

//# sourceMappingURL=location.js.map

/***/ })

},[202]);
//# sourceMappingURL=main.js.map