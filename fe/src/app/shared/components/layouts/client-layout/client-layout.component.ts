import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';

@Component({
	selector: 'app-client-layout',
	templateUrl: './client-layout.component.html'
})
export class ClientLayoutComponent implements OnInit {

	moduleLoading: boolean;
	constructor(private router: Router) { }

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
				this.moduleLoading = true;
			}
			if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
				this.moduleLoading = false;
			}
		});
	}

}
