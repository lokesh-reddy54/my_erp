import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject, Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	isSameDay,
	isSameMonth
} from 'date-fns';
import { CalendarAppEvent } from 'src/app/shared/models/calendar-event.model';
import { Utils } from 'src/app/shared/utils';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { SupportService } from 'src/app/shared/services/support.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { UploadService } from 'src/app/shared/services/upload.service';
import * as moment from "moment";
import * as _ from "lodash";

@Component({
	selector: 'support-calendar',
	templateUrl: './calendar.component.html',
	animations: [SharedAnimations]
})
export class SupportCalendarComponent implements OnInit {

	messageForm: FormGroup;
	searchControl: FormControl = new FormControl();
	public type: any = 'OnBoarding';
	public loading: any = false;
	public search: any = '';
	public view: any = 'month';
	public viewDate = new Date();
	@ViewChild('ticketModal') ticketModal;
	@ViewChild('exitModal') exitModal;
	public activeDayIsOpen = true;
	public refresh: Subject<any> = new Subject();
	public events: CalendarAppEvent[];
	private actions: CalendarEventAction[];
	private colors: any = {
		red: {
			primary: '#f44336',
			secondary: '#FAE3E3'
		},
		blue: {
			primary: '#247ba0',
			secondary: '#D1E8FF'
		},
		green: {
			primary: '#54bd05',
			secondary: '#54bd05'
		},
		orange: {
			primary: '#ffc107',
			secondary: '#ffc107'
		}
	};
	ticket: any = {};

	user: any = {};
	constructor(private modalService: NgbModal, private uploadService: UploadService,
		private service: SupportService, private dialogs: DialogsService) {
		this.actions = [{
			label: '<i class="i-Edit m-1 text-secondary"></i>',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.handleEvent('edit', event);
			}
		}];
	}

	ngOnInit() {
		this.messageForm = new FormGroup({
			comment: new FormControl("", Validators.required)
		});
		var user = localStorage.getItem("cwo_user");
		if (user && user != '') {
			this.user = JSON.parse(user);
		}

		this.searchControl.valueChanges
			.pipe(debounceTime(200))
			.pipe(take(1)).subscribe(value => {
				// this.loadEvents();
			});

		this.loadEvents();
	}

	initEvents(events): CalendarAppEvent[] {
		return events.map(event => {
			event.actions = this.actions;
			var e = new CalendarAppEvent(event);
			e.draggable = false;
			e.resizable = null;
			return e;
		});
	}

	loadEvents() {
		var data = {
			filters: {
				pendingClosed: true,
				from: moment(this.viewDate).startOf(this.view),
				to: moment(this.viewDate).endOf(this.view),
			}
		}
		// console.log("SchedulesComponent :: loadEvents : data : ", data);
		var self = this;
		self.service.listTickets(data).pipe(take(1)).subscribe(
			res => {
				var events = [];
				_.each(res['data'], function(e) {
					if (e.booking) {
						var date;
						var color;
						if (e.status == 'New') {
							date = e.expectedAttended;
							color = self.colors.blue;
							if (moment().isAfter(moment(e.expectedAttended))) {
								color = self.colors.red;
							}
						} if (e.attended) {
							date = e.expectedResolved;
							color = self.colors.orange;
							if (moment().isAfter(moment(e.expectedResolved))) {
								color = self.colors.red;
							}
						} if (e.resolved) {
							date = e.expectedClosed;
							color = self.colors.green;
							if (moment().isAfter(moment(e.expectedClosed))) {
								color = self.colors.red;
							}
						}
						if (date) {
							var event = {
								_id: e.id,
								start: moment(date),
								title: e.issue + " from " + e.booking.client.company,
								color: color
							}
							events.push(event);
						}
					}
				})
				self.events = self.initEvents(events);
			})
	}

	changeStatus(status) {
		var self = this;
		var data: any = {
			id: this.ticket.id,
			statusChange: true,
			status: status
		}
		if (status == 'Attended') {
			data.attended = moment().toDate();
		}
		if (status == 'Resolved') {
			data.resolved = moment().toDate();
		}
		if (status == 'Closed') {
			data.closed = moment().toDate();
		}
		this.service.saveTicket(data).pipe(take(1)).subscribe(
			res => {
				self.dialogs.success("Ticket updated successfully ");
				self.getTicket(this.ticket.id);
				this.loadEvents();
			},
			error => {
				self.dialogs.error(error, 'Error while saving')
			}
		)
	}

	message: any;
	saveTicketMessage() {
		let self = this;
		this.loading = true;
		var message: any = {};
		message.ticketId = this.ticket.id;
		message.from = "Internal";
		message.by = this.user.name;
		message.reply = this.message;

		this.service.saveTicketMessage(message).pipe(take(1)).subscribe(
			res => {
				self.dialogs.success("Ticket message is sent successfully ");
				this.messageForm.reset();
				self.loading = false;
				this.message = null;
			},
			error => {
				self.dialogs.error(error, 'Error while saving')
			}
		)
	}

	getTicket(id) {
		this.loading = true;
		this.service.getTicket(id).pipe(take(1)).subscribe(
			res => {
				this.loading = false;
				if (res['data']) {
					this.ticket = res['data'];
				} else {
					this.dialogs.error(res['error']);
				}
			});
	}

	currentEvent: any;
	handleEvent(action: string, event: CalendarAppEvent): void {
		var modal: any = this.ticketModal;
		this.getTicket(event._id);
		this.currentEvent = event;
		const dialogRef = this.dialogs.modal(modal, {});
		dialogRef.result.then(res => {
			console.log("Schedules Component ::: handleEvent :: res :", res);
		}).catch(e => {
			console.log(e);
		});
	}

	public dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
			if (
				(isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
				events.length === 0
			) {
				this.activeDayIsOpen = false;
			} else {
				this.activeDayIsOpen = true;
				this.viewDate = date;
			}
		}
	}

	public eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
		event.start = newStart;
		event.end = newEnd;
	}

}
