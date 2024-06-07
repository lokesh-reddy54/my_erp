import { Injectable } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ComposeDialogComponent } from 'src/app/modules/admin/mails/compose-dialog/compose-dialog.component';
import { NewBookingComponent } from 'src/app/modules/bookings/new-booking/new-booking.component';
import { ResourceBookingComponent } from 'src/app/modules/bookings/resource-booking/new-booking.component';
import { ParkingComponent } from "src/app/modules/bookings/new-parking/new-parking.component";

@Injectable({
  providedIn: "root"
})
export class DialogsService {

  constructor(private toastr: ToastrService, private modalService: NgbModal) {
  }

  public msg(message: string, type?: any, timer?: any) {
    Swal.fire({
      // position: 'top-end',
      type: type || 'success',
      title: message,
      showConfirmButton: true,
      timer: timer ? timer : null
    })
  }

  public prompt(title: string,btnText?: string) {
    return Swal.fire({
      title: title,
      input: 'text',
      showCancelButton: true,
      confirmButtonText: btnText || 'Confirm Reason'
    })
  }
  public confirm(message: string, title?: string) {
    return Swal.fire({
      title: title || '',
      text: message,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, please proceed !'
    })
  }

  public modal(content: any, opts?: any) {
    var options = Object.assign({ size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }, opts || {})
    return this.modalService.open(content, options);
  }

  public closeAll() {
    return this.modalService.dismissAll();
  }

  public composeMail() {
    var options: any = { size: 'xlg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' };
    return this.modalService.open(ComposeDialogComponent, options);
  }

  public newBooking() {
    var options: any = { size: 'xlg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' };
    return this.modalService.open(NewBookingComponent, options);
  }

  public newParking() {
    var options: any = { size: 'xlg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' };
    return this.modalService.open(ParkingComponent, options);
  }

  public newResourceBooking(bookingId?: any, officeId?: any, locationId?: any, client?: any) {
    var options: any = { size: 'xlg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' };
    var modalRef = this.modalService.open(ResourceBookingComponent, options);
    modalRef.componentInstance.bookingId = bookingId;
    modalRef.componentInstance.officeId = officeId;
    modalRef.componentInstance.locationId = locationId;
    modalRef.componentInstance.client = client;
    return modalRef;
  }

  public success(message: string, title?: string) {
    this.toastr.success(message, title || '', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  public info(message: string, title?: string) {
    this.toastr.info(message, title || '', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  public warning(message: string, title?: string) {
    this.toastr.warning(message, title || '', { timeOut: 3000, closeButton: true, progressBar: true });
  }

  public error(message: string, title?: string) {
    this.toastr.error(message, title || '', { timeOut: 3000, closeButton: true, progressBar: true });
  }
}
