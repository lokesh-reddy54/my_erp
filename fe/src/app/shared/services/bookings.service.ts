import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from "@angular/common/http";
import { Helpers } from "../../helpers";

import * as _ from "lodash";

declare let $: any;
@Injectable()
export class BookingsService {
	httpOptions;

	constructor(private httpClient: HttpClient) {
		if (localStorage.getItem("cwo_user") && localStorage.getItem("cwo_user") != "") {
			var user = JSON.parse(localStorage.getItem("cwo_user"));
			var companyId = user && user.companyId ? user.companyId : 1;
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
					'Content-Type': 'application/json',
					'companyid': "1" // need to make it dynamic
				})
			}
		}
	}

	listResourceBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/listResourceBookings", data, this.httpOptions)
	}
	listBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/listBookings", data, this.httpOptions)
	}
	listParkingBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/listParkingBookings", data, this.httpOptions)
	}
	listClients(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/listClients", data, this.httpOptions).pipe(
                map(response => response['data'])
              )
	}
	searchBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/searchBookings", data, this.httpOptions)
	}
	getBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/getBookings", data, this.httpOptions)
	}
	saveBooking(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveBooking", data, this.httpOptions)
	}
	getBooking(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getBooking/" + id, this.httpOptions)
	}
	getBookingExitRequest(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getBookingExitRequest/" + id, this.httpOptions)
	}
	cancelBooking(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/cancelBooking/" + id, this.httpOptions)
	}
	settleShortTermBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/settleShortTermBookings", data, this.httpOptions)
	}
	extendedContract(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/extendedContract", data, this.httpOptions)
	}
	requestExit(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/requestExit", data, this.httpOptions)
	}
	saveAcr(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveAcr", data, this.httpOptions)
	}
	saveDeduction(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveDeduction", data, this.httpOptions)
	}
	saveExitComment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveExitComment", data, this.httpOptions)
	}
	saveExitRequest(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveExitRequest", data, this.httpOptions)
	}
	approveFinalStatement(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/approveFinalStatement", data, this.httpOptions)
	}
	acceptFinalStatement(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/acceptFinalStatement", data, this.httpOptions)
	}
	cancelExitRequest(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/cancelExitRequest/" + id, this.httpOptions)
	}
	getInvoices(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getInvoices/" + id, this.httpOptions)
	}
	getAllInvoices(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/getAllInvoices", data, this.httpOptions)
	}
	raiseInvoices(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/raiseInvoices", data, this.httpOptions)
	}
	raiseNextMonthInvoice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/raiseNextMonthInvoice", data, this.httpOptions)
	}
	generateAgreement(bookingId: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/generateAgreement/" + bookingId, this.httpOptions)
	}
	updateBookingsLedger(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/updateBookingsLedger", data, this.httpOptions)
	}
	sendInvoice(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/sendInvoice/" + id, this.httpOptions)
	}
	updateInvoiceStatus(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/updateInvoiceStatus", data, this.httpOptions)
	}
	cancelInvoice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/cancelInvoice",data, this.httpOptions)
	}
	saveInvoice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveInvoice", data, this.httpOptions)
	}
	vacateOffice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/vacateOffice",data, this.httpOptions)
	}
	getPayments(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getPayments/" + id, this.httpOptions)
	}
	getContracts(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getContracts/" + id, this.httpOptions)
	}
	savePayment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/savePayment", data, this.httpOptions)
	}
	saveUrnPayment(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveUrnPayment", data, this.httpOptions)
	}
	getResourceBookings(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getResourceBookings/" + id, this.httpOptions)
	}
	getEmployees(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getEmployees/" + id, this.httpOptions)
	}
	deleteBooking(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/deleteBooking/" + id, this.httpOptions)
	}


	searchOffices(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/searchOffices", data, this.httpOptions)
	}
	searchParking(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/searchParking", data, this.httpOptions)
	}
	createBooking(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/createBooking", data, this.httpOptions)
	}
	createParkingBooking(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/createParkingBooking", data, this.httpOptions)
	}
	saveContract(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveContract", data, this.httpOptions)
	}
	saveContractTerm(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveContractTerm", data, this.httpOptions)
	}
	saveAdditionalInvoice(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveAdditionalInvoice", data, this.httpOptions)
	}
	saveClient(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveClient", data, this.httpOptions)
	}
	saveBookedDesk(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveBookedDesk", data, this.httpOptions)
	}
	saveEmployee(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveEmployee", data, this.httpOptions)
	}
	sendEmployeeVerification(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/sendEmployeeVerification", data, this.httpOptions)
	}
	bookingExpansion(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/bookingExpansion", data, this.httpOptions)
	}
	bookingContraction(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/bookingContraction", data, this.httpOptions)
	}
	bookingRelocation(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/bookingRelocation", data, this.httpOptions)
	}


	searchResources(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/searchResources", data, this.httpOptions)
	}
	createResourceBooking(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/createResourceBooking", data, this.httpOptions)
	}
	saveResourceBooking(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveResourceBooking", data, this.httpOptions)
	}
	getBookingCreditHistory(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getBookingCreditHistory/" + id, this.httpOptions)
	}
	getBuildingMeetingRoomPaxPrice(officeId: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getBuildingMeetingRoomPaxPrice/" + officeId, this.httpOptions)
	}
	deleteCreditEntry(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/deleteCreditEntry/" + id, this.httpOptions)
	}
	saveCreditEntry(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveCreditEntry", data, this.httpOptions)
	}
	saveCreditUsed(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveCreditUsed", data, this.httpOptions)
	}
	updateFreeCredits(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/updateFreeCredits", data, this.httpOptions)
	}


	getSchedules(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/getSchedules", data, this.httpOptions)
	}
	getSchedule(id: any) {
		return this.httpClient.get(Helpers.composeEnvUrl() + "internal/bookings/getSchedule/" + id, this.httpOptions)
	}
	saveSchedule(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/saveSchedule", data, this.httpOptions)
	}
	
	getContractRenewalBookings(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/getContractRenewalBookings", data, this.httpOptions)
	}
	renewContract(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/renewContract", data, this.httpOptions)
	}
	refundLiability(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/refundLiability", data, this.httpOptions)
	}
	updateRentFreePeriod(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/updateRentFreePeriod", data, this.httpOptions)
	}


	getClientGSTinfo(data: any) {
		return this.httpClient.post(Helpers.composeEnvUrl() + "internal/bookings/getClientGSTinfo/", data, this.httpOptions)
	}
}