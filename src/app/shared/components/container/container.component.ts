import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-container',
  imports: [],
  template: `
    <div class="container">
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './container.component.scss'
})
export class ContainerComponent {

}
