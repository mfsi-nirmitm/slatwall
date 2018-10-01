import { Component } from '@angular/core';
import {  UpgradeComponent, downgradeComponent } from '@angular/upgrade/static';
import { SWRbKey } from '../../../../../org/Hibachi/client/src/core/components/swrbkey';

@Component({
  selector: 'hero-detail',
  template: `
    <h2>Windstorm details!</h2>
    <div [sw-rbkey]="'entity.Product.option.select'"><label>id: </label>1</div>
  `
})
export class HeroDetailComponent extends UpgradeComponent {
    constructor(elementRef: ElementRef, injector: Injector) {
        super();
    }    
}