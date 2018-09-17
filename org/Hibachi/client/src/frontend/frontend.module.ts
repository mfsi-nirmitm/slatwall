/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/hibachiTypescript.d.ts" />
//modules
import {hibachimodule} from "../hibachi/hibachi.module";
import {HibachiModule} from "../hibachi/hibachi.module";

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UpgradeModule, downgradeInjectable} from '@angular/upgrade/static';
import { HttpClientModule } from "@angular/common/http";
import {BrowserModule} from '@angular/platform-browser';

//controllers
import {FrontendController} from './controllers/frontend';

//directives
import {SWFDirective} 		from "./components/swfdirective";
import {SWShippingCostEstimator} from "./components/swshippingcostestimator";
import {SWFCartItems} from "./components/swfcartitems";
import {SWFPromoBox} from "./components/swfpromobox";
import {SWFNavigation} from "./components/swfnavigation";
import {SWFAddressForm} from "./components/swfaddressform";
import {SWFSaveNotes} from "./components/swfsavenotes";
//import {AppConfig,ResourceBundles,AttributeMetaData,AppProvider} from "../../../../../admin/client/src/app.provider";
//import {coremodule} from "../core/core.module";
//import { parseProvider,logProvider,filterProvider,timeoutProvider,qProvider,httpProvider,injectorProvider,windowProvider,rootScopeProvider,locationProvider,anchorScrollProvider } from "../../../../../admin/client/src/ajs-upgraded-providers";

@NgModule({
	declarations : [],
	providers : [
//        AppConfig,ResourceBundles,AttributeMetaData,AppProvider,
//        parseProvider,logProvider,filterProvider,timeoutProvider,qProvider,httpProvider,
//        injectorProvider,windowProvider,rootScopeProvider,locationProvider,anchorScrollProvider
    ],
	imports : [
        HttpClientModule,
        BrowserModule,
		
		//CommonModule,
		//UpgradeModule,
        HibachiModule
        
        
	]
})

export class FrontendModule{
	constructor(
//        private upgrade: UpgradeModule 
//        private appProvider:AppProvider,
//        private appConfig:AppConfig,
//        private resourceBundles:ResourceBundles,
//        private attributeMetaData:AttributeMetaData
        ){
		console.log("angualr 2 frontend ");
	}
    
    ngDoBootstrap() {
//          this.appProvider.hasData$.subscribe((hasData:boolean)=>{ 
//          console.log(hasData);
//          if(hasData){ 
//            console.log(this.appConfig);
//            console.log(this.resourceBundles);
//            console.log(this.attributeMetaData);
//            coremodule.constant('appConfig',this.appConfig)
//            coremodule.constant('resourceBundles',this.resourceBundles)
//            coremodule.constant('attributeMetaData',this.attributeMetaData)
//            this.upgrade.bootstrap(document.body, [frontendmodule.name], { strictDi: true });
//          }
//        }) 
        

    }
}


declare var hibachiConfig:any;
//need to inject the public service into the rootscope for use in the directives.
//Also, we set the initial value for account and cart.

//var frontendmodule = angular.module('frontend',[]);

var frontendmodule = angular.module('frontend', [hibachimodule.name])
.config(['hibachiPathBuilder',(hibachiPathBuilder)=>{
    /** set the baseURL */ 
    console.log("angular 1 frontend");
	hibachiPathBuilder.setBaseURL('/');
    if(hibachiConfig && hibachiConfig.basePartialsPath){
        hibachiPathBuilder.setBasePartialsPath(hibachiConfig.basePartialsPath);
    }else{
        hibachiPathBuilder.setBasePartialsPath('custom/client/src/');
    }
    /** Sets the custom public integration point */
    if (hibachiConfig && hibachiConfig.apiSubsystemName){
        hibachiPathBuilder.setApiSubsystemName(hibachiConfig.apiSubsystemName);
    }

}])

.run(['$rootScope','publicService','hibachiPathBuilder','entityService', function($rootScope, publicService,hibachiPathBuilder,entityService) {
	$rootScope.slatwall = $rootScope.hibachiScope;
    
    $rootScope.slatwall.getProcessObject = entityService.newProcessObject;
    $rootScope.slatwall.getEntity = entityService.newEntity;
    //$rootScope.slatwall.$hibachi.appConfig.apiSubsystemName = hibachiPathBuilder.apiSubsystemName;
}])

//controllers
.controller('frontendController',FrontendController)
//directives
.directive('swfDirective', SWFDirective.Factory())
.directive('swfCartItems', SWFCartItems.Factory())
.directive('swfPromoBox',SWFPromoBox.Factory())
.directive('swfNavigation',SWFNavigation.Factory())
.directive('swfSaveNotes',SWFSaveNotes.Factory())
.directive('swfAddressForm',SWFAddressForm.Factory())

export{
	frontendmodule
}
