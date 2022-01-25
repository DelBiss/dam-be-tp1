import { injectable } from 'inversify';
import { WeatherProvider, WeatherCache } from '../../interfaces';
import { Collection, MongoClient, UpdateResult } from 'mongodb';

import { NotFoundInCache, CacheExpired } from '../../error'
import {RelativeTime} from '../../util'
import {getCF} from '../../console_formating'

// import * as figlet from 'figlet'
import * as Colors from 'colors/safe';

const mongourl = process.env.MONGO_CONNECTION_STRING || 'mongodb://root:example@localhost:27017/';
const db_name = process.env.DB_NAME || 'tp1';
const collection_name = 'weathers';
 
const consoleMongo = getCF('MongoDB')
const consoleCache = getCF('Cache')
const consoleError = getCF('Error')
@injectable()
/*
* Cette classe s'occupe des communications avec MongoDB
*/
export class MongodbService implements WeatherProvider, WeatherCache{
    private Cached_Second:number
    constructor(private _mongoClient:MongoClient = new MongoClient(mongourl), private _collectionPromise: Promise<Collection<any>>){
        consoleMongo('Connection a MongoDB','special');
        this._collectionPromise = this._mongoClient.connect().then(
            (connectedClient:MongoClient) =>{
                consoleMongo('Connection a MongoDB reussi','special')
                consoleMongo(`Ouverture de la base de données ${Colors.underline(db_name)} avec la collection ${Colors.underline(collection_name)}`)
                return connectedClient.db(db_name).collection<any>(collection_name)
            }
        ).catch(
            (reason) =>{
                consoleError('Connection a MongoDB echouer','title');
                consoleError(reason);
                throw reason
            }
        );
        this.Cached_Second = parseInt(process.env.CACHED_SECOND||'900');
        // this.connectionPromise = this._mongoClient.connect()
    }
    
    
    async readWeather(location: string): Promise<JSON> {
        
        
        //Connect to Mongo
        const DataReadPromise = this._collectionPromise.then(
            //Search for the location
            (_collection)=>{
                return _collection.findOne({'_id':location})
            }
        ).then(
            (entry:JSON)=>{
                if(entry===null){
                    throw new NotFoundInCache(`Requete "${location}" n'a pas été trouvé dans la cache.`);
                }
                
                if(getTimeSinceCache(entry["cached_date"]) > this.Cached_Second){
                    throw new CacheExpired(entry['_id'], this.Cached_Second - getTimeSinceCache(entry["cached_date"]));
                }

                consoleCache(`Requete "${location}" a été trouver dans la cache. Elle expirera ${RelativeTime('fr', this.Cached_Second - getTimeSinceCache(entry["cached_date"]))} `)
                return entry;
            }
        );
        
        return DataReadPromise;
    }

    

    async cache(data: JSON): Promise<boolean> {

        const InsertPromise = 
        //Connect to Mongo
        this._collectionPromise.then(
            //Send my entry
            (_collection):Promise<UpdateResult>=>{
                    
                return _collection.updateOne(
                    {'_id':data['_id']},
                    { $set: data },
                    { upsert: true })
            }
        ).then(
            //SUCCES
            (result:UpdateResult)=>{
                return result.acknowledged;
            }
        ).catch(
            //OR not
            (reason)=>{
                consoleError('Cache Failed','title')
                consoleError(reason)
                return false
            }
        );

        return InsertPromise;
    }
}



function getTimeSinceCache(cached_date:Date){
    return (new Date().getTime() - cached_date.getTime())/1000;
}


