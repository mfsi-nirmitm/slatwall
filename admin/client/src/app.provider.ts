import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

declare var hibachiConfig: any;
var md5 = require('md5');
@Injectable()
export class AppConfig {
    constructor() {
    }
}
@Injectable()
export class ResourceBundles {
    constructor() {
    }
}

@Injectable()
export class AttributeMetaData {
    constructor() {
    }
}

@Injectable()
export class AppProvider {
    public appConfig;
    public _resourceBundle = {};
    public attributeMetaData: any;
    public instantiationKey: string;

    constructor(private http: HttpClient) {
    }


    public fetchData(): Promise<any> {

        return new Promise((resolve, reject) => {



            var baseURL = hibachiConfig.baseURL;
            if (!baseURL) {
                baseURL = ''
            }
            if (baseURL.length && baseURL.slice(-1) !== '/') {
                baseURL += '/';
            }

            this.getInstantiationKey(baseURL)
                .then((instantiationKey: string) => {
                    debugger;
                    this.instantiationKey = instantiationKey;

                    var invalidCache = [];
                    try {
                        var hashedData = localStorage.getItem('attributeChecksum');
                        if (hashedData !== null && hibachiConfig.attributeCacheKey === hashedData.toUpperCase()) {
                            this.attributeMetaData = JSON.parse(localStorage.getItem('attributeMetaData'));
                        } else {
                            invalidCache.push('attributeCacheKey');
                        }
                    } catch (e) {
                        invalidCache.push('attributeCacheKey');
                    }
                    var loadResourceBundle: boolean = false;
                    try {
                        this.appConfig = JSON.parse(localStorage.getItem('appConfig'));
                        if (hibachiConfig.instantiationKey !== this.appConfig.instantiationKey) {
                            
invalidCache.push('instantiationKey');
                            
                        } 
                    } catch (e) {
                        invalidCache.push('instantiationKey');
                    }

                    if(invalidCache.length){
                        this.getData(invalidCache)
                        .then(() => {
                            debugger;
                            resolve();
                        }, ()=>{
                        resolve();    
                        });

              
                    }
                    else{
                        this.getResourceBundles().then(() => {
                                resolve();
                            }, ()=>{
                                    resolve();

                            });       
                    
                    }

                }, () => resolve()).catch();

        });

    }

    public getInstantiationKey(baseURL: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (hibachiConfig.instantiationKey) {
                resolve(hibachiConfig.instantiationKey);
            } else {

                this.http.get(baseURL + '?' + hibachiConfig.action + '=api:main.getInstantiationKey').subscribe((resp: any) => resolve(resp.data.instantiationKey));

            }
        });
    };


    public getData(invalidCache: string[]): Promise<any> {
        debugger;
        var promises: any = [];
        for (var i in invalidCache) {
            var invalidCacheName = invalidCache[i];
            var functionName = invalidCacheName.charAt(0).toUpperCase() + invalidCacheName.slice(1);
            promises.push(this['get' + functionName + 'Data']());

        }
        return Promise.all(promises);
    };

    public getAttributeCacheKeyData(): Promise<any> {
        debugger;
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
        return this.http.get(urlString + '?' + hibachiConfig.action + '=api:main.getAttributeModel')
            .toPromise()
            .then((resp: any) => {
                debugger;

                //coremodule.constant('attributeMetaData',resp.data.data);
                //for safari private mode which has no localStorage
                try {
                    localStorage.setItem('attributeMetaData', JSON.stringify(resp.data));
                    localStorage.setItem('attributeChecksum', md5(JSON.stringify(resp.data)));
                } catch (e) { }
                this.attributeMetaData = resp.data;
            });

    };

    public getInstantiationKeyData(): Promise<any> {

        return new Promise((resolve, reject) => {
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
            this.http.get(urlString + '/custom/config/config.json?instantiationKey=' + this.instantiationKey)
                .toPromise()
                .then((resp: any) => {
                    debugger;


                    var appConfig = resp.data;
                    if (hibachiConfig.baseURL.length) {
                        appConfig.baseURL = urlString;
                    }
                    //coremodule.constant('appConfig',resp.data.data);
                    try {
                        localStorage.setItem('appConfig', JSON.stringify(resp.data));
                    } catch (e) { }
                    this.appConfig = appConfig;

                    this.getResourceBundles()
                        .then(() => {
                            resolve();
                        })
                        .catch(() => {
                            reject();
                        });
                })
                .catch(() => {
                    reject();
                });

        });

    };

    public getResourceBundle(locale): Promise<any> | any {
        debugger;
        var locale = locale || this.appConfig.rbLocale;

        var urlString = this.appConfig.baseURL + '/custom/config/resourceBundles/' + locale + '.json?instantiationKey=' + this.appConfig.instantiationKey;
        //return new Promise((resolve,reject)=>{
        return this.http.get(urlString).toPromise().then((response: any) => {
            console.log("resource sucess", response);

            debugger;
            this._resourceBundle[locale] = response;
            //resolve(true);
        }, (error: any) => {
            console.log("resource error", error);
            if (error.status === 404) {
                this._resourceBundle[locale] = {};
                //resolve(true);
            } else {
                //reject(true);
            }
        });
        //});
    };

    public getResourceBundles(): Promise<any> {

        var localeListArray = this.appConfig.rbLocale.split('_');
        var rbPromises = [];
        rbPromises.push(this.getResourceBundle('en'));
        if (localeListArray.length === 2) {
            rbPromises.push(this.getResourceBundle(localeListArray[0]));
        }
        if (localeListArray[0] !== 'en') {
            //            rbPromises.push(this.getResourceBundle('en_us'));
            rbPromises.push(this.getResourceBundle('en'));
        }

        return Promise.all(rbPromises);

    }
}
