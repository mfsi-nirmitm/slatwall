import {NgModule} from '@angular/core';
import {UpgradeModule} from '@angular/upgrade/static';
import {AppProvider,AppConfig,ResourceBundles,AttributeMetaData} from "../../../../admin/client/src/app.provider";
import {coremodule} from "./core/core.module";

@NgModule({
  providers: [
      AppProvider,
      AppConfig,
      ResourceBundles,
      AttributeMetaData
  ],
  imports: [
    UpgradeModule
  ],
  declarations:[],
  entryComponents: []
})

export class BaseBootstrap {
        
    constructor(
        private upgrade : UpgradeModule,
        private appProvider : AppProvider,
        private appConfig : AppConfig,
        private resourceBundles : ResourceBundles,
        private attributeMetaData : AttributeMetaData
    ) {
    }
    
    getData() {
        this.appProvider.hasData$.subscribe((hasData:boolean)=>{ 
          console.log(hasData);
          if(hasData){ 
            console.log(this.appConfig);
            console.log(this.resourceBundles);
            console.log(this.attributeMetaData);
            coremodule.constant('appConfig',this.appConfig)
            coremodule.constant('resourceBundles',this.resourceBundles)
            coremodule.constant('attributeMetaData',this.attributeMetaData)
            //this.upgrade.bootstrap(document.body,[slatwalladminmodule.name]);
          }
        })
    }
    
    
}