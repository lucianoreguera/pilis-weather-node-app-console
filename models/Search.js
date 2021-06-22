const fs = require('fs');
const axios = require('axios');


class Search {
    constructor() {
        this.history = [];
        this.dbPath = './db/db_history.json';
        this.readDB();
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        };
    }

    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        };
    }

    get historyCapitalized() {
        return this.history.map(city => {
            let words = city.split(' ');
            words = words.map(word => word[0].toUpperCase() + word.substring(1));

            return words.join(' ');
        });
    }

    async city(location = '') {
        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json`,
            params: this.paramsMapbox
        });
        
        try {
            const response = await instance.get();
    
            return response.data.features.map(city => ({
                id: city.id,
                name: city.place_name,
                long: city.center[0],
                lat: city.center[1]
            }));
        } catch (error) {
            console.log(error);
            return [];
        }
        
    }

    async weatherByCity(lat, lon) {
        const instance = axios.create({
            baseURL: 'https://api.openweathermap.org/data/2.5/weather',
            params: {...this.paramsOpenWeather, lat, lon}
        });

        try {
            const response = await instance.get();

            return {
                'temp': response.data.main.temp,
                'temp_min': response.data.main.temp_min,
                'temp_max': response.data.main.temp_max,
                'description': response.data.weather[0].description
            };
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    addHistory(city = '') {
        if (this.history.includes(city.toLocaleLowerCase())) return;

        this.history = this.history.splice(0,5);

        this.history.unshift(city.toLocaleLowerCase());

        this.saveDB();
    }

    saveDB() {
        const payload = {
            history: this.history
        };
        
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {
        if (!fs.existsSync(this.dbPath)) return;

        const result = fs.readFileSync(this.dbPath, { enconding: 'utf-8' });
        const data = JSON.parse(result);

        this.history = data.history;
    }
}

module.exports = Search;
