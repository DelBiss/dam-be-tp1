import { injectable } from 'inversify';
import { WeatherProvider, WeatherCache } from '../../interfaces';
import { Collection, MongoClient, UpdateResult } from 'mongodb';

const mongourl = process.env.MONGO_CONNECTION_STRING || 'mongodb://root:example@localhost:27017/';
const db_name = process.env.DB_NAME || 'tp1';
const collection_name = 'weathers';
 
@injectable()
/*
* Cette classe s'occupe des communications avec MongoDB
*/
export class MongodbService implements WeatherProvider, WeatherCache{
    constructor(private _mongoClient:MongoClient = new MongoClient(mongourl), private _collection: Collection<any>){
        this._collection = this._mongoClient.db(db_name).collection<any>(collection_name);
    }
    
    
    async readWeather(location: string): Promise<JSON> {
        console.log('Looking into Mongodb for: ', location);
        
        //Connect to Mongo
        const DataReadPromise = this._mongoClient.connect().then(
            //Search for the location
            ()=>{
                return this._collection.findOne({'_id':location})
            }
        ).then(
            (entry:JSON)=>{
                if(entry===null){
                    throw new Error('Not found');
                }
                
                if((new Date().getTime() - entry["cached_date"].getTime())/1000> parseInt(process.env.CACHED_SECOND||'900')){
                    throw new Error(`Cached for ${entry['_id']} has expired`);
                    
                }
                return entry;
            }
        ).finally(
            ()=>{
                return this._mongoClient.close();
            }
        );
        
        return DataReadPromise;
    }

    async cache(data: JSON): Promise<boolean> {
        

        console.log('Sending to cache')
        const InsertPromise = 
        //Connect to Mongo
        this._mongoClient.connect().then(
            //Send my entry
            ():Promise<UpdateResult>=>{
                    
                return this._collection.updateOne(
                    {'_id':data['_id']},
                    { $set: data },
                    { upsert: true })
            }
        ).then(
            //SUCCES
            (result:UpdateResult)=>{
                console.log(`Data for ${data['_id']} cached complete with result: ${result.acknowledged} and ID: ${result.upsertedId}`)
                return result.acknowledged;
            }
        ).catch(
            //OR not
            (reason)=>{
                console.log('Cache failed!!!!!:',reason)
                return false
            }
        ).finally(
            //In all case, we ask to close the connection
            () =>{
                //and return another promise
                return this._mongoClient.close()
            }
        );

        return InsertPromise;
    }
}