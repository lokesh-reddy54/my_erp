import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
  @Input('loading') loading: boolean;
  @Input('btnClass') btnClass: string = "info";
  @Input('type') type: string = "spinner-glow";

  padding:any = "15px";
  constructor() { }

  ngOnInit() {
  	if(this.type == "loader-bubble"){
  		this.padding = 0;
  	}
  }

}
