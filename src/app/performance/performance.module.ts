import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PerformanceRoutingModule} from './performance-routing.module';
import {DemoPageComponent} from './pages/demo/demo-page.component';
import {ButtonComponent} from './components/button/button.component';
import {NgIfDirective} from './directives/ng-if/ng-if.directive';
import {ThrobberDirective} from './directives/throbber/throbber.directive';
import {CarouselDirective} from './directives/carousel/carousel.directive';
import {ThrobberComponent} from './components/throbber/throbber.component';

@NgModule({
  declarations: [ButtonComponent, DemoPageComponent, NgIfDirective, ThrobberDirective, ThrobberComponent, CarouselDirective],
  imports: [
    CommonModule,
    PerformanceRoutingModule
  ],
  entryComponents: [ThrobberComponent]
})
export class PerformanceModule {
}
