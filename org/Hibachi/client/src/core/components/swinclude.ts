/*import {  Directive, Input,  ElementRef, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer} from '@angular/platform-browser';

import { HttpInterceptor } from "../services/httpinterceptor";

@Directive({
    selector: '[sw-include]'
})
export class SwInclude implements OnInit {

    //@Input() src: string;
    src: string = "/org/Hibachi/client/src/entity/components/Workflow/exp.html";

    constructor(private http: HttpInterceptor, private elementRef: ElementRef) {
        
    }

    ngOnInit() {
      if (!this.src) return;

      this.http.get(this.src).toPromise().then((res) => {
            console.log(res);
            console.log(res["_body"]);
            this.elementRef.nativeElement.innerHTML = res["_body"];
      });
    }
}*/

import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, ViewChild } from "@angular/core";

import { HeroDetailComponent } from "../../../../../../admin/client/src/slatwall/components/herodetail.component";

@Component({
    selector: 'sw-include',
    template: '<div #templateContent></div>'
})
export class SwInclude implements OnInit {

    //@Input('src')
    private templateUrl: string =  "/org/Hibachi/client/src/entity/components/Workflow/exp.html";

    @ViewChild('templateContent', { read: ViewContainerRef })
    protected contentTarget: ViewContainerRef;

    constructor(private componentResolver: ComponentFactoryResolver) {}

    ngOnInit() {
        var dynamicComponent = this.createContentComponent(this.templateUrl);
        const factory = this.componentResolver.resolveComponentFactory(HeroDetailComponent);
            //.then((factory: any) => this.contentTarget.createComponent(factory));
        const ref = this.contentTarget.createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    createContentComponent(templateUrl) {
        @Component({
            selector: 'my-ng-include-content',
            templateUrl: templateUrl//,
            //directives: FORM_DIRECTIVES,
        })
        class MyNgIncludeContent {}
        return MyNgIncludeContent ;
    }
}