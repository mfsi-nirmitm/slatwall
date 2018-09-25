/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWRbKey{
	public static Factory(){
		var directive = (
			$hibachi,
			observerService,
			utilityService,
			$rootScope,
			$log,
            rbkeyService
		)=> new SWRbKey(
			$hibachi,
			observerService,
			utilityService,
			$rootScope,
			$log,
            rbkeyService
		);
		directive.$inject = [
			'$hibachi',
			'observerService',
			'utilityService',
			'$rootScope',
			'$log',
            'rbkeyService'
		];
		return directive;
	}
	constructor(
		$hibachi,
		observerService,
		utilityService,
		$rootScope,
		$log,
        rbkeyService
	){
		return {
			restrict: 'A',
			scope:{
				swRbkey:"="
			},
			link: function(scope, element, attrs){
				var rbKeyValue = scope.swRbkey;

				var bindRBKey = ()=>{
					if(angular.isDefined(rbKeyValue) && angular.isString(rbKeyValue)){
						element.text(rbkeyService.getRBKey(rbKeyValue));
					}
				}


				bindRBKey();

			}
		};
	}
}
export{
	SWRbKey
}

import { Directive,Inject,Input,ElementRef,OnInit } from "@angular/core";

import { $Hibachi } from "../services/hibachiservice";
import { ObserverService } from "../services/observerservice";
import { UtilityService } from "../services/utilityservice";
import { RbKeyService } from "../services/rbkeyservice";

@Directive({
    selector: '[sw-rbkey]'
})

export class SwRbKey implements OnInit {
        
    @Input() private swrbkey:any;
    
    constructor(
        private rbkeyService : RbKeyService,
        private el: ElementRef
    ) {
        
    }

    ngOnInit() {
        this.bindRBKey();
    }
    
    bindRBKey = function(){
        let rbKeyValue = this.swrbkey;
        if(angular.isDefined(rbKeyValue) && angular.isString(rbKeyValue)){
            this.el.nativeElement.innerHTML = this.rbkeyService.getRBKey(rbKeyValue);
        }
    }
    
    
}