/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWExp{
    public static Factory(){
        var directive:ng.IDirectiveFactory = (
            $log,
            $hibachi,
            observerService,
            corePartialsPath,
            hibachiPathBuilder
        )=> new SWExp(
            $log,
            $hibachi,
            observerService,
            corePartialsPath,
            hibachiPathBuilder
        );
        directive.$inject = [
            '$log',
            '$hibachi',
            'observerService',
            'corePartialsPath',
            'hibachiPathBuilder'
        ];
        return directive;
    }
    constructor(
        $log,
        $hibachi,
        observerService,
        corePartialsPath,
        hibachiPathBuilder
    ){

        return {
            restrict: 'AE',
            scope:{
            //    swExp: "="
            },
            templateUrl:hibachiPathBuilder.buildPartialsPath(corePartialsPath)+"exp.html",
            //templateUrl: "/org/Hibachi/client/src/core/components/exp.html",
            //template: `<h1>This is Experimental</h1>`,
            link: function(scope, element,attrs){
                console.log("angularjs exp component");
            }
        };
    }
}
export{
    SWExp
}

import { Injector, OnChanges, DoCheck, OnDestroy, SimpleChanges,Inject, Directive, ElementRef, OnInit } from '@angular/core';
import {  UpgradeComponent, downgradeComponent } from '@angular/upgrade/static';

@Directive({
    selector: '[sw-exp]'
})
export class SWEXP extends UpgradeComponent implements OnInit, OnChanges, DoCheck, OnDestroy {
    
    constructor(@Inject(ElementRef) elementRef: ElementRef,@Inject(Injector) injector: Injector) {
        super('swExp',elementRef,injector);
        //super(SWRbKey,elementRef,injector);
    }    
  // For this class to work when compiled with AoT, we must implement these lifecycle hooks
  // because the AoT compiler will not realise that the super class implements them
  ngOnInit() { super.ngOnInit(); }
  ngOnChanges(changes: SimpleChanges) { super.ngOnChanges(changes); }
  ngDoCheck() { super.ngDoCheck(); }
  ngOnDestroy() { super.ngOnDestroy(); }
}
