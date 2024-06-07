import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationService } from '../../../../services/navigation.service';
import { SearchService } from '../../../../services/search.service';
import { AuthService } from '../../../../services/auth.service';
import { AdminService } from '../../../../services/admin.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { DialogsService } from '../../../../services/dialogs.services';
import * as _ from 'lodash';
@Component({
  selector: 'app-header-sidebar-large',
  templateUrl: './header-sidebar-large.component.html'
})
export class HeaderSidebarLargeComponent implements OnInit {

  notifications: any[];
  user: any;

  constructor(
    private navService: NavigationService, public service: AdminService, public router: Router,
    public searchService: SearchService, private dialogsService: DialogsService,
    private auth: AuthService, private socketService: SocketService
  ) {
    var user = window.localStorage.getItem("cwo_user");
    if (user && user != "") {
      this.user = user && JSON.parse(user);
    }

    this.notifications = [];
  }

  ngOnInit() {
    var self = this;
    this.socketService.incomingCall().subscribe(
      data => {
        console.log("AdminLayoutSidebarLargeComponent ::: incomingCall :: data : ", data);
        this.searchService.incomingCall(data);
      })

    window.document.title = this.user.companyName + " - ERP";
    if (this.user.primaryColor && this.user.accentColor) {
      document.documentElement.style.setProperty('--primary-color', this.user.primaryColor);
      document.documentElement.style.setProperty('--accent-color', this.user.accentColor);
    }

    // setTimeout(function(){
    //   self.searchService.incomingCall({from:"7799374473"});
    // }, 1000);

    this.socketService.newMail().subscribe(
      (data: any) => {
        console.log("AdminLayoutSidebarLargeComponent ::: newMail :: data : ", data);
        var notification = {};
        if (data.tags[0] == "support") {
          notification = {
            icon: 'i-Gear',
            title: 'New Support Ticket',
            badge: data.tags[1],
            text: data.subject,
            status: 'danger',
            time: new Date(),
            link: '/support/list'
          }
          this.dialogsService.warning("Got a Ticket, please look into it.", "New Support Ticket")
        } else if (data.tags[0] == "leads") {
          notification = {
            icon: 'i-MaleFemale',
            title: 'New Lead added',
            badge: data.tags[1],
            text: data.subject,
            status: 'primary',
            time: new Date(),
            link: '/leads/list'
          }
          this.dialogsService.success("Got a Lead, please check and callback soon.", "New Lead")
        }
        this.notifications.push(notification);
      })

    this.getUserMessages();

    if(this.detectMob()){
      this.router.navigateByUrl('/mobile/dashboard');
    }
  }

  detectMob() {
    var isMobile = {
      Android: function() {
        return navigator.userAgent.match(/Android/i);
      },
      BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
      },
      Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
      },
      any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
      }
    };

    return isMobile.any();
}

  toggelSidebar() {
    const state = this.navService.sidebarState;
    if (state.childnavOpen && state.sidenavOpen) {
      return state.childnavOpen = false;
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return state.sidenavOpen = false;
    }
    if (!state.sidenavOpen && !state.childnavOpen) {
      state.sidenavOpen = true;
      setTimeout(() => {
        state.childnavOpen = true;
      }, 50);
    }
  }

  signout() {
    this.auth.signout();
  }

  getUserMessages() {
    var data = {
      filters: {
        userId: this.user.id,
        read: 0
      }
    }
    this.service.getUserMessages(data)
      .subscribe(res => {
        var messages = res['data'];
        var self = this;
        _.each(messages, function(msg) {
          var notification:any = {
            icon: 'fa fa-envelope',
            status: 'warning',
            text: msg.message,
            time: msg.date,
          };
          if (msg.module == 'Support') {
            notification.badge = 'Support';
            notification.title = "New Ticket Message";
            notification.link = "#/support/view/" + msg.ticketId;
          }
          self.notifications.push(notification)
        })
      })
  }
}
