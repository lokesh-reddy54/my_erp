import { Component, OnInit, ViewChild, TemplateRef, KeyValueChanges, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	isSameDay,
	isSameMonth
} from 'date-fns';
import { CalendarAppEvent } from 'src/app/shared/models/calendar-event.model';
import { Utils } from 'src/app/shared/utils';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import * as moment from "moment";
import * as _ from "lodash";

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	animations: [SharedAnimations]
})
export class CalendarComponent implements OnInit {

	private dateDiffers: KeyValueDiffer<any, any>;
	searchControl: FormControl = new FormControl();
	public status: any = 'Scheduled';
	public loading: any = false;
	public search: any = '';
	public view: any = 'month';
	public viewDate = new Date();
	@ViewChild('visitModal') visitModal;
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
	visit: any = {};

	constructor(private modalService: NgbModal, private service: LeadsService, private dialogs: DialogsService) {
		this.actions = [{
			label: '<i class="i-Edit m-1 text-secondary"></i>',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.handleEvent('edit', event);
			}
		}];
	}

	ngOnInit() {
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
		var data: any = {
			filters: {
				search: this.search,
				status: this.status,
				from: moment(this.viewDate).startOf(this.view),
				to: moment(this.viewDate).endOf(this.view),
			}
		}
		var user: any = localStorage.getItem('cwo_user');
		if (user && user != '') {
			user = JSON.parse(user);
			if (user.geoTags) {
				if (user.geoTags.buildingIds && user.geoTags.buildingIds.length) {
					data.filters.buildingIds = user.geoTags.buildingIds;
				} else if (user.geoTags.locationIds && user.geoTags.locationIds.length) {
					data.filters.locationIds = user.geoTags.locationIds;
				} else if (user.geoTags.cityIds && user.geoTags.cityIds.length) {
					data.filters.cityIds = user.geoTags.cityIds;
				}
			}
		}
		// console.log("SchedulesComponent :: loadEvents : data : ", data);
		var self = this;
		self.service.getVisits(data).pipe(take(1)).subscribe(
			res => {
				var events = [];
				_.each(res['data'], function(e) {
					var event = {
						_id: e.id,
						start: moment(e.date),
						end: moment(e.date).clone().add(1, 'hours'),
						title: moment(e.from).format("hh:mm a") + " @ " + e.office.name + ", " + e.location + " for " + e.lead.name + " (" + e.lead.phone + ") from " + e.lead.companyName,
						color: self.colors.red
					}
					if (e.status == "Scheduled") {
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


	getVisit(id) {
		this.loading = true;
		this.service.getVisit(id).pipe(take(1)).subscribe(
			res => {
				this.loading = false;
				if (res['data']) {
					this.visit = res['data'];
				} else {
					this.dialogs.error(res['error']);
				}
			});
	}

	handleEvent(action: string, event: CalendarAppEvent): void {
		var modal: any = this.visitModal;
		this.getVisit(event._id);
		this.currentEvent = event;
		const dialogRef = this.dialogs.modal(modal, {});
		dialogRef.result.then(res => {
			console.log("Schedules Component ::: handleEvent :: res :", res);
		})
			.catch(e => {
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

	cancelVisit() {
		this.loading = true;
		this.service.saveLeadVisit({ id: this.visit.id, status: 'Cancelled' })
			.pipe(take(1)).subscribe(res => {
				this.dialogs.success("Visit is cancelled .. !!");
				this.getVisit(this.visit.id);
			})
		this.loadEvents();
	}

	confirmVisit() {
		this.loading = true;
		this.service.saveLeadVisit({ id: this.visit.id, status: 'Visited' })
			.pipe(take(1)).subscribe(res => {
				this.dialogs.success("Visit is marked as done successfully .. !!");
				this.getVisit(this.visit.id);
				this.loadEvents();
			})
	}

	revisit: any = false;
	currentEvent: any;
	rescheduleVisit() {
		this.loading = true;
		var from = moment(Utils.ngbDateToDate(this.visit.forDate)).format("YYYY-MM-DD") + " " + this.visit.startTime;
		var to = moment(from).clone().add(1, 'hours').format("YYYY-MM-DD HH:mm");
		this.service.saveLeadVisit({ id: this.visit.id, date: from })
			.pipe(take(1)).subscribe(res => {
				this.currentEvent.start = from;
				this.currentEvent.end = to;
				this.dialogs.success("Visit is rescheduled successfully .. !!");
				this.getVisit(this.visit.id);
				this.revisit = false;
				this.loadEvents();
			})
	}

}
