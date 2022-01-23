import { Container } from 'inversify';
import { TYPES } from './types';
import { WeatherController } from './controllers/weather.controller';
import { Application } from './app';
import { Server } from './server';
//TODO Utiliser wttr comme provider au lieu des fichiers statiques
// import { IconWeatherService as IconWeatherProvider }  from './services/iconWeather.service';
import { StaticWeatherService }  from './services/data/staticWeather.service';
import { wttrWeatherService } from './services/data/wttrWeather.service';
import { MongodbService } from './services/data/mongodb.service';
import { weatherService } from './services/weather.service';
import { IconWeatherTransformer } from './services/transform/iconWeatherTransformer.service';
// import { WeatherProvider } from './interfaces';

const container: Container = new Container();

//App
container.bind(TYPES.Server).to(Server);
container.bind(TYPES.Application).to(Application);

//Services
container.bind(TYPES.WeatherService).to(weatherService); 

container.bind(TYPES.WeatherDataService).to(StaticWeatherService).whenTargetNamed('dev'); 
container.bind(TYPES.WeatherDataService).to(MongodbService); 
container.bind(TYPES.WeatherDataService).to(wttrWeatherService); 
container.bind(TYPES.WeatherDataService).to(StaticWeatherService); 

container.bind(TYPES.WeatherCacheService).to(MongodbService); 
container.bind(TYPES.WeatherDataTransformPreCache).to(IconWeatherTransformer);

//Controllers
container.bind(TYPES.WeatherController).to(WeatherController);


export { container };