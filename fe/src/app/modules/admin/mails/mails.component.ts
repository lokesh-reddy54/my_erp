import { Component, OnInit, ViewChild } from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-admin-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.scss'],
  animations: [SharedAnimations]
})
export class MailsComponent implements OnInit {
  selected: any;
  mails: any = [];  
  offset:any = 0;
  limit: any = 20;
  noMoreData: any = false;

  constructor(
    private dialogs: DialogsService,
    private service: AdminService
  ) { }

  ngOnInit() {
    this.loadMore();
  }

  loadMore(){
    if(!this.noMoreData){
    this.service.listMails({offset: this.offset, limit: this.limit, filters:{}})
      .pipe(take(1)).subscribe(res => {
        let result = this.mails.concat(res['data']);
        this.mails = result;
        this.offset = this.offset + this.limit;
        if(res['data'].length < this.limit){
          this.noMoreData = true;
        }
      })
    }
  }

  select(mail) {
    this.selected = mail;
  }

  openComposeModal() {
    var ref = this.dialogs.composeMail();
    var self = this;
    ref.result.then(function(res) {
      if(res['data']){
        self.dialogs.success("Mail successfully sent .. !!");
      } else {
        self.dialogs.error(res['error'],"Error");
      }
    }).catch(function(e) {
        self.dialogs.error(e,"Error");      
    })
  }

}
