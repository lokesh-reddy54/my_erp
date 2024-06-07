import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, debounceTime, take } from 'rxjs/operators';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Helpers } from "src/app/helpers";
import { AdminService } from 'src/app/shared/services/admin.service';
import * as _ from "lodash";

@Component({
  selector: 'app-compose-dialog',
  templateUrl: './compose-dialog.component.html',
})
export class ComposeDialogComponent implements OnInit {
  search: FormControl = new FormControl();
  to = new FormControl([]);
  form: FormGroup;
  mail: any = {};
  editorOptions: any = {};
  autocompleteEmails: any = [];
  loading: any = false;

  constructor(private http: HttpClient, public activeModal: NgbActiveModal,
    private service: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      subject: new FormControl("", Validators.required)
    });
  }

  onTextChange(text: any) {
    var data = { filters: { search: text } }
    return this.service.listUsers(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteEmails = res['data'];
      })
  }

  send() {
    // console.log("ComposeDialog ::: to : ", this.form.get('to'));
    console.log("ComposeDialog ::: mail : ", this.mail);
    // console.log("ComposeDialog ::: body : ", $(".fr-element").html());
    var receivers = [];
    _.each(this.mail.receivers, function(r) {
      receivers.push({ name: r.display, email: r.value });
    })
    var data = {
      subject: this.mail.subject,
      body: $(".fr-element").html(),
      receivers: receivers,
      send: true
    }
    this.loading = true;
    this.service.saveMail(data).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        this.activeModal.close(res);
      }, error => {

      })
  }

}
