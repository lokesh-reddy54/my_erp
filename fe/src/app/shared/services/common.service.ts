import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class CommonService {
	httpOptions;
	floorplanOpen: boolean = false;


	values: any = {
		vendorContactDesignations: ['CEO/Director', 'Internal Auditor', 'Sr.Finance Manager', 'Accounts Manager', 'Marketing Manager', 'Operational Manager'],
		leadDeadReasons: [
			{ name: 'High Price' },
			{ name: 'Didnt Liked' },
			{ name: 'Not Available' },
			{ name: 'Terms not Matched' }
		],
		externalSystems: [
			{ type: 'OutBoundMail', name: 'Out Bound Mails' },
			{ type: 'InBoundMail', name: 'In Bound Mails' },
			{ type: 'PaymentGateway', name: 'Payment Gateways' },
			{ type: 'PayoutGateway', name: 'Payout Gateways' },
			{ type: 'SMSGateway', name: 'SMS Gateways' },
			{ type: 'PushNotification', name: 'Push Notifications' },
			{ type: 'WhatsApp', name: 'WhatsApp Messages' },
		],
		ticketAssigneeTypes:[
			{name:'General Support', type:'GST', buildingLevel: 0},
			{name:'Bookings Management', type:'BMT', buildingLevel: 0},
			{name:'Accounts', type:'ACC', buildingLevel: 0},
			{name:'RelationShip Management', type:'RMT', buildingLevel: 1},
			{name:'House Keeping', type:'HOK', buildingLevel: 1},
			{name:'Security', type:'SEC', buildingLevel: 1},
			{name:'Building Supervisor', type:'BUS', buildingLevel: 1},
			{name:'Internet Handling', type:'INT', buildingLevel: 1},
			{name:'Electrician', type:'ELEC', buildingLevel: 1},
			{name:'Plumber', type:'PLUM', buildingLevel: 1},
			{name:'Air Condition', type:'ACON', buildingLevel: 1},
			{name:'Furniture & Appliances', type:'FNA', buildingLevel: 1},
			{name:'Carpentry', type:'CARP', buildingLevel: 1},
		],
		ticketSupportLevels:[
			{type:'FirstLine', name:'First Line'},
			{type:'SecondLine', name:'Second Line'},
			{type:'Third Line', name:'Third  Line'},
  		],
			parkingTypes: [
				{ type: 'CarParking', name: 'Car Parking' },
				{ type: 'BikeParking', name: 'Bike Parking' }
			],					
		officeStatuses: [
			{ type: 'UnderConsideration', name: 'Under Consideration' },
			{ type: 'AgreementInprogress', name: 'Agreement Inprogress' },
			{ type: 'AgreementSigned', name: 'Agreement Signed' },
			{ type: 'Live', name: 'Live' },
			{ type: 'Dephased', name: 'Dephased' }
		],
		deskSizes: [
			{ type: 'VeryMinimal', name: 'Very Minimal' },
			{ type: 'Minimal', name: 'Minimal' },
			{ type: 'Standard', name: 'Standard' },
			{ type: 'Luxury', name: 'Luxury' },
			{ type: 'SuperLuxury', name: 'Super Luxury' },
			{ type: 'Custom', name: 'Custom' }
		],
		deskTypes: [
			// { type: 'FlexiDesk', name: 'Flexi Desks', frequencies: ['Daily', 'Weekly', 'Monthly', 'Weekends', 'Nights'] },
			// { type: 'FixedDesk', name: 'Fixed Desks', frequencies: ['Daily', 'Weekly', 'Monthly', 'Weekends', 'Nights'] },
			{
				type: 'EnterpriseOffice', name: 'Managed Space', types: [
					{
						type: 'BareShell', name: 'BareShell', inclusions: [
							{ value: 'MainPower', label: 'Main Power', default: true },
							{ value: 'BackUpPower', label: 'BackUp Power', default: true }
						]
					},
					{
						type: 'WarmShell', name: 'WarmShell', inclusions: [
							{ value: 'MainPower', label: 'Main Power', default: true },
							{ value: 'BackUpPower', label: 'BackUp Power', default: true },
							{ value: 'WashRooms', label: 'Wash Rooms', default: true },
							{ value: 'ACOutdoorUnits', label: 'AC Outdoor Units', default: true },
						]
					},
					{
						type: 'Furnished', name: 'Furnished', inclusions: [
							{ value: 'MainPower', label: 'Main Power', default: true },
							{ value: 'BackUpPower', label: 'BackUp Power', default: true },
							{ value: 'WashRooms', label: 'Wash Rooms', default: true },
							{ value: 'ACOutdoorUnits', label: 'AC Outdoor Units', default: true },
							{ value: 'Flooring', label: 'Flooring', default: true },
							{ value: 'Furniture', label: 'Furniture', default: true },
						]
					},
					{
						type: 'FurnishedPartiallyManaged', name: 'Furnished and Partially Managed', inclusions: [
							{ value: 'MainPower', label: 'Main Power', default: true },
							{ value: 'BackUpPower', label: 'BackUp Power', default: true },
							{ value: 'WashRooms', label: 'Wash Rooms', default: true },
							{ value: 'ACOutdoorUnits', label: 'AC Outdoor Units', default: true },
							{ value: 'Flooring', label: 'Flooring', default: true },
							{ value: 'Furniture', label: 'Furniture', default: true },
							{
								services: [
									{ value: 'Security', label: 'Security', default: false },
									{ value: 'HouseKeeping', label: 'HouseKeeping', default: false },
									{ value: 'Internet', label: 'Internet', default: false },
									{ value: 'Beverages', label: 'Beverages', default: false },
									{ value: 'DrinkingWater', label: 'Drinking Water', default: false },
									{ value: 'AC', label: 'AC', default: false },
									{ value: 'Cafeteria', label: 'Cafeteria', default: false },
									{ value: 'MeetingRooms', label: 'Shared Meeting Rooms', default: false },
								]
							}
						]
					},
					{
						type: 'FurnishedFullyManaged', name: 'Furnished and Fully Managed', inclusions: [
							{ value: 'MainPower', label: 'Main Power', default: true },
							{ value: 'BackUpPower', label: 'BackUp Power', default: true },
							{ value: 'WashRooms', label: 'Wash Rooms', default: true },
							{ value: 'ACOutdoorUnits', label: 'AC Outdoor Units', default: true },
							{ value: 'Flooring', label: 'Flooring', default: true },
							{ value: 'Furniture', label: 'Furniture', default: true },
							{
								services: [
									{ value: 'Security', label: 'Security', default: true },
									{ value: 'HouseKeeping', label: 'HouseKeeping', default: true },
									{ value: 'Internet', label: 'Internet', default: true },
									{ value: 'Beverages', label: 'Beverages', default: true },
									{ value: 'DrinkingWater', label: 'Drinking Water', default: true },
									{ value: 'AC', label: 'AC', default: true },
									{ value: 'Cafeteria', label: 'Cafeteria', default: true },
									{ value: 'MeetingRooms', label: 'Shared Meeting Rooms', default: true },
								]
							}
						]
					},
				]
			},
			{ type: 'PrivateOffice', name: 'CoWorking Space', types:[{ type: 'monthlyRecurring', name: 'Monthly Recurring'}, { type: 'DayPasses', name: 'Day Passes'}]},
			{ type: 'VirtualOffice', name: 'Virtual Office' },						 
		],
		lotTypes: [
			{ type: 'CarParking', name: 'Car Parking' },
			{ type: 'BikeParking', name: 'Bike Parking' }
		],
		invoiceTypes: [
			{ type: 'Deposit', name: 'Deposit', isLiability: 1 },
			{ type: 'HotDeskRent', name: 'Hot Desk Rent', monthly: 1 },
			{ type: 'FixedDeskRent', name: 'Fixed Desk Rent', monthly: 1 },
			{ type: 'OfficeRent', name: 'Office Rent', monthly: 1 },
			{ type: 'ResourcCharge', name: 'Charge for Resource', isLiability: 0 },
			{ type: 'LockinPenalty', name: 'Charge for Lockin Violation', isLiability: 0 },
			{ type: 'NoticePeroidPenalty', name: 'Charge for Notice Period Violation', isLiability: 0 },
		],
		paymentTypes: [
			{ type: 'Online', name: 'Online Payment' },
			{ type: 'BankTransfer', name: 'NEFT/IMPS Payment' },
			{ type: 'Cash', name: 'Cash Payment' },
		],
		contactPurposes: [
			{ type: 'CompanyAdmin', name: 'Company Admin' },
			{ type: 'LocalAdmin', name: 'Local Admin' },
			{ type: 'Accounts', name: 'Accounts' },
			{ type: 'Legal', name: 'Legal' },
			{ type: 'SeniorManagement', name: 'Senior Management' },
			{ type: 'JuniorManagement', name: 'Junior Management' },
			{ type: 'ITManager', name: 'IT Manager' },
			{ type: 'SupportManager', name: 'Support Manager' },
		],
		departments: [
			{ department: 'HMT', name: 'Higher Management' },
			{ department: 'Admin', name: 'Admin Team' },
			{ department: 'HR', name: 'HR Team' },
			{ department: 'Accounts', name: 'Accounting Team' },
			{ department: 'Operations', name: 'Operations Team' },
			{ department: 'Sales', name: 'Sales Team' },
		],
		resourceTypes: [
			{
				type: 'MeetingRoom', name: 'Meeting Room', subUnitsLabel: 'Seating',
				styles: [{ type: 'Formal', name: 'Formal' },
				{ type: 'InFormal', name: 'InFormal' },
				{ type: 'BoardRoom', name: 'Board Room' },
				{ type: 'UShape', name: 'UShape' },
				{ type: 'Banquet', name: 'Banquet' },
				{ type: 'Auditorium', name: 'Auditorium' },
				{ type: 'ClassRoom', name: 'ClassRoom' }],
				subUnitTypes: [{ type: 'RestBack', name: 'RestBack' },
				{ type: 'HighBar', name: 'HighBar' },
				{ type: 'HeadRest', name: 'HeadRest' }],
				facilities: [{ type: '32InchTV', name: '32 Inch TV' },
				{ type: '52InchTV', name: '52 Inch TV' },
				{ type: 'WhiteBoard', name: 'White Board' },
				{ type: 'ColoredPens', name: 'Colored Pens' },
				{ type: 'Projector', name: 'Projector' },
				{ type: 'ScreenCast', name: 'ScreenCast' }]
			},
			{ type: 'ConferenceRoom', name: 'Conference Room' },
			{ type: 'Snocker', name: 'Snocker Room' },
			{ type: 'CricketPitch', name: 'Cricket Pitch' },
			{ type: 'GamesRoom', name: 'Games Room' },
			{ type: 'Lounge', name: 'Lounge Space' },
			{ type: 'PartyHall', name: 'Party Hall' },
		],
		leadSources: [
			{
				source: "OnlineAds",
				name: "Online Ads",
				attributes: [
					{ attribute: "GoogleAds", name: "Google Ads" },
					{ attribute: "FacebookAds", name: "Facebook Ads" },
				]
			}, {
				source: "Portals",
				name: "Website Portals",
				attributes: [
					{ attribute: "Sneed", name: "Sneed" },
					{ attribute: "CoSphere", name: "CoSphere" },
				]
			}, {
				source: "SocialMedia",
				name: "Social Media",
				attributes: [
					{ attribute: "Facebook", name: "Facebook" },
					{ attribute: "Twitter", name: "Twitter" },
					{ attribute: "Instagram", name: "Instagram" },
				]
			}, {
				source: "Offline",
				name: "Offline",
				attributes: [
					{ attribute: "WalkIn", name: "WalkIn" },
					{ attribute: "Agent", name: "Agent" },
					{ attribute: "Poster", name: "Poster" },
					{ attribute: "WordOfMouth", name: "Word of Mouth" },
				]
			}
		]
	}

	constructor(private httpClient: HttpClient) {
		if (localStorage.getItem("cwo_user") && localStorage.getItem("cwo_user") != "") {
			var user = JSON.parse(localStorage.getItem("cwo_user"));
			var companyId = user && user.companyId ? user.companyId : 1;
			var timezone: any = new Date().getTimezoneOffset();
			timezone = Math.floor(timezone / 60) + ":" + (timezone % 60);
			var headers = {
				'Content-Type': 'application/json',
				'companyid': companyId + ""
			}
			if (user && user.token) {
				headers['Authorization'] = user.token;
			}
			this.httpOptions = {
				headers: new HttpHeaders(headers)
			};
		} else {
			this.httpOptions = {
				headers: new HttpHeaders({
					'Content-Type': 'application/json'
				})
			}
		}
	}

	getLoggedUser() {
		return JSON.parse(localStorage.getItem('cwo_user'));
	}

	checkAccess(elements: any) {
		var user = JSON.parse(localStorage.getItem('cwo_user'));
		var flag = false;
		var roles = user.roles;
		if (!roles) {
			return true;
		}
		if(elements){
			elements = elements.split(":");
			// console.log("CommonService ::: checkAccess :: roles : ", roles);
			console.log("CommonService ::: checkAccess :: elements : ", elements);
			if (elements[0] && elements[1] && roles[elements[0]][elements[1]]) {
				flag = true;
			}
		}
		return flag;
	}

	static checkAccess(elements: any) {
		var user = JSON.parse(localStorage.getItem('cwo_user'));
		var flag = false;
		var roles = user.roles;
		if (!roles) {
			return true;
		}
		elements = elements.split(":");
		// console.log("CommonService ::: checkAccess :: roles : ", roles);
		// console.log("CommonService ::: checkAccess :: elements : ", elements);
		if (roles[elements[0]][elements[1]]) {
			flag = true;
		}
		return flag;
	}

	fetchList(url: string, offset: number, limit: number, filter: any, sortBy: string, sortOrder: string) {
		console.log()
		return this.httpClient.post(Helpers.composeEnvUrl() + url, {
			offset: offset,
			limit: limit,
			filters: filter,
			sortBy: sortBy,
			sortOrder: sortOrder
		}, this.httpOptions)
	}

	upload(data: any) {
		var user = JSON.parse(localStorage.getItem("cwo_user"));
		return this.httpClient.post(Helpers.composeEnvUrl() + 'image_upload/' + user.id, data)
	}
	uploadPPT(data: any) {
		var user = JSON.parse(localStorage.getItem("cwo_user"));
		return this.httpClient.post(Helpers.composeEnvUrl() + 'convert_ppt/' + user.id, data)
	}

}