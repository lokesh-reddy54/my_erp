import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DialogsService } from '../../../../services/dialogs.services';
import { ClientService } from '../../../../services/client.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
	selector: 'app-header-client',
	templateUrl: './client-header.component.html'
})
export class ClientHeaderComponent implements OnInit {

	constructor(public router: Router, private dialogsService: DialogsService,
		private clientService: ClientService, public authService: AuthService) {
	}

	company: any = {};
	user: any = {};
	logo: any = "";
	myBookings: any = [];
	ngOnInit() {
		var user: any = window.localStorage.getItem("cwo_user");
		console.log("ClientHeaderComponent ::: user : ", user);
		this.user = user && JSON.parse(user);

		document.title = "HustleHub - " + this.user.clientCompany;
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
	}
	viewBooking() {
		if (this.authService.myBookings.length == 1) {
			this.router.navigateByUrl('/client/booking/' + this.authService.myBookings[0].id);
		} else {
			this.router.navigateByUrl('/client/bookings');
		}
	}
	viewEmployees() {
		if (this.authService.myBookings.length == 1) {
			this.router.navigateByUrl('/client/employees/' + this.authService.myBookings[0].id);
		} else {
			this.router.navigateByUrl('/client/bookings');
		}
	}
	viewCredits() {
		if (this.authService.myBookings.length == 1) {
			this.router.navigateByUrl('/client/credits/' + this.authService.myBookings[0].id);
		} else {
			this.router.navigateByUrl('/client/bookings');
		}
	}

	signout() {
		this.authService.signout();
	}
}
