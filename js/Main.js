/**
 * © 2018 Justin Schlump
 * This code is licensed under MIT license (see LICENSE.txt for details)
 * 
 * This app fetches weather data using the OpenWeather API. It creates
 * a visual representation of the data in a responsive canvas window.
 */
import Data from './Data.js';

let APP = (function () {
    //CANVAS VARS
    let canvas = document.getElementById('game');
    let context = canvas.getContext('2d');
    let screenWidth = canvas.width;
    let screenHeight = canvas.height;

    //VARS
    let cityTime;
    let localTime;
    let cityDate;
    let running = false;
    let tempScale = 'fahrenheit';
    let barScale = 15;
    let currentTempColor;

    //API VARS
    let temp;
    let maxTemp;
    let minTemp;
    let humidity;
    let timeZone;
    let timeZoneId;
    let data;
    let city;

    /**
     * SUBMIT BUTTON TO CALL APIS
     **/
    document.getElementById("city-form").addEventListener("submit", function (e) {
        e.preventDefault();
        city = document.getElementById("city-field").value;
        document.getElementById("city-field").value = '';
        data = new Data(city);
        data.weather.then(function (result) {
            temp = result.temp;
            maxTemp = result.maxTemp;
            minTemp = result.minTemp;
            humidity = result.humidity;
        });
        data.timeZone.then(function (result) {
            timeZone = result.timezone;
            timeZoneId = result.timezoneId;
        });


    });
    /**
     * CONVERT TEMPERATURE DATA SCALE
     */
    const convert = (s, t) => {
        if (s === 'celsius') {
            barScale = 14.6;
            return t;
        } else if (s === 'fahrenheit') {
            barScale = 5;
            return Math.floor(t * 1.8 + 32);
        }
    }

    /**
     * INITIALIZE PROGRAM
     */
    const init = () => {
        if (running) {
            return;
        } else {
            running = true;
            city = 'Seattle';
            timeZoneId = 'America/Los_Angeles';
            data = new Data(city);
            data.weather.then(function (result) {
                temp = result.temp;
                maxTemp = result.maxTemp;
                minTemp = result.minTemp;
                humidity = result.humidity;
            });
            data.timeZone.then(function (result) {
                timeZone = result.timezone;
                timeZoneId = result.timezoneId;
            });
            run();
        }
    }

    /**
     * MAIN LOOP
     */
    const run = () => {
        if (running) {
            requestAnimationFrame(run);
            update();
            render();
        }
    }

    const createBackground = (day) => {
        let dayGradient;
        let nightGradient;

        if (day === 'day') {
            dayGradient = context.createLinearGradient(0, screenHeight, 0, 100);
            dayGradient.addColorStop(0, "cyan");
            dayGradient.addColorStop(1, "blue");
            context.fillStyle = dayGradient;
        }

        if (day === 'night') {
            nightGradient = context.createLinearGradient(0, screenHeight, 0, 100);
            nightGradient.addColorStop(0, "darkslateblue");
            nightGradient.addColorStop(1, "black");
            context.fillStyle = nightGradient;
        }
    }

    /**
     * RENDERING
     */
    const render = () => {
        let humidityScale = 5;
        let barWidth = 150;
        let barPaddingX = 20;
        let textPaddingX = 50;
        let barNamePadding = 10;

        //BACKGROUND FILL
        context.fillRect(0, 0, screenWidth, screenHeight);

        /**
         * RENDER BARS
         **/

        //MAXTEMP
        let maxGradient = context.createLinearGradient(0, screenHeight, 0, 100);
        maxGradient.addColorStop(0, "black");
        maxGradient.addColorStop(1, "red");
        context.fillStyle = maxGradient;
        context.fillRect(barPaddingX, screenHeight - convert(tempScale, maxTemp) * barScale, barWidth / 2, convert(tempScale, maxTemp) * barScale);
        context.fillStyle = currentTempColor;
        context.font = 'normal bold 30px Courier';
        context.fillText(`${convert(tempScale, maxTemp)}°`, barPaddingX + (textPaddingX / 4), (screenHeight - convert(tempScale, maxTemp) * barScale), 50);
        context.fillStyle = 'white';
        context.font = 'normal 25px Courier';
        context.fillText('HIGH', barPaddingX + (textPaddingX / 4), (screenHeight - barNamePadding), 50);

        //MINTEMP
        let minGradient = context.createLinearGradient(0, screenHeight, 0, 100);
        minGradient.addColorStop(0, "black");
        minGradient.addColorStop(1, "cyan");
        context.fillStyle = minGradient;
        context.fillRect(barWidth + barPaddingX + barWidth / 2, screenHeight - convert(tempScale, minTemp) * barScale, barWidth / 2, convert(tempScale, minTemp) * barScale);
        context.fillStyle = currentTempColor;
        context.font = 'normal bold 30px Courier';
        context.fillText(`${convert(tempScale, minTemp)}°`, (textPaddingX * 2.2) + barWidth, (screenHeight - convert(tempScale, minTemp) * barScale), 50);
        context.fillStyle = 'white';
        context.font = 'normal 25px Courier';
        context.fillText('LOW', (textPaddingX * 2.2) + barWidth, (screenHeight - barNamePadding), 50);

        //TEMP
        let tempGradient = context.createLinearGradient(0, screenHeight, 0, 100);
        tempGradient.addColorStop(0, "black");
        tempGradient.addColorStop(1, "orange");
        context.fillStyle = tempGradient;
        context.fillRect((barWidth / 2) + barPaddingX, screenHeight - convert(tempScale, temp) * barScale, barWidth, convert(tempScale, temp) * barScale);
        context.fillStyle = currentTempColor;
        context.font = 'normal bold 30px Courier';
        context.fillText(`${convert(tempScale, temp)}°`, (barWidth / 2) + barPaddingX + textPaddingX, (screenHeight - convert(tempScale, temp) * barScale), 50);
        context.fillStyle = 'white';
        context.font = 'normal 25px Courier';
        context.fillText('TEMPERATURE', (barWidth / 2) + (textPaddingX / 1.5), (screenHeight - barNamePadding), 120);

        //HUMIDITY
        let humGradient = context.createLinearGradient(0, screenHeight, 0, 100);
        humGradient.addColorStop(0, "black");
        humGradient.addColorStop(1, "green");
        context.fillStyle = humGradient;
        context.fillRect(barPaddingX * 20, screenHeight - humidity * humidityScale, barWidth, humidity * humidityScale);
        context.fillStyle = currentTempColor;
        context.font = 'normal bold 30px Courier';
        context.fillText(`${humidity}%`, barPaddingX * 20 + textPaddingX, (screenHeight - humidity * humidityScale), 50);
        context.fillStyle = 'white';
        context.font = 'normal 25px Courier';
        context.fillText('HUMIDITY', barPaddingX * 18.3 + textPaddingX, (screenHeight - barNamePadding), 120);

        /**
         * TEXT
         **/

        //CITY TIME
        context.fillStyle = 'white';
        context.font = 'normal 20px Courier';
        context.fillText(`City Time: ${moment().tz(timeZoneId).format('h:mm:ss A')}`, 5, 65, 250);

        //LOCAL TIME
        context.fillStyle = 'white';
        context.font = 'normal 20px Courier';
        context.fillText(`Local Time: ${localTime}`, 5, 85, 250);

        //DATE
        context.fillStyle = 'white';
        context.font = 'normal 20px Courier';
        context.fillText(`Date: ${moment().tz(timeZoneId).format('MM-DD-YY')}`, 5, 45, 250);

        //TIMEZONE
        context.fillStyle = 'white';
        context.font = 'normal 20px Courier';
        context.fillText(timeZone, 5, 105, 400);

        //CITY
        context.fillStyle = 'white';
        context.font = 'normal 30px Courier';
        context.fillText(city.toUpperCase(), 5, 25, 180);
    }

    const update = () => {
        localTime = moment().format('h:mm:ss A');

        if (moment().tz(timeZoneId).hour() >= 19 || moment().tz(timeZoneId).hour() <= 5) {
            createBackground('night');
            currentTempColor = 'white';

        } else {
            createBackground('day');
            currentTempColor = 'black';
        }
    }

    return {
        init: init
    }
})();

APP.init();