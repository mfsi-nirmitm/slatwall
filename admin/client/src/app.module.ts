import {NgModule, Injectable} from '@angular/core';

import { HttpClientModule } from "@angular/common/http";
import {BrowserModule} from '@angular/platform-browser';
import {UpgradeModule,downgradeInjectable} from '@angular/upgrade/static';
import {HeroDetailComponent} from './slatwall/components/herodetail.component';
import {slatwalladminmodule} from './slatwall/slatwalladmin.module';

import {CoreModule,coremodule}  from  "../../../org/Hibachi/client/src/core/core.module";
import {LoggerModule} from "../../../org/Hibachi/client/src/logger/logger.module";
import { parseProvider,logProvider,filterProvider,timeoutProvider,qProvider,httpProvider,injectorProvider,windowProvider,rootScopeProvider,locationProvider,anchorScrollProvider,routeParamsProvider } from "./ajs-upgraded-providers";  
import {SlatwallAdminModule} from "./slatwall/slatwalladmin.module";
import {AppProvider,AppConfig,ResourceBundles,AttributeMetaData} from "./app.provider";

import { SWRBKEY,SwRbKey } from "../../../org/Hibachi/client/src/core/components/swrbkey";
import { SwDetail } from "../../../org/Hibachi/client/src/entity/components/swdetail";
import { SwHref } from "../../../org/Hibachi/client/src/core/components/swhref";
import { SwInclude } from "../../../org/Hibachi/client/src/core/components/swinclude";
import { SWEXP } from "../../../org/Hibachi/client/src/core/components/swexp";


@NgModule({
  providers: [
    AppProvider,
    AppConfig,
    ResourceBundles,
    AttributeMetaData,
    parseProvider,
    logProvider,
    filterProvider,
    timeoutProvider,
    qProvider,
    httpProvider,
    windowProvider,
    rootScopeProvider,
    locationProvider,
    anchorScrollProvider,
    routeParamsProvider
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    UpgradeModule,
    CoreModule,
    LoggerModule,
    SlatwallAdminModule
  ],
  declarations:[
      HeroDetailComponent,
      SwRbKey,
      SwDetail,
      SwHref,
      SwInclude,
      SWEXP
  ],
  entryComponents: [
    HeroDetailComponent,
      SwDetail
  ]
})
export class AppModule { 
  constructor(
    private upgrade: UpgradeModule, 
    private appProvider:AppProvider,
    private appConfig:AppConfig,
    private resourceBundles:ResourceBundles,
    private attributeMetaData:AttributeMetaData
  ) { }
  ngDoBootstrap() {  
    this.appProvider.hasData$.subscribe((hasData:boolean)=>{ 
      console.log(hasData);
      if(hasData){ 
        console.log(this.appConfig);
        console.log(this.resourceBundles);
        console.log(this.attributeMetaData);
        coremodule.constant('appConfig',this.appConfig)
        coremodule.constant('resourceBundles',this.resourceBundles)
        coremodule.constant('attributeMetaData',this.attributeMetaData)
        this.upgrade.bootstrap(document.body,[slatwalladminmodule.name]);
      }
    })
    
    /*setTimeout( () => {
    
    console.log('bootstrap',this.appProvider);
    console.log(this.appConfig);
    console.log(this.resourceBundles);
    console.log(this.attributeMetaData);
     coremodule.constant('appConfig',this.appConfig)
     coremodule.constant('resourceBundles',this.resourceBundles)
     coremodule.constant('attributeMetaData',this.attributeMetaData)
     this.upgrade.bootstrap(document.body,[slatwalladminmodule.name]);
     }, 200 );*/
  }
}