// eslint-disable-next-line @typescript-eslint/no-var-requires
import { WeatherProvider } from '../interfaces';
import { injectable } from 'inversify';



@injectable()
/*
* Cette classe fait la communication avec l'API de wttr
*/
export class wttrWeatherService implements WeatherProvider{
    constructor(){
        //empty
    }

    readWeather(location: string): Promise<JSON> {
        //TODO Extraire le JSON à l'aide du service wttr
        console.log(location);
        throw new Error('Method not implemented.');
    }

}