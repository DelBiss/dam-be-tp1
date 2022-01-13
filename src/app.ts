/* eslint-disable @typescript-eslint/no-explicit-any */
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as hbs from 'hbs';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { WeatherController } from './controllers/weather.controller';

@injectable()
export class Application {

    private readonly _internalError: number = 500;
    private readonly _viewsDir: string = path.join(__dirname, '..', 'templates', 'views');
    private readonly _partialsDir: string = path.join(__dirname, '..', 'templates', 'partials');
    private readonly _staticDir: string = path.join(__dirname, '..', 'public');
    public app: express.Application;

    public constructor(@inject(TYPES.WeatherController) private _weatherController: WeatherController) {

        this.app = express();

        this.config();

        this.bindRoutes();
    }

    private config(): void {
        //Configuration de Handlebars
        this.app.set('view engine', 'hbs');
        this.app.set('views', this._viewsDir);
        hbs.registerPartials(this._partialsDir);
        // Configuration des middlewares pour toutes les requêtes
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(express.static(this._staticDir));
        //TODO Configurer les ressources statiques
    }

    public bindRoutes(): void {
        //La route par défaut est /weather
        this.app.get('/', (req, res) => {
            res.redirect('/weather');
        });
        
        // Le weather controller se charge des routes /weather/*
        this.app.use('/weather', this._weatherController.router);

        //TODO Ajouter un controller pour les routes /astronomy/*

        // En dernier lieu, on fait la gestion d'erreur 
        // si aucune route n'est trouvé
        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error('Not Found');
            next(err);
        });

        // Error handler en pour l'environnement de développement
        // Imprime le stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response) => {
                res.status(err.status || this._internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // Error handler pour l'environnement de production
        this.app.use((err: any, req: express.Request, res: express.Response) => {
            res.status(err.status || this._internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}