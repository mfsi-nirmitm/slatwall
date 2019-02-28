/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
import { Injectable,Inject } from "@angular/core";
//import { $Hibachi } from "./hibachiService";
import { RequestService } from "./requestservice";
import {AppConfig} from "../../../../../../admin/client/src/app.provider";

@Injectable() 
export class CurrencyService {
    private currencySymbols:any;
    private currencySymbolsPromise:any;
    
    constructor(
        //private $hibachi : $Hibachi,
        private requestService: RequestService,
        private appConfig: AppConfig
    ) {
        //console.log(this.$hibachi);
        //this.getCurrencySymbols();
    }

    getPrefixUrl = () => {
        return this.appConfig.baseURL+'/index.cfm/?'+this.appConfig.action+"=";
    }
    
    getCurrencies = () =>{
        var urlString = this.getPrefixUrl()+'api:main.getCurrencies&instantiationKey='+this.appConfig.instantiationKey;
        let request = this.requestService.newAdminRequest(urlString);

        return request.promise;
    };
    
    getCurrencySymbols = () => {
        this.getCurrencies().then((currencies) => {
            this.currencySymbols = currencies.data;
        });    
    };
    
    getCurrencySymbolsPromise = () => {
        if(!this.currencySymbolsPromise) {
            this.currencySymbolsPromise = this.getCurrencies();  
        }
        
        return this.currencySymbolsPromise;
    };
    
    setCurrencySymbols = (currencySymbols) => {
        this.currencySymbols = currencySymbols;
    };
    
    hasCurrencySymbols = () => {
        if(this.currencySymbols) {
            return true;   
        }
        else {
            return false;
        }
    };
    
    getCurrencySymbol = (currencyCode: string) => {
        let temp = this.currencySymbols[currencyCode];
        return this.currencySymbols[currencyCode];
    };    
} 