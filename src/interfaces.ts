export interface WeatherProvider {
  //Retourne la météo d'une position (location)
  readWeather(location: string): Promise<JSON>;
}

export interface WeatherDataTransformer{
  transform(data:JSON):Promise<JSON>;
}

export interface WeatherCache{
  cache(data:JSON):Promise<boolean>;
}

//Permet d'ajouter des champs à la requête de express
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      //TODO au besoin, ajouter des champs au type Request de Express
      // Ces champs sont accessible depuis les middlewares
      locations: Array<string>
    }
  }
}

