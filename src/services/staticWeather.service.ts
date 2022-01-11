import { injectable } from 'inversify';
import { WeatherProvider } from '../interfaces';
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class StaticWeatherService implements WeatherProvider{
    constructor(private _weathersDir: string = path.join('private', 'weathers')){}

    /*
    * Cette fonction permet de remplacer la communication à wttr 
    * en retournant le contenu d'un fichier .json à la place.
    */
    async readWeather(location: string): Promise<JSON> {
        //Cette fonction n'est pas sécuritaire et ne devrait pas être utilisé en production
        return new Promise<JSON>((resolve, reject) => {
            fs.readFile(path.join(this._weathersDir, `${location.toLowerCase()}.json`), (err: NodeJS.ErrnoException, data: Buffer) => {
                if(!err){
                    resolve(JSON.parse(data.toString('utf8')));
                }
                reject(err);
            });
        });
    }
}