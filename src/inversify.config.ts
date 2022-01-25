import { Container } from 'inversify';
import { TYPES } from './types';
import { Application } from './app';
import { Server } from './server';

import { WeatherController } from './controllers/weather.controller';
import { AstronomyController } from './controllers/astronomy.controller';

import { StaticWeatherService }  from './services/data/staticWeather.service';
import { wttrWeatherService } from './services/data/wttrWeather.service';
import { MongodbService } from './services/data/mongodb.service';
import { weatherService } from './services/weather.service';
import { IconWeatherTransformer } from './services/transform/iconWeatherTransformer.service';


const container: Container = new Container();

//App
container.bind(TYPES.Server).to(Server);
container.bind(TYPES.Application).to(Application);

//Services
container.bind(TYPES.WeatherService).to(weatherService).inSingletonScope(); 

container.bind(TYPES.WeatherCacheService).to(MongodbService).inSingletonScope(); 

 
container.bind(TYPES.WeatherDataService).toService(TYPES.WeatherCacheService); 
container.bind(TYPES.WeatherDataService).to(wttrWeatherService); 
container.bind(TYPES.WeatherDataService).to(StaticWeatherService); 

container.bind(TYPES.WeatherDataTransformPreCache).to(IconWeatherTransformer);

//Controllers
container.bind(TYPES.WeatherController).to(WeatherController);
container.bind(TYPES.AstronomyController).to(AstronomyController);


export { container };