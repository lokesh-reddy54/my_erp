import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import * as _ from "lodash";
 
@Component({
  selector: 'help-notes',
  templateUrl: './view.component.html'
})
export class HelpNotesComponent implements OnInit {
  @Input('type') type: string = "notes";
  @Input('placement') placement: string = "top";
  @Input('context') context: string = "";
  section: any;
  content: any;
  popOverTitle: any;
  popOverBody: any;

  constructor(private service: AdminService) { }

  ngOnInit() {
    var array = this.context.split(":");
    if (array.length == 1) {
      this.context = array[0];
    } else if (array.length == 2) {
      this.section = array[0];
      this.context = array[1];
    }

    console.log(" helpnotes ::: context :: ", this.context);
    this.service.listHelpNotes({}).subscribe(res => {
      var helpNotes = res['data'];
      var where: any = {
        context: this.context
      }
      if (this.section) {
        where.section = this.section;
      }
      var helpNote = _.find(helpNotes, where);
      if (helpNote) {
        this.content = helpNote.content;
        if(helpNote.file){
          this.popOverTitle = this.content;
          this.popOverBody = "<img src='" + helpNote.file + "'/>";
        }
      }
    })
  }

}
