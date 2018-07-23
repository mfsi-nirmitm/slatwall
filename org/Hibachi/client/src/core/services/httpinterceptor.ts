/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
import {Injectable, Inject} from "@angular/core";
import {LocalStorageService} from "./localstorageservice";
import {AlertService} from "../../alert/service/alertservice";
import {DialogService} from "../../dialog/services/dialogservice";
import {UtilityService} from "./utilityservice";
import {HibachiPathBuilder} from './hibachipathbuilder';
import {ObserverService} from './observerservice';
import {AppConfig} from "../../../../../../admin/client/src/app.provider";
import {    XHRBackend,
            ConnectionBackend, 
            RequestOptions, 
            Request, 
            RequestOptionsArgs, 
            Response, 
            Http, 
            Headers, 
            RequestMethod,
            URLSearchParams} from '@angular/http';
import {Observable} from "rxjs/Rx";
import 'rxjs/add/operator/catch';


@Injectable()
export class HttpInterceptor extends Http {
    public urlParam = null;
    public authHeader = 'Authorization';
    public authPrefix = 'Bearer ';
    public baseUrl: string;

    constructor(
        private backend: XHRBackend,
        private defaultOptions: RequestOptions,
        @Inject("$location") public $location: ng.ILocationService,
        @Inject("$q") public $q: ng.IQService,
        @Inject("$log") public $log: ng.ILogService,
        @Inject("$rootScope") public $rootScope,
        @Inject("$window") public $window,
        @Inject("$injector") public $injector: ng.auto.IInjectorService,
        public localStorageService: LocalStorageService,
        public alertService: AlertService,
        public appConfig: AppConfig,
        public dialogService: DialogService,
        public utilityService: UtilityService,
        public hibachiPathBuilder: HibachiPathBuilder,
        public observerService: ObserverService,

    ) {
        super(backend, defaultOptions);
        this.$location = $location;
        this.$q = $q;
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$window = $window;
        this.$injector = $injector;
        this.localStorageService = localStorageService;
        this.alertService = alertService;
        this.appConfig = appConfig;
        this.dialogService = dialogService;
        this.utilityService = utilityService;
        this.hibachiPathBuilder = hibachiPathBuilder;
        this.baseUrl = appConfig.baseURL;
    }

    private getJWTDataFromToken(str): void {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        str = str.split('.')[1];
        var decodedString = decodeURIComponent(this.$window.atob(str).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        var jwtData = angular.fromJson(decodedString);
        var now = +new Date();
        var nowString = now.toString().substr(0, jwtData.exp.toString().length);
        now = +nowString;
        if (jwtData.issuer && jwtData.issuer == this.$window.location.hostname && jwtData.exp > now) {
            if (!this.$rootScope.slatwall.account) {
                this.$rootScope.slatwall.account = {};
            }
            this.$rootScope.slatwall.account.accountID = jwtData.accountid;
        }
    }
    
    request(config: string|Request, options?: RequestOptionsArgs): Observable<Response>  {
        if (typeof config === 'string') { // meaning we have to add the token to the options, not in url
            if (!options) {
                // let's make option object
                options = {headers: new Headers()};
            }
            options.headers.set('Accept', `application/json, text/plain, */*`);
            //bypass interceptor rules when checking template cache
            if (config.charAt(0) !== '/') {
                return super.request(config, options);
            }
        } 
        else {
            // we have to add the token to the url object
            config.headers.set('Accept', 'application/json, text/plain, */*');
            //bypass interceptor rules when checking template cache
            if (config.url.charAt(0) !== '/') {
                return super.request(config, options);
            }
            if (config.method == RequestMethod.Get && config.url.indexOf('.html') >= 0 && config.url.indexOf('/') >= 0) {
                //all partials are bound to instantiation key
                config.url = config.url + '?instantiationKey=' + this.appConfig.instantiationKey;
                return super.request(config, options);
            }
            
            if (this.localStorageService.hasItem('token')) {
                config.headers.set('Auth-Token', 'Bearer ' + this.localStorageService.getItem('token'));
                this.getJWTDataFromToken(this.localStorageService.getItem('token'));
            }
            var queryParams = this.utilityService.getQueryParamsFromUrl(config.url);
            if (config.method == RequestMethod.Get && (queryParams[this.appConfig.action] && queryParams[this.appConfig.action] === 'api:main.get')) {
                this.$log.debug(config);
                config.method = RequestMethod.Post;
                config["_body"] = {};
                var data = {};
                if (angular.isDefined(config['params'])) {
                    data = config['params'];
                }

                var params = { 'serializedJsonData' : angular.toJson(data), 'context' : 'GET'  };
                
                config['_body'] = $.param(params);
                delete config['params'];
                config.headers.set('Content-Type', 'application/x-www-form-urlencoded');
                
            }
        }
            
        return super.request(config, options);
    }
    
}