/// <reference path='../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../typings/tsd.d.ts' />
//services
// import {AccountService} from "./services/accountservice";
// import {CartService} from "./services/cartservice";
// import {UtilityService} from "./services/utilityservice";
// import {SelectionService} from "./services/selectionservice";
// import {ObserverService} from "./services/observerservice";
// import {FormService} from "./services/formservice";
// import {MetaDataService} from "./services/metadataservice";
//controllers
import {OtherWiseController} from "./controllers/otherwisecontroller";
import {RouterController} from "./controllers/routercontroller";
//directives
import {SWDetailTabs} from "./components/swdetailtabs";
import {SWDetail,SwDetail} from "./components/swdetail";
import {SWList} from "./components/swlist";

//modules
import {coremodule} from "../core/core.module";
import {CoreModule} from "../core/core.module";

import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UpgradeModule,downgradeInjectable,downgradeComponent} from '@angular/upgrade/static';

@NgModule({
    declarations : [
    //    SwDetail
    ],
    providers :[
        {
            provide  : 'CoreEntityPartialsPath',
            useValue : 'entity/components/'
        }
    ],
    imports :[
        CoreModule,
        CommonModule,
        UpgradeModule
    ]
})

export class EntityModule {
    constructor() {
        
    }    
}

declare var $:any;

var entitymodule = angular.module('hibachi.entity',['ngRoute',coremodule.name])
.config(['$routeProvider','$injector','$locationProvider','appConfig',
($routeProvider,$injector,$locationProvider,appConfig)=>{
     //detect if we are in hashbang mode
    console.log("entity module angular js");
     var vars:any = {};
    console.log(window.location);
    console.log(window.location.href);
     var parts:any = window.location.href.replace(/[?&]+([^=&]+)#([^/]*)/gi, (m:any,key:string,value:string):any=> {
        vars[key] = value;
        console.log(key,value);
     });

     if(vars.ng){
         $locationProvider.html5Mode( false ).hashPrefix('!');
     }
    
    var snakeToCapitalCase = (s)=>{
        console.log(s);
        console.log(s.charAt(0).toUpperCase() + s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();}).slice(1));
        return s.charAt(0).toUpperCase() + s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();}).slice(1);
    }

    $routeProvider.when('/entity/:entityName/', {
         template: function(params){
             console.log(params);
             var entityDirectiveExists = $injector.has('sw'+snakeToCapitalCase(params.entityName)+'ListDirective');
             console.log(entityDirectiveExists);
             if(entityDirectiveExists){
                 return '<sw-'+params.entityName.toLowerCase()+'-list></sw-'+params.entityName.toLowerCase()+'-list>';
             }else{
                 return '<sw-list></sw-list>';
             }
         },
         controller: 'routerController'
     }).when('/entity/:entityName/:entityID', {
         template: function(params){
             
             console.log(params);
             var entityDirectiveExists = $injector.has('sw'+snakeToCapitalCase(params.entityName)+'DetailDirective');
             console.log(entityDirectiveExists);
             if(entityDirectiveExists){
                 return '<sw-'+params.entityName.toLowerCase()+'-detail></sw-'+params.entityName.toLowerCase()+'-detail>';
             }else{
                 console.log("return swdetail component");
                 return '<sw-detail></sw-detail>';
             }
         },
         controller: 'routerController',
     })
//        .otherwise({
//         //controller:'otherwiseController'
//         templateUrl: appConfig.baseURL + '/admin/client/js/partials/otherwise.html',
//     });
}])
.constant('coreEntityPartialsPath','entity/components/')
//services

//controllers
.controller('otherwiseController',OtherWiseController)
.controller('routerController',RouterController)
//filters

//directives
//.directive('swDetail',SWDetail.Factory())
.directive('swDetail', downgradeComponent({ component: SwDetail }) as angular.IDirectiveFactory)
.directive('swDetailTabs',SWDetailTabs.Factory())
.directive('swList',SWList.Factory())
//components

;
export{
	entitymodule
}
