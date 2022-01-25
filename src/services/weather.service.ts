// eslint-disable-next-line @typescript-eslint/no-var-requires
import { WeatherDataTransformer, WeatherProvider, WeatherCache } from '../interfaces';
import { injectable, multiInject, inject } from 'inversify';
import { TYPES } from '../types';
import { NotFoundInCache, CacheExpired } from '../error'
import {getCF} from '../console_formating'
const consoleCache = getCF('Cache')

@injectable()
/*
* Cette classe fait la communication avec l'API de wttr
*/
export class weatherService implements WeatherProvider{
    constructor(
        @multiInject(TYPES.WeatherDataService) private _weatherServices: WeatherProvider[],
        @multiInject(TYPES.WeatherDataTransformPreCache) private _precacheTransform: WeatherDataTransformer[],
        @inject(TYPES.WeatherCacheService) private _cache: WeatherCache
        // @inject(TYPES.WeatherDataService) private _weatherService: WeatherProvider
    ){
    }
    async readWeather(location: string): Promise<JSON> {
        


        const DatapromiseChain = this._weatherServices.reduce( 
            (chain, dataProvider):Promise<JSON> => {
                return chain.catch(
                    (reason):Promise<JSON>  => {
                        if(reason instanceof  CacheExpired){
                            consoleCache(reason.message)
                        }else if(reason instanceof NotFoundInCache){
                            consoleCache(reason.message)
                        }
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
        },DatapromiseChain);
        
        //Send the caching into the air
        PreCacheChain.then(
            (value) =>{
                return this._cache.cache(value)
            }
        );
        return  PreCacheChain;

    }

    
}