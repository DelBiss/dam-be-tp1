import { injectable } from 'inversify';
import { WeatherProvider } from '../../interfaces';

@injectable()
/*
* Cette classe s'occupe des communications avec MongoDB
*/
export class MongodbService implements WeatherProvider{
    
    constructor(){
        console.log('CTOR', this);
    }
    
    async readWeather(location: string): Promise<JSON> {
        console.log('Looking into Mongodb for: ', location);
        return new Promise<JSON>((resolve,reject)=>{reject('MongodbService: Method not implemented.');});
    }

}