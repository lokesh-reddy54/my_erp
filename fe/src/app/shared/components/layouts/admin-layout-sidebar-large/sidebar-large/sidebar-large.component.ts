import { Component, OnInit, HostListener } from '@angular/core';
import { NavigationService, IMenuItem, IChildItem } from '../../../../services/navigation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Utils } from '../../../../utils';

@Component({
	selector: 'app-sidebar-large',
	templateUrl: './sidebar-large.component.html'
})
export class SidebarLargeComponent implements OnInit {

	selectedItem: IMenuItem;

	nav: IMenuItem[];
	user: any = {};

	constructor(
		public router: Router,
		public navService: NavigationService
	) {
		this.user = JSON.parse(localStorage.getItem("cwo_user"));
	}

	ngOnInit() {
		this.updateSidebar();
		// CLOSE SIDENAV ON ROUTE CHANGE
		this.router.events.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((routeChange) => {
				this.closeChildNav();
				if (Utils.isMobile()) {
					this.navService.sidebarState.sidenavOpen = false;
				}
			});

		this.navService.menuItems$
			.subscribe((items) => {
				this.nav = items;
				this.setActiveFlag();
			});
		var userType = 'admin';
		if (this.user.clientId) {
			userType = 'client';
			// this.router.navigateByUrl('/client/visits');
			// this.router.navigateByUrl('/dashboards/client');			
		} else {
			// this.router.navigateByUrl('/dashboards/main');			
		}
		// this.navService.publishNavigationChange(userType);
		// this.navService.publishNavigationChange(userType, this.user.roles);
	}

	selectItem(item) {
		this.navService.sidebarState.childnavOpen = true;
		this.selectedItem = item;
		this.setActiveMainItem(item);
	}
	closeChildNav() {
		this.navService.sidebarState.childnavOpen = false;
		this.setActiveFlag();
	}

	onClickChangeActiveFlag(item) {
		this.setActiveMainItem(item);
	}
	setActiveMainItem(item) {
		this.nav.forEach(item => {
			item.active = false;
		});
		item.active = true;
	}

	setActiveFlag() {
		if (window && window.location) {
			const activeRoute = window.location.hash || window.location.pathname;
			this.nav.forEach(item => {
				item.active = false;
				if (activeRoute.indexOf(item.state) !== -1) {
					this.selectedItem = item;
					item.active = true;
				}
				if (item.sub) {
					item.sub.forEach(subItem => {
						subItem.active = false;
						if (activeRoute.indexOf(subItem.state) !== -1) {
							this.selectedItem = item;
							item.active = true;
						}
						if (subItem.sub) {
							subItem.sub.forEach(subChildItem => {
								if (activeRoute.indexOf(subChildItem.state) !== -1) {
									this.selectedItem = item;
									item.active = true;
									subItem.active = true;
								}
							});
						}
					});
				}
			});
		}
	}

	updateSidebar() {
		if (Utils.isMobile()) {
			this.navService.sidebarState.sidenavOpen = false;
			this.navService.sidebarState.childnavOpen = false;
		} else {
			this.navService.sidebarState.sidenavOpen = true;
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.updateSidebar();
	}

}
