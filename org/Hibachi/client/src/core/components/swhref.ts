/// <reference path='../../../typings/hibachiTypescript.d.ts' />
/// <reference path='../../../typings/tsd.d.ts' />
class SWHref{
	public static Factory(){
		var directive = (

		)=>new SWHref(

		);
		directive.$inject = [

		];
		return directive;
	}
	constructor(

	){
        console.log("swhref angularjs constructor");
		return {
			restrict: 'A',
			scope:{
				swHref:"@"
			},
			link: function(scope, element,attrs){
				/*convert link to use hashbang*/
				var hrefValue = attrs.swHref;
                console.log(hrefValue);
				hrefValue = '?ng#!'+hrefValue;
				element.attr('href',hrefValue);
			}
		};
	}
}
export{
	SWHref
}

import { Directive,Input,ElementRef,OnInit } from '@angular/core';

@Directive({
    selector: '[sw-href]'    
})
export class SwHref implements OnInit {
        
    @Input() private swhref:any;
    
    constructor(
        private elementRef: ElementRef
    ) {
    }
    
    ngOnInit() {
        let hrefValue = this.swhref;
        console.log(hrefValue);
        this.elementRef.nativeElement.setAttribute("href", hrefValue);
    }
    
    
}

