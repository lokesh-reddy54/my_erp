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
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { UploadService } from 'src/app/shared/services/upload.service';
import * as moment from "moment";
import * as _ from "lodash";

@Component({
	selector: 'app-resources-calendar',
	templateUrl: './calendar.component.html',
	animations: [SharedAnimations]
})
export class ResourcesCalendarComponent implements OnInit {

	searchControl: FormControl = new FormControl();
	public type: any = 'OnBoarding';
	public loading: any = false;
	public search: any = '';
	public view: any = 'month';
	public viewDate = new Date();
	@ViewChild('onboardingModal') onboardingModal;
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
		}, green: {
			primary: '#54bd05',
			secondary: '#54bd05'
		},
		orange: {
			primary: '#f57c3a',
			secondary: '#f57c3a'
		}
	};
	schedule: any = {};

	constructor(private modalService: NgbModal, private uploadService: UploadService,
		private service: BookingsService, private dialogs: DialogsService) {
		this.actions = [{
			label: '<i class="i-Edit m-1 text-secondary"></i>',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.handleEvent('edit', event);
			}
		}];
	}

	ngOnInit() {
		this.searchControl.valueChanges
			.pipe(debounceTime(200))
			.pipe(take(1)).subscribe(value => {
				this.loadEvents();
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
				search: this.search,
				from: moment(this.viewDate).startOf(this.view),
				to: moment(this.viewDate).endOf(this.view),
			}
		}
		// console.log("SchedulesComponent :: loadEvents : data : ", data);
		var self = this;
		self.service.listResourceBookings(data).pipe(take(1)).subscribe(
			res => {
				var events = [];
				_.each(res['data'], function(e) {
					var event = {
						_id: e.id,
						start: moment(e.from),
						end: moment(e.to),
						title: moment(e.from).format("hh:mm a") + " " + e.resource.name + " (" + e.resource.type + ") @ " + e.resource.office.name + " for " + e.client.company,
						color: self.colors.red,
						data: e
					}
					if (e.status == "Pending" || e.status == "Booked") {
						event.color = self.colors.blue;
					} else if (e.status == "Cancelled") {
						event.color = self.colors.orange;
					} else if (e.status == "Done") {
						event.color = self.colors.green;
					} else {
						event.color = self.colors.red;
					}
					events.push(event);
				})
				self.events = self.initEvents(events);
			})
	}

	currentEvent: any;
	handleEvent(action: string, event: CalendarAppEvent): void {
		console.log("Schedules Component ::: handleEvent :: event :", event);
		this.schedule = event.data;
		const dialogRef = this.dialogs.modal(this.onboardingModal, {});
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

	cancelBooking() {
		this.loading = true;
		this.service.saveResourceBooking({
			id: this.schedule.id,
			bookingId: this.schedule.bookingId,
			status: 'Cancelled',
			cancelled: true
		}).pipe(take(1)).subscribe(res => {
			this.service.saveBooking({ id: this.schedule.bookingId, status: 'Cancelled' })
				.pipe(take(1)).subscribe(res => {
					this.dialogs.success("Booking is cancelled .. !!");
					this.schedule.status = 'Cancelled';
					this.loadEvents();
					this.loading = false;
				})
		})
	}

	markAsDone() {
		this.loading = true;
		this.service.saveResourceBooking({ id: this.schedule.id, status: 'Done' })
			.pipe(take(1)).subscribe(res => {
				this.service.saveBooking({ id: this.schedule.bookingId, status: 'Settled' })
					.pipe(take(1)).subscribe(res => {
						this.dialogs.success("Booking is marked as completed successfully .. !!");
						this.schedule.status = 'Done';
						this.loadEvents();
						this.loading = false;
					})
			})
	}

}
