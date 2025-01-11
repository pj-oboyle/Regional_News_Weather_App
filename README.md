# Project: Ionic Country, Weather & News Reader

This Ionic mobile application provides a seamless way to access country information, weather updates, and news for a specified location. The app fetches data from multiple internet resources and stores it efficiently using Ionic storage for enhanced user experience.

## Key Features Summary

1. **Dynamic Data Display:** Real-time updates for weather and news based on user-saved location.
2. **Error Handling:** Robust alerts and messages for invalid or unavailable data.
3. **User Experience:** Seamless navigation and intuitive UI with placeholder support and loading indicators.

---

## Features

### **Core Features**
1. **Data Integration:**
   - Fetches country data from [restcountries.com](https://restcountries.com/#api-endpoints-v3).
   - Retrieves weather data from [weatherbit.io](https://www.weatherbit.io/api/weather-current).
   - Displays top news stories for the selected country from [newsapi.org](https://newsapi.org/docs/endpoints/top-headlines).

2. **Efficient Data Storage:**
   - Stores all HTTP response data in three objects within Ionic Key-Value (KV) storage:
     - **Settings:** Stores country data.
     - **Weather:** Stores weather data.
     - **Temperature:** Stores temperature settings (unit, symbol, and input code).
   - Automatically uses the correct temperature symbol (e.g., °C, °F) beside the value on the Home page.

3. **Dynamic Home Page:**
   - Displays the current time based on the saved location, with an option to toggle between **local time** and **GMT**.
   - A placeholder image is shown when news items lack an image.
   - Displays weather details (temperature, description, wind direction, and icon) and a button for accessing news stories.

4. **Settings Page:**
   - Allows users to:
     - Save a location and temperature unit (metric or imperial).
     - Toggle time display mode (local or GMT).
     - Delete all saved settings, resetting the app to its original state.
   - Prompts the user when leaving without saving a location or attempting to delete settings.

5. **Error Handling:**
   - Displays custom messages for HTTP errors, such as:
     - **404:** Location not found.
     - **503/504:** Server unavailable.
   - Alerts the user when no location is saved in storage and prevents navigation to the Home page until resolved.

6. **Loading Indicators:**
   - A spinner icon is displayed for 1 second before weather and news data appear on the Home page.

---

## Pages Overview

### **1. Home Page:**
   - Displays:
     - City name, country name, and flag.
     - Weather details (temperature with unit, description, wind direction, and icon).
     - Current time based on user settings.
   - Shows a "News" button to access the latest news stories for the country.

### **2. Settings Page:**
   - Enables users to:
     - Enter and save a location.
     - Select temperature units (default: metric).
     - Toggle time mode between local and GMT.
     - Delete all settings with a confirmation prompt.
   - Ensures unsaved changes are not retained if the user exits the page.

### **3. News Page:**
   - Displays the first 5 news stories for the selected country, showing:
     - Title, description, and an image (or placeholder if unavailable).
     - Clicking a news item opens the full story in a browser.
   - If no news is available, displays a message indicating no stories were found.

---

## Installation

### **Prerequisites**
- **Node.js:** Version 12 or above.
- **Ionic CLI:** Version 6 or above.
- **API Keys:**
  - Create accounts and obtain API keys from:
    - [weatherbit.io](https://www.weatherbit.io/account/create)
    - [newsapi.org](https://newsapi.org/register)

### **Steps**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ionic-country-weather-news-reader.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ionic-country-weather-news-reader
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Add your API keys to the relevant service configurations.
5. Start the application:
   ```bash
   ionic serve
   ```

---

## Usage

1. **Run the app locally** using `ionic serve`.
2. **Navigate through pages:**
   - Start with the Settings page to save a location.
   - View country information, weather, and news on the Home and News pages.
3. **Modify settings** as needed using the Settings page.

---

## API References
- **Country Data:** [restcountries.com API](https://restcountries.com/#api-endpoints-v3)
- **Weather Data:** [Weatherbit API](https://www.weatherbit.io/api/weather-current)
- **News Data:** [NewsAPI](https://newsapi.org/docs/endpoints/top-headlines)

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact
For further information, contact:
- **Name:** pj-oboyle
- **GitHub:** [pj-oboyle](https://github.com/pj-oboyle)

---

Thank you for exploring this project! If you found it helpful, please give it a star on GitHub.

