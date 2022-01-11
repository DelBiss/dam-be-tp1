import { Container } from 'inversify';
import { TYPES } from './types';
import { WeatherController } from './controllers/weather.controller';
import { Application } from './app';
import { Server } from './server';
//TODO Utiliser wttr comme provider au lieu des fichiers statiques
import { StaticWeatherService as weatherProvider }  from './services/staticWeather.service';
// import { wttrWeatherService as weatherProvider } from './services/wttrWeather.service';


const container: Container = new Container();

//App
container.bind(TYPES.Server).to(Server);
container.bind(TYPES.Application).to(Application);

//Services
container.bind(TYPES.WeatherService).to(weatherProvider); 

//Controllers
container.bind(TYPES.WeatherController).to(WeatherController);

export { container };