/// <reference path='../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../typings/tsd.d.ts' />

//module
import {coremodule} from "../core/core.module";
import {CoreModule} from "../core/core.module";

import {NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {UpgradeModule,downgradeInjectable, downgradeComponent} from '@angular/upgrade/static';

//services
import {FileService} from "./services/fileservice"; 

//directives

//  components

//form
import {SWInput, SwInput} from "./components/swinput";
import {SWFFormField} from "./components/swfformfield";
import {SWForm, SwForm} from "./components/swform";
import {SWFForm} from "./components/swfform";
import {SWFFileInput} from "./components/swffileinput";
import {SWFormField , SwFormField} from "./components/swformfield";
import {SWFormFieldFile} from "./components/swformfieldfile";
import {SWFormFieldJson} from "./components/swformfieldjson";
import {SWFormFieldSearchSelect} from "./components/swformfieldsearchselect";
import {SWFormRegistrar} from "./components/swformregistrar";
import {SWErrorDisplay, SwErrorDisplay} from "./components/swerrordisplay";
import {SWAddressForm} from "./components/swaddressform";
import {SWPropertyDisplay} from "./components/swpropertydisplay";
import {SWFPropertyDisplay} from "./components/swfpropertydisplay";
import {SWFormSubscriber} from "./components/swformsubscriber";
import {SwValidationRequired} from "../validation/components/swvalidationrequired";


@NgModule({
    declarations: [
        SwFormField,
        SwInput,
        SwValidationRequired,
        SwForm
//        SwErrorDisplay
    ],
    providers: [
        FileService
    ],  
    imports: [
        FormsModule,
        CommonModule,
        UpgradeModule,
        CoreModule,
        ReactiveFormsModule
    ],
    exports: [
        SwFormField
    ],
    entryComponents: [
        SwForm,
        SwFormField
        
//        SwErrorDisplay
    ]  
})

export class FormModule{
    constructor() {
        
    }    
}


var formmodule = angular.module('hibachi.form',['angularjs-datetime-picker',coremodule.name]).config(()=>{

})
.constant('coreFormPartialsPath','form/components/')

.service('fileService',downgradeInjectable(FileService))
//directives
.directive('swInput',SWInput.Factory())
.directive('swfFormField',SWFFormField.Factory())
.directive('swForm',SWForm.Factory())
.directive('swFormUpgraded', downgradeComponent({ component: SwForm }) as angular.IDirectiveFactory )
.directive('swfForm',SWFForm.Factory())
.directive('swfFileInput',SWFFileInput.Factory())
.directive('swFormField',SWFormField.Factory())
.directive('swFormFieldUpgraded', downgradeComponent({ component: SwFormField }) as angular.IDirectiveFactory)   
.directive('swFormFieldFile',SWFormFieldFile.Factory())
.directive('swFormFieldJson',SWFormFieldJson.Factory())
.directive('swFormFieldSearchSelect',SWFormFieldSearchSelect.Factory())
.directive('swFormRegistrar',SWFormRegistrar.Factory())
.directive('swfPropertyDisplay',SWFPropertyDisplay.Factory(SWFPropertyDisplay,"swfpropertydisplay.html"))
.directive('swPropertyDisplay',SWPropertyDisplay.Factory(SWPropertyDisplay,"propertydisplay.html"))
.directive('swErrorDisplay',SWErrorDisplay.Factory())
//.directive('swErrorDisplay', downgradeComponent({ component: SwErrorDisplay }) as angular.IDirectiveFactory) 
.directive('swAddressForm',SWAddressForm.Factory())
.directive('swFormSubscriber',SWFormSubscriber.Factory());

export{
	formmodule
}