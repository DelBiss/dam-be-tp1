import { injectable } from 'inversify';
import { WeatherDataTransformer } from '../../interfaces';
import * as fs from 'fs';
import * as path from 'path';

@injectable()
export class IconWeatherTransformer implements WeatherDataTransformer{
    code_icon:JSON;
    constructor(){
        const filename = 'weather_code_icon.json';
        const filepath = path.join('private', 'weathers',filename);
        
        this.code_icon = JSON.parse(fs.readFileSync(filepath).toString('utf8'));
    }

    
    async transform(data: JSON): Promise<JSON> {
        
        for (const currentCondition of data['current_condition']) {
            this.setIconName(currentCondition);
        }

        for (const weather of data['weather']) {
            for (const hourly of weather['hourly']) {
                this.setIconName(hourly);
            }
        }
        // data['current_condition'][0]['localObsDateTime'] = 'ICONIFY2';
        return new Promise<JSON>((resolve) => {resolve(data);});
    }

    setIconName(entry:JSON){
        entry['weatherIconUrl'][0]['value'] = this.code_icon[ entry['weatherCode']]['day'] || 'NA';
    }
}