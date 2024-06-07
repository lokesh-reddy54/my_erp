import { Component, OnInit } from '@angular/core';
import { DialogsService } from '../../../../services/dialogs.services';
import { ClientService } from '../../../../services/client.service';

@Component({
	selector: 'app-header-selfcare',
	templateUrl: './selfcare-header.component.html'
})
export class SelfcareHeaderComponent implements OnInit {

	constructor(private dialogsService: DialogsService, private clientService: ClientService) {

	}

	company: any = {}
	logo: any = "";
	ngOnInit() {

		var domain = window.location.hostname;
		this.clientService.listCompanies({ filters: { getCompany: true, domain: domain } }).subscribe(
			res => {
				this.company = res['data'][0];
				if (this.company) {
					this.logo = this.company.logo;
					document.title = this.company.name + " - SelfCare";
					if (this.company.primaryColor && this.company.accentColor) {
						document.documentElement.style.setProperty('--primary-color', this.company.primaryColor);
						document.documentElement.style.setProperty('--accent-color', this.company.accentColor);
					}
				} else {
					this.logo = "./assets/images/flogo.png";
				}
			})
	}
}
