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
        console.log("swrbkey file");
		return {
			restrict: 'A',
			scope:{
				swRbkey:"="
			},
			link: function(scope, element, attrs){
				var rbKeyValue = scope.swRbkey;

				var bindRBKey = ()=>{
					if(angular.isDefined(rbKeyValue) && angular.isString(rbKeyValue)){
                        console.log(rbKeyValue)
                        console.log(rbkeyService.getRBKey(rbKeyValue));
                        console.log(element);
                        //console.log(element.text(rbkeyService.getRBKey(rbKeyValue)));
						element.text(rbkeyService.getRBKey(rbKeyValue));
					}
				}
                console.log("here");

				bindRBKey();
                
                console.log("here");

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
	selector: '[sw-rbkey]',
	providers : [RbKeyService]
})

export class SWRBKey implements OnInit {
        
    @Input() private swrbkey:any;
    
    constructor(
        //private $hibachi: $Hibachi,
        //private observerService : ObserverService,
        // private utilityService : UtilityService,
        // @Inject('$rootScope') private $rootScope : any ,
        // @Inject('$log') private  $log : any,
        private rbkeyService : RbKeyService,
        private el: ElementRef
    ) {
        
        console.log("here in swrbkey 2");
    }

    ngOnInit() {
		console.log("ngOnInit");    
		console.log(this.swrbkey); 
        this.bindRBKey();
    }
    
    bindRBKey = function(){
        console.log("here 2");
		let rbKeyValue = this.swrbkey;
		console.log(this.swrbkey);
        if(angular.isDefined(rbKeyValue) && angular.isString(rbKeyValue)){
            //angular.element.text(this.rbkeyService.getRBKey(rbKeyValue));
			console.log("here 3");
			//this.el.nativeElement.innerHTML = 'please select an option';
			this.el.nativeElement.innerHTML = this.rbkeyService.getRBKey(rbKeyValue);
        }
    }
    
    
}