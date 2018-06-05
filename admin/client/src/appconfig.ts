import { Inject, Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

declare var hibachiConfig: any;
var md5 = require('md5');

@Injectable()
export class AppConfig {
    private config: any;
    private attributeMetaData: any;
    private instantiationKey: string;
    private _resourceBundle = {};
    private resourceBundles;

    constructor(private http: Http) {

    }

    public fetchData() {
        var baseURL = hibachiConfig.baseURL;
        if (!baseURL) {
            baseURL = ''
        }
        if (baseURL.length && baseURL.slice(-1) !== '/') {
            baseURL += '/';
        }

        return this.getInstantiationKey(baseURL).then((instantiationKey: any) => {
            this.instantiationKey = instantiationKey;
            var invalidCache = [];
            try {
                var hashedData = localStorage.getItem('attributeChecksum');
                if (hashedData !== null && hibachiConfig.attributeCacheKey === hashedData.toUpperCase()) {
                    this.attributeMetaData = JSON.parse(localStorage.getItem('attributeMetaData'));
                    //coremodule.constant('attributeMetaData',JSON.parse(localStorage.getItem('attributeMetaData')));
                } else {
                    invalidCache.push('attributeCacheKey');
                }
            } catch (e) {
                invalidCache.push('attributeCacheKey');
            }

            try {
                this.config = JSON.parse(localStorage.getItem('appConfig'));
                if (hibachiConfig.instantiationKey === this.config.instantiationKey) {
                    return this.getResourceBundles();
                } else {
                    invalidCache.push('instantiationKey');
                }
            } catch (e) {
                invalidCache.push('instantiationKey');
            }

            return this.getData(invalidCache);
        });

    }

    getInstantiationKey(baseURL: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (hibachiConfig.instantiationKey) {
                resolve(hibachiConfig.instantiationKey);
            } else {

                this.http.get(baseURL + '?' + hibachiConfig.action + '=api:main.getInstantiationKey')
                .toPromise()
                    .then((resp: any) => resolve(resp.data.data.instantiationKey))
                    .catch(res=>reject(res));

            }
        });
    };


    getData(invalidCache: string[]) : Promise<any> {
        var promises: any = {};
        for (var i in invalidCache) {
            var invalidCacheName = invalidCache[i];
            var functionName = invalidCacheName.charAt(0).toUpperCase() + invalidCacheName.slice(1);
            promises[invalidCacheName] = this['get' + functionName + 'Data']();

        }
        return Promise.all(promises);
    };

    getAttributeCacheKeyData(): Promise<any>{
    return new Promise((resolve, reject) => {
        var urlString = "";

        if (!hibachiConfig) {
            hibachiConfig = {};
        }

        if (!hibachiConfig.baseURL) {
            hibachiConfig.baseURL = '';
        }
        urlString += hibachiConfig.baseURL;

        if (urlString.length && urlString.slice(-1) !== '/') {
            urlString += '/';
        }

        this.http.get(urlString + '?' + hibachiConfig.action + '=api:main.getAttributeModel').toPromise()
            .then((resp: any) => {
                this.attributeMetaData = resp.data.data;
                //coremodule.constant('attributeMetaData',resp.data.data);
                //for safari private mode which has no localStorage
                try {
                    localStorage.setItem('attributeMetaData', JSON.stringify(resp.data.data));
                    localStorage.setItem('attributeChecksum', md5(JSON.stringify(resp.data.data)));
                } catch (e) { }
                this.attributeMetaData = resp.data.data;
                resolve(resp.data.data);
            })
            .catch(res => reject(res));

    });
}
getInstantiationKeyData = () : Promise<any> => {
    return new Promise((resolve, reject)=>{
    if (!this.instantiationKey) {
        var d = new Date();
        var n = d.getTime();
        this.instantiationKey = n.toString();
    }
    var urlString = "";
    if (!hibachiConfig) {
        hibachiConfig = {};
    }
    if (!hibachiConfig.baseURL) {
        hibachiConfig.baseURL = '';
    }
    urlString += hibachiConfig.baseURL;
    if (hibachiConfig.baseURL.length && hibachiConfig.baseURL.charAt(hibachiConfig.baseURL.length - 1) != '/') {
        urlString += '/';
    }

    this.http.get(urlString + '/custom/config/config.json?instantiationKey=' + this.instantiationKey).toPromise()
        .then((resp: any) => {
            resp = resp.json();
            console.log("res", resp);
            if(!!!resp){
            reject(resp);
            }
            var appConfig = resp.data.data;
            if (hibachiConfig.baseURL.length) {
                appConfig.baseURL = urlString;
            }
            this.config = resp.data.data;
            //coremodule.constant('appConfig',resp.data.data);
            try {
                localStorage.setItem('appConfig', JSON.stringify(resp.data.data));
            } catch (e) { }
            this.config = appConfig;
            return this.getResourceBundles();
            resolve(resp);
        })
        .catch(res=>reject(res));
        
        });

};

getResourceBundle = (locale) : Promise<any> =>
    //var deferred = this.$q.defer();
    new Promise((resolve, reject) => {
        var locale = locale || this.config.rbLocale;

        if (this._resourceBundle[locale]) {
            return this._resourceBundle[locale];
        }

        var urlString = this.config.baseURL + '/custom/config/resourceBundles/' + locale + '.json?instantiationKey=' + this.config.instantiationKey;

        this.http.get(
            urlString
        ).toPromise().then((response: any) => {
            this._resourceBundle[locale] = response;
            resolve(response);
        }).catch((response: Response) => {
            if (response.status === 404) {
                this._resourceBundle[locale] = {};
                resolve(response);
            } else {
                reject(response);
            }
        });
    });

getResourceBundles = () :Promise<any>=> {
    
    return new Promise((resolve, reject)=>{
    var localeListArray = this.config.rbLocale.split('_');
    var rbPromise;
    var rbPromises = [];
    rbPromise = this.getResourceBundle(this.config.rbLocale);
    rbPromises.push(rbPromise);
    if (localeListArray.length === 2) {
        rbPromise = this.getResourceBundle(localeListArray[0]);
        rbPromises.push(rbPromise);
    }
    if (localeListArray[0] !== 'en') {
        //this.getResourceBundle('en_us');
        this.getResourceBundle('en');
    }
     Promise.all(rbPromises).then((data) => {
        this.resourceBundles = this._resourceBundle;
        resolve(data);
        //coremodule.constant('resourceBundles',this._resourceBundle);
    }, (error) => {
        this.resourceBundles = this._resourceBundle;
        reject(error);
        //can enter here due to 404
        //coremodule.constant('resourceBundles',this._resourceBundle);
    });
});
}
}