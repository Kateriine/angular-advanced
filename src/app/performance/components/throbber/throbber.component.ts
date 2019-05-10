import { Attribute, Component } from '@angular/core';

@Component({
  selector: 'throbber-component',
  templateUrl: './throbber.component.html',
  styleUrls: ['./throbber.component.scss'],
})
export class ThrobberComponent {
  constructor(@Attribute('throbberClass') public throbberClass: string = '') {}
}
