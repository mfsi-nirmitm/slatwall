/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />

/**
* Form Controller handles the logic for this directive.
*/
import {SWPropertyDisplayController} from "./swpropertydisplay";
import {SWFPropertyDisplayController} from "./swfpropertydisplay";
import {SWFormController} from "./swform";

class SWErrorDisplayController {
    public swPropertyDisplay:SWPropertyDisplayController;
    public swfPropertyDisplay:SWFPropertyDisplayController;
    public swForm:SWFormController;
    public property:string;
    public propertyIdentifier:string;
    public name:string;
    public form;
    //@ngInject
   constructor(public $injector){
       this.$injector = $injector;
   }
   public $onInit(){
       var objectKeys = Object.keys;
       console.log(this.form);
       this.form["workflowName"].$error = {"hahaha":true};
       console.log(objectKeys(this.form["workflowName"].$error)[0]);
       debugger;
       /**
        if a css error class was passed to propertyDisplay, attach to form
        which will apply it to the dynamically generateddiv that contains
        the error message 
       **/
       if(this.swfPropertyDisplay && this.swfPropertyDisplay.errorClass){
            this.swForm.errorClass = this.swfPropertyDisplay.errorClass;
       }
       
       var bindToControllerProps = this.$injector.get('swErrorDisplayDirective')[0].bindToController;
		for(var i in bindToControllerProps){
            debugger;
			if(!this[i] && i !== 'name'){
                
				if(!this[i] && this.swPropertyDisplay && this.swPropertyDisplay[i]){
					this[i] = this.swPropertyDisplay[i];
                    debugger;
				}else if(!this[i] && this.swfPropertyDisplay && this.swfPropertyDisplay[i]){
					this[i] = this.swfPropertyDisplay[i];
                    debugger;
				}else if(!this[i] && this.swForm && this.swForm[i]){
					this[i] = this.swForm[i];
                    debugger;
				}
			}
		}

        this.property = this.property || this.propertyIdentifier;
        this.propertyIdentifier = this.propertyIdentifier || this.property;
        if(!this.name && this.property){
            this.name = this.property;
        }
   }
}

class SWErrorDisplay implements ng.IDirective {
    public templateUrl:string;
    public require={
        swForm:"^?swForm",
        form:"^?form",
        swPropertyDisplay:"^?swPropertyDisplay",
        swfPropertyDisplay:"^?swfPropertyDisplay"
    }
    public restrict="E";
    public controller = SWErrorDisplayController;
    public controllerAs = "swErrorDisplay";
    public scope = {};
    public bindToController={
        form:"=?",
        name:"@?",
        property:"@?",
        propertyIdentifier:"@?",
        errorClass:"@?"
    }

    // @ngInject
    constructor( public coreFormPartialsPath, public hibachiPathBuilder) {
        this.templateUrl = hibachiPathBuilder.buildPartialsPath(this.coreFormPartialsPath) + "errordisplay.html";
        console.log(this.templateUrl);
    }

    public static Factory(){
		var directive = (
		 	coreFormPartialsPath,
				hibachiPathBuilder
		)=>new SWErrorDisplay(
			coreFormPartialsPath,
			hibachiPathBuilder
		);
		directive.$inject = [
			'coreFormPartialsPath',
			'hibachiPathBuilder'
		];
		return directive;
	}

}
export{
    SWErrorDisplay,
    SWErrorDisplayController
}



import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector   : 'sw-error-display',
    templateUrl: '/org/Hibachi/client/src/form/components/errordisplay.html'    
})
export class SwErrorDisplay implements OnInit {
    
    @Input() private propertyidentifier;
    @Input() private form;
    private property;
    private name;
    private objectKeys;

    ngOnInit() {
               
        /*var bindToControllerProps = this.$injector.get('swErrorDisplayDirective')[0].bindToController;
        for(var i in bindToControllerProps){
            debugger;
            if(!this[i] && i !== 'name'){
                
                if(!this[i] && this.swPropertyDisplay && this.swPropertyDisplay[i]){
                    this[i] = this.swPropertyDisplay[i];
                    debugger;
                }else if(!this[i] && this.swfPropertyDisplay && this.swfPropertyDisplay[i]){
                    this[i] = this.swfPropertyDisplay[i];
                    debugger;
                }else if(!this[i] && this.swForm && this.swForm[i]){
                    this[i] = this.swForm[i];
                    debugger;
                }
            }
        } */

        
        console.log(this.form);
        debugger;
        this.property = this.property || this.propertyidentifier;
        this.propertyidentifier = this.propertyidentifier || this.property;
        if(!this.name && this.property){
            this.name = this.property;
        }
        
        this.objectKeys = Object.keys;
        console.log(this.form);
        //this.form["workflowName"].$error = {"hahaha":true};
        //console.log(this.objectKeys(this.form[this.name].$error)[0]);
        debugger;
    }
}