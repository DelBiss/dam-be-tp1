import {RelativeTime} from './util'

class CacheExpired extends Error{
    constructor(id:string, expiredSince:number) {
        super(`Requete "${id}" a expiré ${RelativeTime('fr',expiredSince)}`);
        this.name = "CacheExpired";
    }
}

class NotFoundInCache extends Error{
    constructor(message: string) {
        super(message);
        this.name = "NotFoundInCache";
    }
}

class NotInStaticFile extends Error{
    constructor(message: string) {
        super(message);
        this.name = "NotInStaticFile";
    }
}

export { CacheExpired, NotFoundInCache, NotInStaticFile};