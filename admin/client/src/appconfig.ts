import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';

declare var hibachiConfig:any;
var md5 = require('md5');

@Injectable()
export class AppConfig{
    private config: any;
    private attributeMetaData:any;
    private instantiationKey:string;
    private _resourceBundle = {};
    private resourceBundles;
    
    constructor(@Inject('$http') private http: any, @Inject('$q') private $q:any) {

    }
    
    public fetchData(){
        var baseURL = hibachiConfig.baseURL;
        if(!baseURL) {
            baseURL = ''
        }
        if(baseURL.length && baseURL.slice(-1) !== '/'){
            baseURL += '/';
        }

       return this.getInstantiationKey(baseURL).then((instantiationKey:string)=>{
            this.instantiationKey = instantiationKey;
            var invalidCache = [];
            try{
                var hashedData = localStorage.getItem('attributeChecksum');
                if(hashedData !== null && hibachiConfig.attributeCacheKey === hashedData.toUpperCase()){
                    this.attributeMetaData = JSON.parse(localStorage.getItem('attributeMetaData'));
                    //coremodule.constant('attributeMetaData',JSON.parse(localStorage.getItem('attributeMetaData')));
                }else{
                    invalidCache.push('attributeCacheKey');
                }
            }catch(e){
                invalidCache.push('attributeCacheKey');
            }

            try{
                this.config = JSON.parse(localStorage.getItem('appConfig'));
                if(hibachiConfig.instantiationKey === this.config.instantiationKey){
                    return this.getResourceBundles();
                }else{
                    invalidCache.push('instantiationKey');
                }
            }catch(e){
                invalidCache.push('instantiationKey');
            }

            return this.getData(invalidCache);
        });
        
    }

    getInstantiationKey(baseURL:string):ng.IPromise<any>{
        return this.$q((resolve, reject)=> {
            if(hibachiConfig.instantiationKey){
                resolve(hibachiConfig.instantiationKey);
            }else{

                this.http.get(baseURL+'?'+hibachiConfig.action+'=api:main.getInstantiationKey').then((resp:any) => resolve(resp.data.data.instantiationKey));

            }
        });
    };


    getData(invalidCache:string[]){
        var promises:{[id:string]:ng.IPromise<any>} ={};
        for(var i in invalidCache){
            var invalidCacheName = invalidCache[i];
            var functionName = invalidCacheName.charAt(0).toUpperCase()+invalidCacheName.slice(1);
            promises[invalidCacheName] = this['get'+functionName+'Data']();

        }
        return this.$q.all(promises);
    };

    getAttributeCacheKeyData = ()=>{
        var urlString = "";

        if(!hibachiConfig){
            hibachiConfig = {};
        }

        if(!hibachiConfig.baseURL){
            hibachiConfig.baseURL = '';
        }
        urlString += hibachiConfig.baseURL;

        if(urlString.length && urlString.slice(-1) !== '/'){
            urlString += '/';
        }

        return this.http.get(urlString+'?'+hibachiConfig.action+'=api:main.getAttributeModel')
        .then( (resp:any)=> {
            this.attributeMetaData = resp.data.data;
            //coremodule.constant('attributeMetaData',resp.data.data);
            //for safari private mode which has no localStorage
            try{
                localStorage.setItem('attributeMetaData',JSON.stringify(resp.data.data));
                localStorage.setItem('attributeChecksum',md5(JSON.stringify(resp.data.data)));
            }catch(e){}
            this.attributeMetaData = resp.data.data;
        });

    };

    getInstantiationKeyData = ()=>{
        if(!this.instantiationKey){
            var d = new Date();
            var n = d.getTime();
            this.instantiationKey = n.toString();
        }
        var urlString = "";
        if(!hibachiConfig){
            hibachiConfig = {};
        }
        if(!hibachiConfig.baseURL){
            hibachiConfig.baseURL = '';
        }
        urlString += hibachiConfig.baseURL;
        if(hibachiConfig.baseURL.length && hibachiConfig.baseURL.charAt(hibachiConfig.baseURL.length-1) != '/'){
            urlString+='/';
        }

        return this.http.get(urlString+'/custom/config/config.json?instantiationKey='+this.instantiationKey)
        .then( (resp:any)=> {
        	var appConfig = resp.data.data;
            if(hibachiConfig.baseURL.length){
                appConfig.baseURL=urlString;    
            }
            this.config = resp.data.data;
            //coremodule.constant('appConfig',resp.data.data);
            try{
                localStorage.setItem('appConfig',JSON.stringify(resp.data.data));
            }catch(e){}
            this.config = appConfig;
            return this.getResourceBundles();
        });

    };

    getResourceBundle= (locale) => {
        var deferred = this.$q.defer();
        var locale = locale || this.config.rbLocale;

        if(this._resourceBundle[locale]) {
            return this._resourceBundle[locale];
        }

        var urlString = this.config.baseURL+'/custom/config/resourceBundles/'+locale+'.json?instantiationKey='+this.config.instantiationKey;

        this.http({
            url:urlString,
            method:"GET"
        }).success((response:any,status,headersGetter) => {
            this._resourceBundle[locale] = response;
            deferred.resolve(response);
        }).error((response:any,status) => {
            if(status === 404){
                this._resourceBundle[locale] = {};
                deferred.resolve(response);
            }else{
                deferred.reject(response);
            }
        });
        return deferred.promise
    };

    getResourceBundles= () => {
        var localeListArray = this.config.rbLocale.split('_');
        var rbPromise;
        var rbPromises = [];
        rbPromise = this.getResourceBundle(this.config.rbLocale);
        rbPromises.push(rbPromise);
        if(localeListArray.length === 2) {
            rbPromise = this.getResourceBundle(localeListArray[0]);
            rbPromises.push(rbPromise);
        }
        if(localeListArray[0] !== 'en') {
            //this.getResourceBundle('en_us');
            this.getResourceBundle('en');
        }
        return this.$q.all(rbPromises).then((data) => {
            this.resourceBundles = this._resourceBundle;
            //coremodule.constant('resourceBundles',this._resourceBundle);
        },(error) =>{
            this.resourceBundles = this._resourceBundle;
            //can enter here due to 404
            //coremodule.constant('resourceBundles',this._resourceBundle);
        });

    }
}