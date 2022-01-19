// eslint-disable-next-line @typescript-eslint/no-var-requires
import { WeatherProvider } from '../../interfaces';
import { injectable } from 'inversify';
import fetch from 'node-fetch';


@injectable()
/*
* Cette classe fait la communication avec l'API de wttr
*/
export class wttrWeatherService implements WeatherProvider{
    constructor(){
        console.log('CTOR', this);//empty
    }
    async readWeather(location: string): Promise<JSON> {
        
        const apiURL = new URL(location.toLowerCase(), 'https://wttr.in/');
        const params = new URLSearchParams({
            'format' : 'j1',
            'lang':'fr'
        });
        
        apiURL.search = params.toString();
        
        console.log('Loading weather data from wttr: ', apiURL.href);
        
        const response = fetch(apiURL);
        return response.then(
            (response) => {
                return response.json();
            });
    }

}