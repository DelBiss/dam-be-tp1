// eslint-disable-next-line @typescript-eslint/no-var-requires
import { WeatherProvider } from '../interfaces';
import { injectable } from 'inversify';
import fetch from 'node-fetch';


@injectable()
/*
* Cette classe fait la communication avec l'API de wttr
*/
export class wttrWeatherService implements WeatherProvider{
    constructor(){
        //empty
    }
    async readWeather(location: string): Promise<JSON> {
        //TODO Extraire le JSON à l'aide du service wttr
        console.log(location);
        const response = await fetch('https://wttr.in/montreal?format=j1&lang=fr');
        const data = response.json();
        return data;
        // return fetch('https://wttr.in/montreal?format=j1&lang=fr').then((value)=>{ });
    }

}