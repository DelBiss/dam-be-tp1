import { injectable } from 'inversify';
import { WeatherProvider, WeatherCache } from '../../interfaces';
import { Collection, MongoClient, InsertOneResult } from 'mongodb';

const mongourl = 'mongodb://root:example@localhost:27017/?authSource=admin&readPreference=primary&ssl=false';
const db_name = 'tp1';
const collection_name = 'weathers';

@injectable()
/*
* Cette classe s'occupe des communications avec MongoDB
*/
export class MongodbService implements WeatherProvider, WeatherCache{
    constructor(private _mongoClient:MongoClient = new MongoClient(mongourl), private _collection: Collection<any>){
        this._collection = this._mongoClient.db(db_name).collection<any>(collection_name);
        console.log('CTOR', this);
    }
    
    
    async readWeather(location: string): Promise<JSON> {
        console.log('Looking into Mongodb for: ', location);
        
        //Connect to Mongo
        const DataReadPromise = this._mongoClient.connect().then(
            //Search for the location
            ()=>{
                return this._collection.findOne({'location':location})
            }
        ).then(
            (entry:JSON)=>{
                if(entry===null){
                    throw new Error('Not found');
                }
                return entry["data"];
            }
        ).finally(
            ()=>{
                return this._mongoClient.close();
            }
        );
        
        return DataReadPromise;
    }

    async cache(_location: string, _data: JSON): Promise<boolean> {
        const entry = {
            location: _location,
            data: _data
        };

        console.log('Sending to cache')
        const InsertPromise = 
        //Connect to Mongo
        this._mongoClient.connect().then(
            //Send my entry
            ():Promise<InsertOneResult>=>{
                return this._collection.insertOne(entry)
            }
        ).then(
            //SUCCES
            (result:InsertOneResult)=>{
                console.log(`Data for ${_location} cached complete with result: ${result.acknowledged} and ID: ${result.insertedId}`)
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