// eslint-disable-next-line @typescript-eslint/no-var-requires
import { WeatherDataTransformer, WeatherProvider } from '../interfaces';
import { injectable, multiInject } from 'inversify';
import { TYPES } from '../types';


@injectable()
/*
* Cette classe fait la communication avec l'API de wttr
*/
export class weatherService implements WeatherProvider{
    constructor(
        @multiInject(TYPES.WeatherDataService) private _weatherServices: WeatherProvider[],
        @multiInject(TYPES.WeatherDataTransformPreCache) private _precacheTransform: WeatherDataTransformer[]
        // @inject(TYPES.WeatherDataService) private _weatherService: WeatherProvider
    ){
        console.log('CTOR', this);
    }
    async readWeather(location: string): Promise<JSON> {
        console.log('Looking for weather data in all provider: ', location);


        const DatapromiseChain = this._weatherServices.reduce( 
            (chain, dataProvider):Promise<JSON> => {
                return chain.catch(
                    (reason):Promise<JSON>  => {
                        console.log(reason);
                        return dataProvider.readWeather(location);
                    }
                );
            },
            Promise.reject()
        );


        
        const PreCacheChain = this._precacheTransform.reduce( (chain, precache):Promise<JSON> => {
            return chain.then((data)=>{
                return precache.transform(data);
            });
        },DatapromiseChain.then((value)=>{console.log('Sending data to transformation pre-cache');return value;}));
        return PreCacheChain;

    }

    
}