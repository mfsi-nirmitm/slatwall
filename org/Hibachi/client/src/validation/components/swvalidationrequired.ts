/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
/**
 * Returns true if the uservalue is empty and false otherwise
 */
import {ValidationService} from "../services/validationservice";
class SWValidationRequired{
    //@ngInject
    constructor(validationService:ValidationService){

        return {
            restrict: "A",
            require: "^ngModel",
            link: function(scope, element, attributes, ngModel) {
                //debugger;
                ngModel.$validators.swvalidationrequired =
                function (modelValue, viewValue) {

                    var value = modelValue || viewValue;
                    
                    if(attributes.swvalidationrequired === "true"){
                        //debugger;
                        console.log(validationService.validateRequired(value));
                        return validationService.validateRequired(value);
                    } else { 
                        //debugger;
                        return true; 
                    }
                    
                };
            }
        };
    }
    public static Factory(){
        var directive = (validationService)=>new SWValidationRequired(validationService);
        directive.$inject = ['validationService'];
        return directive;
    }
}
export{
    SWValidationRequired
}


import { Directive, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Directive({
    selector : '[swvalidationrequired]'    
})
export class SwValidationRequired implements OnInit {
    
    @Input() value_required;
    
    control: FormControl;
    
    constructor() {
        
    }
    
    ngOnInit() {
        console.log(this.value_required);
        this.control = new FormControl('', [Validators.required]);
        debugger;
    }
    
}