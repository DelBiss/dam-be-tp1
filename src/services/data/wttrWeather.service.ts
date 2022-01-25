// eslint-disable-next-line @typescript-eslint/no-var-requires
import { WeatherProvider } from '../../interfaces';
import { injectable } from 'inversify';
import fetch from 'node-fetch';
import {getCF} from '../../console_formating'
const consoleWttr = getCF('wttr')

@injectable()
/*
* Cette classe fait la communication avec l'API de wttr
*/
export class wttrWeatherService implements WeatherProvider{
    constructor(){
    }
    async readWeather(location: string): Promise<JSON> {
        
        const apiURL = new URL(location.toLowerCase(), 'https://wttr.in/');
        const params = new URLSearchParams({
            'format' : 'j1',
            'lang':'fr'
        });
        
        apiURL.search = params.toString();
        
        consoleWttr(`Loading weather data from wttr: ${apiURL.href}`);
        
        const response = fetch(apiURL).then(
            (response) => {
                return response.json();
            }).then(
                (json)=>{
                    json["_id"] = location;
                    json["cached_date"] = new Date();
                    return json;
                }
            );
        return response;
    }

}