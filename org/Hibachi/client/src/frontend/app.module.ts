import {NgModule} from '@angular/core';

import { HttpClientModule } from "@angular/common/http";
import {BrowserModule} from '@angular/platform-browser';
import {UpgradeModule} from '@angular/upgrade/static';
import {FrontendModule,frontendmodule} from './frontend.module';

import {coremodule}  from  "../core/core.module";
import { parseProvider,logProvider,filterProvider,timeoutProvider,qProvider,httpProvider,injectorProvider,windowProvider,rootScopeProvider,locationProvider,anchorScrollProvider } from "../../../../../admin/client/src/ajs-upgraded-providers";  
import {AppProvider,AppConfig,ResourceBundles,AttributeMetaData} from "../../../../../admin/client/src/app.provider";


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
    anchorScrollProvider
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    UpgradeModule,
    FrontendModule
  ],
  declarations:[
  ],
  entryComponents: [
  ]
})
export class AppModule { 
  constructor(
    private upgrade: UpgradeModule,
    private appProvider:AppProvider,
    private appConfig:AppConfig,
    private resourceBundles:ResourceBundles,
    private attributeMetaData:AttributeMetaData
  ) { 
    console.log("frontendmodule/appmodule");

  }
  ngDoBootstrap() {  
//    debugger;
        this.appProvider.fetchData().then(() => {
            for (var key in this.appProvider.appConfig) {

                this.appConfig[key] = this.appProvider.appConfig[key];
            }
            if (this.appProvider.attributeMetaData) {
                for (var key in this.appProvider.attributeMetaData) {
                    this.attributeMetaData[key] = this.appProvider.attributeMetaData[key];
                }
            }
            for (var key in this.appProvider._resourceBundle) {
                console.log(this.appProvider._resourceBundle);
                this.resourceBundles[key] = this.appProvider._resourceBundle[key];
            } 
            console.log(this.appProvider);
            this.appProvider.hasData = true;

        });
    this.appProvider.hasData$.subscribe((hasData:boolean)=>{ 
 
      console.log(hasData);
      if(hasData){ 
        console.log(this.appConfig);
        console.log(this.resourceBundles);
        console.log(this.attributeMetaData);
        coremodule.constant('appConfig',this.appConfig)
        coremodule.constant('resourceBundles',this.resourceBundles)
        coremodule.constant('attributeMetaData',this.attributeMetaData)
        //debugger;
        this.upgrade.bootstrap(document.body,[frontendmodule.name]);
        //debugger;
      }
    })
  }
}