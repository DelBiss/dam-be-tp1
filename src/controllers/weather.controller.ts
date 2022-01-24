import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { WeatherProvider } from '../interfaces';
import { TYPES } from '../types';

@injectable()
export class WeatherController {
    private _routing_template:{[key:string]:Array<string>};
    private _default_template:Array<string>;
    public constructor(@inject(TYPES.WeatherService) private _weatherService: WeatherProvider, private _defaultLocation = 'Montreal') {
        
        
        //Mapping entre les Route est les partial utiliser pour emplir les carte
        this._routing_template = {
            'now' : [
                'card_extra_condition__'
            ],
            'days' : [
                'card_daily__'
            ],
            'hours' : [
                'card_hour__graph'
            ],
            'astronomy' : [
                'card_astronomy'
            ]
        };

        //Partial utiliser si aucune Route valide est fournis
        this._default_template = [
            'card_extra_condition__',
            'card_daily__',
            'card_astronomy',
            'card_hour__graph',
        ];
    }

    public get router(): Router {
        /*
        * Un Router est un regroupement isolé de middlewares.
        * Ce Router est associé à la route /weather.
        * https://expressjs.com/en/4x/api.html#router
        */
        const router: Router = Router();

        router.get('/:view?',async (req: Request, res: Response) => {
            const view = this._routing_template[req.params.view];
            console.log(req.originalUrl)
            const locations: string[] = req.query['ville']?req.query['ville'].toString().split(/(?:,|;)/): [this._defaultLocation];
            
            try {

                type TemplateData = {
                    view: string[],
                    cities: JSON[],
                    query: string,
                };

                const json:TemplateData = {
                    view    : view||this._default_template,
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