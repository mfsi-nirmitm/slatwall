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
        console.log("swrbkey angualrjs constructor");
		return {
			restrict: 'A',
			scope:{
				swRbkey:"="
			},
            template:``,
			link: function(scope, element, attrs){
				var rbKeyValue = scope.swRbkey;
                console.log("rbkey directive angular js");
				var bindRBKey = ()=>{
                    console.log(rbKeyValue);
                    console.log(rbkeyService.getRBKey(rbKeyValue));
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

import { Directive,Inject,Input,ElementRef, OnInit } from "@angular/core";

import { $Hibachi } from "../services/hibachiservice";
import { ObserverService } from "../services/observerservice";
import { UtilityService } from "../services/utilityservice";
import { RbKeyService } from "../services/rbkeyservice";

@Directive({
    selector: '[sw-rbkey]'
})

export class SwRbKey implements OnInit {
        
    @Input() private swRbkey:any;
    
    constructor(
        private rbkeyService : RbKeyService,
        private el: ElementRef
    ) {
        
    }

    ngOnInit() {
        this.bindRBKey();
    }
    
    bindRBKey = function(){
        let rbKeyValue = this.swRbkey;
        if(angular.isDefined(rbKeyValue) && angular.isString(rbKeyValue)){
            console.log(rbKeyValue);
            console.log(this.rbkeyService.getRBKey(rbKeyValue));
            this.el.nativeElement.innerHTML = this.rbkeyService.getRBKey(rbKeyValue);
        }
    }
    
    
}

import { Injector, OnChanges, DoCheck, OnDestroy, SimpleChanges } from '@angular/core';
import {  UpgradeComponent, downgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: '[sw-rbkey]'
})
export class SWRBKEY extends UpgradeComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
    
    @Input() swRbkey:any;
    
    constructor(@Inject(ElementRef) elementRef: ElementRef,@Inject(Injector) injector: Injector) {
        super('swRbkey',elementRef,injector);
        //super(SWRbKey,elementRef,injector);
    }    
  // For this class to work when compiled with AoT, we must implement these lifecycle hooks
  // because the AoT compiler will not realise that the super class implements them
  ngOnInit() { super.ngOnInit(); }
  ngOnChanges(changes: SimpleChanges) { super.ngOnChanges(changes); }
  ngDoCheck() { super.ngDoCheck(); }
  ngOnDestroy() { super.ngOnDestroy(); }
}