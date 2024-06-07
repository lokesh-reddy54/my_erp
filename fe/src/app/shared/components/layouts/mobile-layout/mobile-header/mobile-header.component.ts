import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DialogsService } from '../../../../services/dialogs.services';
import { ClientService } from '../../../../services/client.service';
import { AdminService } from '../../../../services/admin.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
	selector: 'app-header-mobile',
	templateUrl: './mobile-header.component.html'
})
export class MobileHeaderComponent implements OnInit {

	constructor(public router: Router, private dialogsService: DialogsService, private adminService: AdminService,
		private clientService: ClientService, public authService: AuthService) {
	}

	company: any = {};
	user: any = {};
	logo: any = "";
	notifications: any = [];
	roles: any = [];
	buildings: any = [];
	selectedBuilding: any = {};

	ngOnInit() {
		var user: any = window.localStorage.getItem("cwo_user");
		console.log("MobileHeaderComponent ::: user : ", user);
		this.user = user && JSON.parse(user);

		document.title = "HustleHub - MobileApp";
		this.logo = "https://static.wixstatic.com/media/5dde6e_b352f9f779424d748e52972493f62f7b~mv2.png";
		var domain = window.location.hostname;
		this.clientService.listCompanies({ filters: { getCompany: true, domain: domain } }).subscribe(
			res => {
				this.company = res['data'][0];
				if (this.company) {
					// this.logo = this.company.whiteLogo;
					if (this.company.primaryColor && this.company.accentColor) {
						document.documentElement.style.setProperty('--primary-color', this.company.primaryColor);
						document.documentElement.style.setProperty('--accent-color', this.company.accentColor);
					}
				}
			})

		var filters:any = {};
		if(this.user && this.user.geoTags && this.user.geoTags.buildingIds && this.user.geoTags.buildingIds.length){
			filters.buildingIds =  this.user.geoTags.buildingIds;
		}
		this.adminService.listBuildings({filters:filters}).subscribe(res => {
			this.buildings = res['data'];
			this.authService.buildings = res['data'];
		})

		if (this.user && this.user.roles && this.user.roles.workbenches) {
			if (this.user.roles.workbenches.buildingops) {
				this.roles.push({ name: 'Building Ops', type: 'buildingOps' });
			}
			if (this.user.roles.workbenches.projects) {
				this.roles.push({ name: 'Projects', type: 'projects' });
			}
			if (this.user.roles.workbenches.accounts) {
				this.roles.push({ name: 'Accounts', type: 'accounts' });
			}
			if (this.user.roles.workbenches.support) {
				this.roles.push({ name: 'Support', type: 'support' });
			}
			if (this.user.roles.workbenches.businessops) {
				this.roles.push({ name: 'Business Ops', type: 'businessOps' });
			}
		} else {
			this.roles = [
				// { name: 'Admin', type: 'admin' },
				{ name: 'Building Ops', type: 'buildingOps' },
				{ name: 'Projects', type: 'projects' },
				{ name: 'Accounts', type: 'accounts' },
				{ name: 'Support', type: 'support' },
				{ name: 'Business Ops', type: 'businessOps' },
			]
		}
		this.authService.userRoles = this.roles;
		console.log("mobile header ::: userRoles :: ", this.authService.userRoles);

		this.authService.selectedBuilding.subscribe(building => {
	      this.selectedBuilding = building;
	    })
	}

	updateRole(role) {
		this.authService.userRole.next(role);
	}
	updateBuilding(building) {
		this.selectedBuilding = building;
		this.authService.selectedBuilding.next(building);
	}

	gotoDashboards() {
		this.router.navigateByUrl('/mobile/dashboard');
	}

	signout() {
		this.authService.signout();
	}
}
