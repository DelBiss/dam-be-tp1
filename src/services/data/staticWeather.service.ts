import { injectable } from 'inversify';
import { WeatherProvider } from '../../interfaces';
// import * as fs from 'fs';
import { promises as fs } from 'fs';
import * as path from 'path';

@injectable()
export class StaticWeatherService implements WeatherProvider{
    constructor(private _weathersDir: string = path.join('private', 'weathers'))
    {
    }

    /*
    * Cette fonction permet de remplacer la communication à wttr 
    * en retournant le contenu d'un fichier .json à la place.
    */
    async readWeather(location: string): Promise<JSON> {
        const jsonPath = path.join(this._weathersDir, `${location.toLowerCase()}.json`);
        console.log('Staticly loading json file: ', jsonPath);

        //Cette fonction n'est pas sécuritaire et ne devrait pas être utilisé en production
        const filePromise = fs.readFile(jsonPath);

        const stringData = filePromise.then(
            (data:Buffer) => {
                return data.toString('utf-8');
            });

        return stringData.then(JSON.parse);
    }
}