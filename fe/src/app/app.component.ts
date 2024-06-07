import { Component, enableProdMode } from '@angular/core';
import { Helpers } from './helpers';
import { environment } from '../environments/environment';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'bootDash';
}
