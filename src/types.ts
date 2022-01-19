const TYPES = {
    Application: Symbol.for('Application'),
    Server: Symbol.for('Server'),
    WeatherDataService: Symbol.for('WeatherDataRepository'),
    WeatherCacheService: Symbol.for('WeatherCacheRepository'),
    WeatherDataTransformPreCache: Symbol.for('WeatherDataTranformPreCache'),
    WeatherDataTransform: Symbol.for('WeatherDataTranform'),
    WeatherService: Symbol.for('WeatherRepository'),
    WeatherController: Symbol.for('WeatherController')
};

export { TYPES };
