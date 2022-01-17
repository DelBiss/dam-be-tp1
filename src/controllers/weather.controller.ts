import { Router, Request, Response, NextFunction } from 'express';
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

        router.use(async (req:Request, res: Response, next:NextFunction) => {
            const location:string = req.url.slice(1) || this._defaultLocation;
            try {
                const json = await this._weatherService.readWeather(location);
                
                // json['view']='current';
                json['view']='days_hourly';
                
                // console.log(json);
                res.render('index',json);
            } catch (error) {
                res.status(404);
                res.render('404',{url:req.originalUrl});
                next(error);
                
            }
            
        });
        
        return router;
    }

}