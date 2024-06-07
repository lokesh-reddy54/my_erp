import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, take } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
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
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	animations: [SharedAnimations]
})
export class CalendarComponent implements OnInit {

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
				type: this.type,
				from: moment(this.viewDate).startOf(this.view),
				to: moment(this.viewDate).endOf(this.view),
			}
		}
		// console.log("SchedulesComponent :: loadEvents : data : ", data);
		var self = this;
		self.service.getSchedules(data).pipe(take(1)).subscribe(
			res => {
				var events = [];
				_.each(res['data'], function(e) {
					if (e.booking) {
						var event = {
							_id: e.id,
							start: moment(e.from),
							end: moment(e.to),
							title: moment(e.from).format("hh:mm a") + " @ " + e.booking.offices + " for " + e.booking.client.company,
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
					}
				})
				self.events = self.initEvents(events);
			})
	}

	getSchedule(id) {
		this.loading = true;
		this.service.getSchedule(id).pipe(take(1)).subscribe(
			res => {
				this.loading = false;
				if (res['data']) {
					this.schedule = res['data'];
				} else {
					this.dialogs.error(res['error']);
				}
			});
	}

	currentEvent: any;
	handleEvent(action: string, event: CalendarAppEvent): void {
		var modal: any = this.onboardingModal;
		if (this.type == "Exit") {
			modal = this.exitModal;
		}
		this.getSchedule(event._id);
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

	companyRegistrationFile: any;
	companyRegistrationFileChange(event) {
		this.companyRegistrationFile = event.target.files[0];
	}

	companyRegistrationUploadResponse: any = { status: '', message: '', filePath: '' };
	companyRegistrationFileError: any;

	uploadCompanyRegistrationFile() {
		const formData = new FormData();
		formData.append('file', this.companyRegistrationFile);

		this.loading = true;
		this.uploadService.upload(formData).subscribe(
			(res) => {
				this.companyRegistrationUploadResponse = res;
				if (res.file) {
					this.loading = false;
					this.schedule.booking.companyRegistration = res;
					this.service.saveClient({ id: this.schedule.booking.client.id, companyRegistrationId: res.id })
						.pipe(take(1)).subscribe(res => this.dialogs.success("Company Registration Certificate uploaded successfully..!!"))
				}
			},
			(err) => this.companyRegistrationFileError = err
		);
	}

	gstRegistrationFile: any;
	gstRegistrationFileChange(event) {
		this.gstRegistrationFile = event.target.files[0];
	}

	gstRegistrationUploadResponse: any = { status: '', message: '', filePath: '' };
	gstRegistrationFileError: any;

	uploadGstRegistrationFile() {
		const formData = new FormData();
		formData.append('file', this.gstRegistrationFile);

		this.loading = true;
		this.uploadService.upload(formData).subscribe(
			(res) => {
				this.gstRegistrationUploadResponse = res;
				if (res.file) {
					this.loading = false;
					this.schedule.booking.gstRegistration = res;
					this.service.saveClient({ id: this.schedule.booking.client.id, gstRegistrationId: res.id })
						.pipe(take(1)).subscribe(res => this.dialogs.success("GST Registration Certificate uploaded successfully..!!"))
				}
			},
			(err) => this.gstRegistrationFileError = err
		);
	}

	panCardFile: any;
	panCardFileChange(event) {
		this.panCardFile = event.target.files[0];
	}

	panCardUploadResponse: any = { status: '', message: '', filePath: '' };
	panCardFileError: any;

	uploadPanCardFile() {
		const formData = new FormData();
		formData.append('file', this.panCardFile);

		this.loading = true;
		this.uploadService.upload(formData).subscribe(
			(res) => {
				this.panCardUploadResponse = res;
				if (res.file) {
					this.loading = false;
					this.schedule.booking.panCard = res;
					this.service.saveClient({ id: this.schedule.booking.client.id, panCardId: res.id })
						.pipe(take(1)).subscribe(res => this.dialogs.success("PAN Card uploaded successfully..!!"))
				}
			},
			(err) => this.panCardFileError = err
		);
	}


	signedAgreementFile: any;
	signedAgreementFileChange(event) {
		this.signedAgreementFile = event.target.files[0];
	}

	signedAgreementUploadResponse: any = { status: '', message: '', filePath: '' };
	signedAgreementFileError: any;

	uploadSignedAgreementFile() {
		const formData = new FormData();
		formData.append('file', this.signedAgreementFile);

		this.loading = true;
		this.uploadService.upload(formData).subscribe(
			(res) => {
				this.signedAgreementUploadResponse = res;
				if (res.file) {
					this.loading = false;
					this.schedule.booking.signedAgreement = res;
					this.service.saveContract({ id: this.schedule.booking.contractId, signedAgreementId: res.id })
						.pipe(take(1)).subscribe(res => this.dialogs.success("Signed Agreement is uploaded successfully..!!"))
				}
			},
			(err) => this.panCardFileError = err
		);
	}

	cancelBooking() {
		this.loading = true;
		this.service.saveBooking({ id: this.schedule.booking.id, status: 'Cancelled' })
			.pipe(take(1)).subscribe(res => {
				this.dialogs.success("Booking is cancelled .. !!");
				this.service.saveSchedule({ id: this.schedule.id, status: 'Cancelled' })
					.pipe(take(1)).subscribe(res => {
						this.getSchedule(this.schedule.id);
						this.loadEvents();
					})
			})
	}

	confirmOnBoarding() {
		this.loading = true;
		this.service.saveBooking({ id: this.schedule.booking.id, status: 'Active', onBoarded:true })
			.pipe(take(1)).subscribe(res => {
				this.dialogs.success("Booking is OnBoarded successfully .. !!");
				this.service.saveSchedule({ id: this.schedule.id, status: 'Done' })
					.pipe(take(1)).subscribe(res => {
						this.getSchedule(this.schedule.id);
						this.loadEvents();
					})
			})
	}

	confirmExited() {
		this.loading = true;
		this.service.saveBooking({ id: this.schedule.booking.id, exited:true, status: 'Exited' })
			.pipe(take(1)).subscribe(res => {
				this.dialogs.success("Booking is Exited successfully .. !!");
				this.service.saveSchedule({ id: this.schedule.id, status: 'Done' })
					.pipe(take(1)).subscribe(res => {
						this.getSchedule(this.schedule.id);
						this.loadEvents();
					})
			})
	}

	reschedule: any = false;
	rescheduleBooking() {
		this.loading = true;
		var from = moment(Utils.ngbDateToDate(this.schedule.forDate)).format("YYYY-MM-DD") + " " + this.schedule.startTime;
		var to = moment(from).clone().add(1,'hours').format("YYYY-MM-DD HH:mm");
		this.service.saveSchedule({ id: this.schedule.id, from: from, to: to })
			.pipe(take(1)).subscribe(res => {
				this.currentEvent.start = from;
				this.currentEvent.end = to;
				this.dialogs.success("OnBoarded is rescheduled successfully .. !!");
				this.getSchedule(this.schedule.id);
				this.reschedule = false;
				this.refresh.next();
				this.loadEvents();
			})
	}

	warnForOnboard(){
		this.dialogs.msg("To mark as OnBoard, you need to confirm contract and upload Signed Agreement")
	}

}
