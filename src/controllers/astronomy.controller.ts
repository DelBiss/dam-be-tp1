import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { WeatherProvider } from '../interfaces';
import { TYPES } from '../types';

@injectable()
export class AstronomyController {
    public constructor(@inject(TYPES.WeatherService) private _weatherService: WeatherProvider, private _defaultLocation = 'Montreal') {}

    public get router(): Router {
        const router: Router = Router();

        router.get('/',async (req: Request, res: Response) => {
            
            const locations: string[] = req.query['ville']?req.query['ville'].toString().split(/(?:,|;)/): [this._defaultLocation];
            
            try {

                type TemplateData = {
                    view: string[],
                    cities: JSON[],
                    query: string,
                };

                const json:TemplateData = {
                    view    : ['card_astronomy'],
                    cities  : [],
                    query   : ''
                };

                const queries = [];
                for (const location of locations) {
                    if(location){
                        queries.push(location); //C'est pas beau, mais il est 3h du matin
                        json.cities.push(await this._weatherService.readWeather(location));    
                    }
                }
                json.query = "?ville="+queries.join(';');
                res.render('index', json);

            } catch (error) {
                res.status(404);
                res.render('404', { url: req.originalUrl });

            }

        });

        return router;
    }

}