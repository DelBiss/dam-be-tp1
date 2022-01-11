export interface WeatherProvider {
  //Retourne la météo d'une position (location)
  readWeather(location: string): Promise<JSON>;
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

