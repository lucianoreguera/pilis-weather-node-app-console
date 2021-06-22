require('colors');
require('dotenv').config();
const { readInput, inquirerMenu, pause, listCities } = require('./helpers/inquirer');
const Search = require('./models/Search');


const main = async () => {
    const search = new Search();
    let option; 
    
    do {
        option = await inquirerMenu();

        switch (option) {
            case 1:
                const input = await readInput('Ciudad: ');

                const cities = await search.city(input);

                const id = await listCities(cities);
                if (id === 0) continue;

                const city = cities.find(c => c.id === id);

                search.addHistory(city.name);

                const weather = await search.weatherByCity(city.lat, city.long);
                
                console.clear();
                console.log('\nInformación de la ciudad\n');
                console.log('Ciudad:', city.name.green);
                console.log('Lat:', city.lat);
                console.log('Long:', city.long);
                console.log('Temperatura:', `${weather.temp}°C`);
                console.log('Mínima:', `${weather.temp_min}°C`);
                console.log('Máxima:', `${weather.temp_max}°C`);
                console.log('Clima para hoy:', weather.description.green);
                break;
            case 2:
                search.historyCapitalized.forEach((city, index) => {
                    const i = `${index+1}`.green;

                    console.log(`${i}. ${city}`);
                });
                break;
        }

        await pause();
    } while (option !== 0);
};

main();
