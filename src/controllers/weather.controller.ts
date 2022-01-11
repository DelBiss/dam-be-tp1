import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { WeatherProvider } from '../interfaces';
import { TYPES } from '../types';

@injectable()
export class WeatherController{
    public constructor(@inject(TYPES.WeatherService) private _weatherService: WeatherProvider, private _defaultLocation = 'Montreal'){}

    public get router() : Router {
        /*
        * Un Router est un regroupement isolé de middlewares.
        * Ce Router est associé à la route /weather.
        * https://expressjs.com/en/4x/api.html#router
        */
        const router: Router = Router();

        router.use(async (req:Request, res: Response) => {
            const json = await this._weatherService.readWeather(this._defaultLocation);
            console.log(json);
            res.render('index');
        });
        
        return router;
    }

}