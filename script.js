const successCallback = (position) => {
    // Latitude
    const latitude = Math.round(position.coords.latitude);
    let latDirection = "";
    if (latitude > 0) {
        latDirection = "N";
    } else if (latitude < 0) {
        latDirection = "S";
    }
    document.getElementById(
        "latitude"
    ).textContent = `${latitude}°${latDirection}`;

    //Longitude
    const longitude = Math.round(position.coords.longitude);
    let longiDirection = "";
    if (longitude > 0) {
        longiDirection = "E";
    } else if (latitude < 0) {
        longiDirection = "W";
    }
    document.getElementById(
        "longitude"
    ).textContent = `${longitude}°${longiDirection}`;

    // Time
    const time = new Date(position.timestamp);
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let ordinal = "th";
    if (time.getDate() == 1) {
        ordinal = "st";
    } else if (time.getDate() == 2) {
        ordinal = "nd";
    } else if (time.getDate() == 3) {
        ordinal = "rd";
    }
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    // Format date & time into the string
    document.getElementById("time").textContent = `${days[time.getDay()]
        } ${time.getDate()}${ordinal}, ${months[time.getMonth()]
        } ${time.getFullYear()} at ${time.getHours()}:${time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
        }`;

    fetch(
        `https://weather-proxy.freecodecamp.rocks/api/current?lat=${latitude}&lon=${longitude}`
    )
        .then((res) => {
            if (!res.ok) {
                throw new Error("Network response was not ok");
            }
            return res.json();
        })
        .then((data) => {
            // Place temperature
            const temperature = Math.round(data.main.temp);
            document.getElementById("temperature").textContent = temperature + "°C";
            document
                .getElementById("unit-button")
                .setAttribute("onClick", `toFahrenheit(${temperature})`);

            // Place icon
            const weatherIcon = data.weather[0].icon;
            document.getElementById("weather-icon").setAttribute("src", weatherIcon);

            // Place description
            const description = capitalize(data.weather[0].description.trim());
            document.getElementById("weather-icon").setAttribute("alt", description);
            document.getElementById("weather-description").textContent = description;

            // Remove loading message
            document.getElementById("loading").classList.toggle("hidden");
            // Show content
            document.getElementById("time").classList.toggle("hidden");
            document.getElementsByClassName("weather-box")[0].classList.toggle("hidden");
            document.getElementById("coordinates").classList.toggle("hidden");
        })
        .catch((err) => {
            console.error(`Error: ${err}`);
        });
};

const errorCallback = (error) => {
    console.log(error);
};

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const toFahrenheit = (temperature) => {
    temperature = Math.round(temperature * (9 / 5) + 32);
    document.getElementById("temperature").textContent = temperature + "°F";
    document
        .getElementById("unit-button")
        .setAttribute("onClick", `toCelcius(${temperature})`);
    document.getElementById("unit-button").textContent = "Change to Celcius";
};

const toCelcius = (temperature) => {
    temperature = Math.round((temperature - 32) * (5 / 9));
    document.getElementById("temperature").textContent = temperature + "°C";
    document
        .getElementById("unit-button")
        .setAttribute("onClick", `toFahrenheit(${temperature})`);
    document.getElementById("unit-button").textContent = "Change to Fahrenheit";
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
